// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');        // ← Import routes
const requestRoutes = require('./routes/requestRoutes');  // ← Import routes
const itemRoutes = require('./routes/itemRoutes');        // ← Import routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);        // ← Use auth routes
app.use('/api/requests', requestRoutes); // ← Use request routes
app.use('/api/items', itemRoutes);       // ← Use item routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Boat Supply System API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
});
