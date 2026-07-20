import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import config from './config/index.js';
import {
  helmetConfig,
  cors,
  corsOptions,
  devLogger,
  logger,
  errorHandler,
  notFoundHandler,
} from './middleware/index.js';
import routes from './routes/index.js';

const app: Application = express();

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(devLogger);
} else {
  app.use(logger);
}

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'IntervueX API',
    data: {
      version: config.apiVersion,
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
