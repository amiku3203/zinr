 
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`🔌 New socket connection: ${socket.id}`);

  // Join restaurant room
  socket.on('join-restaurant', (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    logger.info(`🏪 Socket ${socket.id} joined restaurant ${restaurantId}`);
  });

  // Leave restaurant room
  socket.on('leave-restaurant', (restaurantId) => {
    socket.leave(`restaurant-${restaurantId}`);
    logger.info(`🏪 Socket ${socket.id} left restaurant ${restaurantId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// Make io available globally
global.io = io;

connectDB().then(() => {
  server.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
});

process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received. Closing server...');
  process.exit(0);
});
