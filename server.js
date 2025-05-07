const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const config = require('./config/config'); // ✅ Missing import added
const authRoutes = require('./Routes/authRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');
const myWorkRoutes = require('./Routes/myWorkRoutes');


dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/myWork', myWorkRoutes);


// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
