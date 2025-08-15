// src/routes/index.js
const express = require('express');
const router = express.Router();

 
const healthRoutes = require('./health.routes.js');
 

// Mount routes
router.use('/health', healthRoutes);
 

module.exports = router;
