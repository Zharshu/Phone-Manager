
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());

// Serve uploads folder statically for image access
app.use('/uploads', express.static('uploads'));

// Apply body parsers selectively to routes that do not handle file uploads
app.use('/api/auth', express.json({ limit: '10mb' }));
app.use('/api/auth', express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
