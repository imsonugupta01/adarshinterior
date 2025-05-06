const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const config = require('./config/config'); // ✅ Missing import added
const authRoutes = require('./Routes/authRoutes');

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
