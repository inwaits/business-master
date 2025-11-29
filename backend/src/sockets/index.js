const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt.util');

/**
 * Initialize Socket.io
 * @param {object} server - HTTP server
 */
function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  // Make io globally accessible
  global.io = io;

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id} (User: ${socket.userId})`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join role-based room
    socket.join(`role:${socket.userRole}`);

    // Handle join room
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`📍 User ${socket.userId} joined room: ${room}`);
    });

    // Handle leave room
    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`📍 User ${socket.userId} left room: ${room}`);
    });

    // Handle mark notification as read
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        const { markAsRead } = require('../services/notification.service');
        await markAsRead(notificationId, socket.userId);
        socket.emit('notification_marked_read', { notificationId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });

    // Handle typing indicator (for future chat feature)
    socket.on('typing_start', (data) => {
      socket.to(data.room).emit('user_typing', {
        userId: socket.userId,
        room: data.room,
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.room).emit('user_stopped_typing', {
        userId: socket.userId,
        room: data.room,
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Emit event to specific user
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToUser(userId, event, data) {
  if (global.io) {
    global.io.to(`user:${userId}`).emit(event, data);
  }
}

/**
 * Emit event to multiple users
 * @param {Array} userIds - Array of user IDs
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToUsers(userIds, event, data) {
  if (global.io) {
    userIds.forEach((userId) => {
      global.io.to(`user:${userId}`).emit(event, data);
    });
  }
}

/**
 * Emit event to all users with specific role
 * @param {string} role - User role
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToRole(role, event, data) {
  if (global.io) {
    global.io.to(`role:${role}`).emit(event, data);
  }
}

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {object} data - Event data
 */
function emitToAll(event, data) {
  if (global.io) {
    global.io.emit(event, data);
  }
}

module.exports = {
  initializeSocket,
  emitToUser,
  emitToUsers,
  emitToRole,
  emitToAll,
};

