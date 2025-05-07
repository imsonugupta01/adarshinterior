const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/serviceController');
const verifyToken = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/uploadMiddleware');

// ✅ Create service (with a single picture & video uploaded to Cloudinary)
router.post(
  '/create',
  upload.fields([
    { name: 'pictures', maxCount: 1 },  // Only 1 picture allowed
    { name: 'videos', maxCount: 1 }     // Only 1 video allowed
  ]),
  serviceController.createService
);

// ✅ Update entire service (including media)
router.put(
  '/update/:id',
  verifyToken,
  upload.fields([
    { name: 'pictures', maxCount: 1 },  // Only 1 picture allowed
    { name: 'videos', maxCount: 1 }     // Only 1 video allowed
  ]),
  serviceController.updateService
);

// ✅ Update isActive status only
router.put('/update-status/:id', verifyToken, serviceController.updateStatus);

// ✅ Get all services
router.get('/all', serviceController.getAllServices);

// ✅ Get service by ID
router.get('/:id', serviceController.getServiceById);

// ✅ Delete service
router.delete('/delete/:id', verifyToken, serviceController.deleteService);

module.exports = router;
