const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default:""
    },
  
    isActive: {
      type: Boolean,
      default:true // Password is required
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);



module.exports = mongoose.model('Poster', posterSchema);
