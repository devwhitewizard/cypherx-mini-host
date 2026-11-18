import 'dotenv/config';

const rawPort = Number(process.env.PORT);

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  cypherxBaseUrl: (
    process.env.CYPHERX_BASE_URL || 'https://platform.cypherx.store/api/v1'
  ).replace(/\/+$/, ''),
  cypherxApiKey: process.env.CYPHERX_API_KEY || '',
});

export function isCypherxConfigured() {
  return Boolean(
    env.cypherxApiKey && env.cypherxApiKey !== 'YOUR_API_KEY_HERE'
  );
}

