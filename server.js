const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const config = require('./config/config'); // ✅ Missing import added
const authRoutes = require('./Routes/authRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');
const myWorkRoutes =require('./Routes/myWorkRoutes')
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/works',myWorkRoutes)

app.get("/", (req, res) => {
    res.send("Live");
  });
// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
