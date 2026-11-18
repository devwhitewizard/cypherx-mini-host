import app from './app.js';
import { env, isCypherxConfigured } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(
    `CypherX Dashboard backend running on http://localhost:${env.port} (${env.nodeEnv})`
  );

  if (!isCypherxConfigured()) {
    console.warn(
      'Warning: CYPHERX_API_KEY is not set in .env. External CypherX API requests will fail until configured.'
    );
  }
});

function shutdown(signal) {
  console.log(`\nReceived ${signal}. Closing HTTP server...`);

  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err.message);
      process.exit(1);
    }
    console.log('HTTP server closed cleanly.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

