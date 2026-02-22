export const env = {
  PORT: Number(process.env.PORT || 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_DB: process.env.MONGO_DB || 'auth_demo',

  JWT_ISSUER: process.env.JWT_ISSUER || 'app',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'web',
  JWT_ACCESS_TOKEN_TTL: process.env.JWT_ACCESS_TOKEN_TTL || '900s',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
  JWT_REFRESH_TOKEN_TTL: process.env.JWT_REFRESH_TOKEN_TTL || '30d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || '',
  COOKIE_SECURE: (process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};

export function assertEnv() {
  const missing: string[] = [];
  [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'MONGO_URI',
    'MONGO_DB',
  ].forEach((k) => {
    const val = (env as any)[k];
    if (!val) missing.push(k);
  });
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error('Missing env vars:', missing.join(', '));
    process.exit(1);
  }
}