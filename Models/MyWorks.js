const mongoose = require('mongoose');

const myWorkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  files: {
    type: [String], // or define an object schema if needed
    default: [],
  },
  tags:{
    type:[String],
    default:[]
  }
}, { timestamps: true });

module.exports = mongoose.model('MyWork', myWorkSchema);
