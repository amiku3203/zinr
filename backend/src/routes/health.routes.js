 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({
        success: true,
        message: 'API is running 🚀',
        database: dbStatus
    });
});

module.exports = router;
