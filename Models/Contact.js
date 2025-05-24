// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validate 10 digit number
      },
      message: 'Phone number must be 10 digits!',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isContacted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
