const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  pictures: String,   
  videos: String,     
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
