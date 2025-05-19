const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.mp4'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .mp4 files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
