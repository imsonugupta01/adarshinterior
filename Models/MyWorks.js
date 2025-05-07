const mongoose = require('mongoose');

const myWorkSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photo: {
      type: String,
    },
  video:{
      type: String,
    },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MyWork', myWorkSchema);
