const express = require('express');
const router = express.Router();
const uploadController = require('../Controllers/uploadController');

// Upload image route
router.post('/upload', 
  uploadController.uploadMiddleware, 
  uploadController.uploadImage
);

router.get('/findAll',uploadController.getAllPosters)
router.delete('/delete',uploadController.deletePoster)



module.exports = router;