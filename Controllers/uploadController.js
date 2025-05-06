const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary =require("../config/cloudinary");
const Poster = require('../Models/Poster');

// Middleware for handling file upload
const uploadMiddleware = upload.single('image');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const {text}=req.body;

    // Upload image to Cloudinary
    const result = await  cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads', // Optional folder in Cloudinary
      use_filename: true,
      unique_filename: false,
    });

    // You might want to delete the temporary file after upload
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

   const poster= new Poster({text:text,image_url:result.secure_url})
   await poster.save()

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