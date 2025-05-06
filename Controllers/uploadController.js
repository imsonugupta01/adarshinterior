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

module.exports = {
  uploadMiddleware,
  uploadImage,
};
