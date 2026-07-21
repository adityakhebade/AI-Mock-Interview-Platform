// Test environment setup - override readonly restriction for test config
/* eslint-disable @typescript-eslint/no-explicit-any */
(process.env as any).NODE_ENV = 'test';
(process.env as any).CLERK_SECRET_KEY =
  process.env.CLERK_SECRET_KEY ?? 'sk_test_mock_secret_key';
(process.env as any).CLERK_PUBLISHABLE_KEY =
  process.env.CLERK_PUBLISHABLE_KEY ?? 'pk_test_mock_publishable_key';
(process.env as any).CLERK_AUTHORIZED_PARTIES =
  process.env.CLERK_AUTHORIZED_PARTIES ?? 'http://localhost:3000';
(process.env as any).DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://test:test@localhost:5432/intervuex_test?schema=public';
(process.env as any).CORS_ORIGIN = 'http://localhost:3000';
/* eslint-enable @typescript-eslint/no-explicit-any */
