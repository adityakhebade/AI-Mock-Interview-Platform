import dotenv from 'dotenv';

dotenv.config();

interface ClerkConfig {
  secretKey: string;
  publishableKey: string;
  authorizedParties: string[];
  jwtKey?: string;
}

interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  corsOrigin: string;
  clerk: ClerkConfig;
}

const parseAuthorizedParties = (value: string | undefined): string[] => {
  if (!value) {
    return ['http://localhost:3000'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  clerk: {
    secretKey: requireEnv('CLERK_SECRET_KEY', process.env.CLERK_SECRET_KEY),
    publishableKey: requireEnv(
      'CLERK_PUBLISHABLE_KEY',
      process.env.CLERK_PUBLISHABLE_KEY
    ),
    authorizedParties: parseAuthorizedParties(
      process.env.CLERK_AUTHORIZED_PARTIES
    ),
    jwtKey: process.env.CLERK_JWT_KEY,
  },
};

export default config;
