const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const config = require('./config/config');
const authRoutes = require('./Routes/authRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');
const serviceRoutes = require('./Routes/serviceRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());



// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get("/", (req, res) => res.send("Live"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
