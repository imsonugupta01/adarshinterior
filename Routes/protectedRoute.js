const express = require('express');
const router = express.Router();
const verifyToken = require('../Middlewares/authMiddleware');

router.get('/profile', verifyToken, (req, res) => {
  res.json({
    msg: 'Protected profile data',
    user: req.user,
  });
});

module.exports = router;
