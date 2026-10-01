import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file relative to project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Centralised configuration object.
// minor polish
 * All values are validated at startup; the process exits if required vars are missing.
 */
const requiredEnv = [
  'PORT',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ACCESS_TOKEN_TTL',
  'REFRESH_TOKEN_TTL',
  'BCRYPT_SALT_ROUNDS',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

/** @type {import('dotenv').ParsedEnv} */
const env = process.env;

export const config = {
  port: Number(env.PORT),
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtl: Number(env.ACCESS_TOKEN_TTL),
    refreshTtl: Number(env.REFRESH_TOKEN_TTL),
  },
  bcrypt: {
    saltRounds: Number(env.BCRYPT_SALT_ROUNDS),
  },
};