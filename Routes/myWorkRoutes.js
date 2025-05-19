const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/multer');
const {
  createMyWork,
  getAllMyWork,
  getMyWorkById,
  updateMyWork,
  deleteMyWork,
  getMyWorkByType,
} = require('../Controllers/myWorkController');

// POST route — accepts only one file (photo or video) at a time
router.post(
  '/',
  upload.array('files', 10), // allow uploading up to 10 files
  createMyWork
);

router.get('/', getAllMyWork);
router.get('/:id', getMyWorkById);
router.put('/type/:type', getMyWorkByType);
router.delete('/:id', deleteMyWork);

module.exports = router;
