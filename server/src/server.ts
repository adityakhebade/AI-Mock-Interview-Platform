import app from './app.js';
import config from './config/index.js';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║               IntervueX Backend API Server                 ║
║                                                            ║
║  Environment: ${config.nodeEnv.padEnd(44)} ║
║  Port:        ${config.port.toString().padEnd(44)} ║
║  API Version: ${config.apiVersion.padEnd(44)} ║
║                                                            ║
║  Server running at: http://localhost:${config.port.toString().padEnd(19)} ║
║  Health check:      http://localhost:${config.port}/api/${config.apiVersion}/health  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();
