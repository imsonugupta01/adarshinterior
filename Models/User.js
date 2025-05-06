const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows only unique non-null values
      required: false, // Email is optional
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true, // Allows only unique non-null values
      required: false, // Mobile is optional
    },
    password: {
      type: String,
      required: true, // Password is required
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Custom validation to ensure at least one field is provided (email or mobile)
userSchema.pre('save', function (next) {
  if (!this.email && !this.mobile) {
    return next(new Error('Either email or mobile must be provided.'));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
