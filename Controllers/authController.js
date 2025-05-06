const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Ensure that either email or mobile is provided
    if (!email && !mobile) {
      return res.status(400).json({ msg: 'Email ya mobile dena zaruri hai' });
    }

    // Check if user already exists by email or mobile
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email: email || null,
      mobile: mobile || null,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
  //  console.log(req.body)
    if (!email && !mobile) {
      return res.status(400).json({ msg: 'Email ya mobile dena zaruri hai' });
    }

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token + user info in response
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
