import app from './app.js';
import config from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║  IntervueX Backend Server                                  ║');
  console.log('║                                                            ║');
  console.log(`║  Environment: ${config.nodeEnv.padEnd(44)}║`);
  console.log(`║  Port:        ${PORT.toString().padEnd(44)}║`);
  console.log('║                                                            ║');
  console.log(`║  Server running at: http://localhost:${PORT}                  ║`);
  console.log(`║  Health check:      http://localhost:${PORT}/health          ║`);
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
