const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/multer');
const {
  createMyWork,
  getAllMyWork,
  getMyWorkById,
  updateMyWork,
  deleteMyWork,
} = require('../Controllers/myWorkController');

// POST route — accepts only one file (photo or video) at a time
router.post(
  '/',
  upload.single('file'), // field name should be 'file' in the request
  createMyWork
);

router.get('/', getAllMyWork);
router.get('/:id', getMyWorkById);
router.put('/:id', updateMyWork);
router.delete('/:id', deleteMyWork);

module.exports = router;
