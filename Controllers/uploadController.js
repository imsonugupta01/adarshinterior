const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require("../config/cloudinary");
const Poster = require('../Models/Poster');

// ✅ Use a writable temp directory (works in AWS Lambda)
const uploadPath = '/tmp/uploads';
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1691456000000.png
  }
});

const upload = multer({ storage });
const uploadMiddleware = upload.single('image');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { text } = req.body;

    // ✅ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
      use_filename: true,
      unique_filename: false,
    });

    // ✅ Delete temp file after upload
    fs.unlinkSync(req.file.path);

    const poster = new Poster({
      text: text,
      image_url: result.secure_url
    });
    await poster.save();

    res.status(200).json({
      message: 'Image uploaded successfully',
      poster: poster,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

const getAllPosters = async (req, res) => {
    try {
        const posters = await Poster.find().sort({ createdAt: -1 }); // Get all posters sorted by newest first
        
        if (!posters || posters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posters found'
            });
        }

        res.status(200).json({
            success: true,
            count: posters.length,
            data: posters
        });

    } catch (error) {
        console.error('Error fetching posters:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching posters',
            error: error.message
        });
    }
};


const deletePoster = async (req, res) => {
  try {
    const poster = await Poster.findById(req.body.id);

    if (!poster) {
      return res.status(404).json({ message: "Poster not found" });
    }

    await poster.deleteOne();

    return res.status(200).json({ message: "Poster deleted successfully" });
  } catch (error) {
    console.error("Error deleting poster:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  uploadMiddleware,
  uploadImage,
  getAllPosters,
  deletePoster
};
