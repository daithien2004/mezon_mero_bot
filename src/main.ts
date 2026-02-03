import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { validateEnvironment, displayTroubleshootingHelp } from './utils/env-validator';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Validate environment variables BEFORE starting the app
  if (!validateEnvironment()) {
    displayTroubleshootingHelp();
    logger.error('❌ Cannot start bot with invalid configuration');
    process.exit(1);
  }


  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    // Enable CORS for cloud deployment
    app.enableCors();

    // Get port from environment variable (Koyeb, Heroku, etc.) or default to 3000
    const port = process.env.PORT || 3000;

    // Bind to 0.0.0.0 for cloud deployment (not localhost)
    // This is critical for Koyeb, Heroku, Railway, etc.
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Bot application is running on: http://0.0.0.0:${port}`);
    logger.log(`🔌 Health check: http://0.0.0.0:${port}/health`);
    logger.log(`📊 Ping endpoint: http://0.0.0.0:${port}/ping`);

    // Log environment info (without sensitive data)
    logger.log(`📦 Node version: ${process.version}`);
    logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`🤖 Bot ID configured: ${process.env.MEZON_BOT_ID ? 'YES' : 'NO'}`);
    logger.log(`🔑 Token configured: ${process.env.MEZON_TOKEN ? 'YES' : 'NO'}`);

  } catch (error) {
    logger.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();

