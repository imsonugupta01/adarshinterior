const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'services',
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    public_id: `${file.fieldname}-${Date.now()}`
  }),
});

const upload = multer({ storage });

module.exports = upload;
