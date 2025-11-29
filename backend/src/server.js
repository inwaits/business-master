const app = require('./app');
const http = require('http');
const { initializeSocket } = require('./sockets');
const { connectDatabase } = require('./config/database');

// Initialize cron jobs
require('./jobs');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Make io accessible to our router
app.set('io', io);

// Connect to database
connectDatabase();

// Start server
server.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║     🎓 BUSINESS MASTER - Tutor Management System         ║
  ║                                                           ║
  ║     🚀 Server: http://localhost:${PORT}                     ║
  ║     📝 API Docs: http://localhost:${PORT}/api/v1/health     ║
  ║     🌍 Environment: ${process.env.NODE_ENV || 'development'}                           ║
  ║     🔌 Socket.io: Active                                  ║
  ║     ⏰ Cron Jobs: Running                                 ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
