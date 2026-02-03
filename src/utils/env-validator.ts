/**
 * Environment Validation Script
 * Validates required environment variables before starting the bot
 * Helps diagnose "channel id not connect" issues
 */

import { Logger } from '@nestjs/common';

const logger = new Logger('EnvValidator');

export function validateEnvironment(): boolean {
    logger.log('🔍 Validating environment configuration...');

    let isValid = true;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required environment variables
    const required = {
        MEZON_TOKEN: process.env.MEZON_TOKEN,
        MEZON_BOT_ID: process.env.MEZON_BOT_ID,
    };

    // Optional but recommended
    const optional = {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
    };

    // Check required variables
    for (const [key, value] of Object.entries(required)) {
        if (!value || value.trim() === '') {
            errors.push(`❌ Missing required environment variable: ${key}`);
            isValid = false;
        } else {
            // Validate format (basic check)
            if (key === 'MEZON_TOKEN' && value.length < 10) {
                warnings.push(`⚠️ ${key} seems too short (${value.length} chars)`);
            }
            if (key === 'MEZON_BOT_ID' && value.length < 5) {
                warnings.push(`⚠️ ${key} seems too short (${value.length} chars)`);
            }
            logger.log(`✅ ${key}: configured (${value.length} chars)`);
        }
    }

    // Check optional variables
    for (const [key, value] of Object.entries(optional)) {
        if (!value) {
            warnings.push(`⚠️ Optional variable not set: ${key} (using default)`);
        } else {
            logger.log(`✅ ${key}: ${value}`);
        }
    }

    // Display results
    if (errors.length > 0) {
        logger.error('❌ Environment validation FAILED:');
        errors.forEach(err => logger.error(err));
        logger.error('');
        logger.error('💡 Fix:');
        logger.error('1. Create .env file in project root');
        logger.error('2. Add: MEZON_TOKEN=your_token_here');
        logger.error('3. Add: MEZON_BOT_ID=your_bot_id_here');
        logger.error('');
        logger.error('For cloud deployment (Koyeb, Heroku, etc.):');
        logger.error('Set environment variables in your platform dashboard');
        logger.error('');
    }

    if (warnings.length > 0) {
        logger.warn('⚠️ Warnings:');
        warnings.forEach(warn => logger.warn(warn));
        logger.warn('');
    }

    if (isValid && warnings.length === 0) {
        logger.log('✅ Environment validation PASSED');
        logger.log('');
    }

    // Additional diagnostics
    logger.log('📊 System Information:');
    logger.log(`   Node version: ${process.version}`);
    logger.log(`   Platform: ${process.platform}`);
    logger.log(`   Architecture: ${process.arch}`);
    logger.log(`   Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB used`);
    logger.log('');

    return isValid;
}

/**
 * Display helpful error message for common issues
 */
export function displayTroubleshootingHelp(): void {
    logger.error('');
    logger.error('🆘 TROUBLESHOOTING GUIDE');
    logger.error('═══════════════════════════════════════════════════════');
    logger.error('');
    logger.error('Issue: "Channel ID Not Connect"');
    logger.error('');
    logger.error('Common Causes:');
    logger.error('1. Missing or invalid MEZON_TOKEN');
    logger.error('2. Missing or invalid MEZON_BOT_ID');
    logger.error('3. Bot not registered in Mezon');
    logger.error('4. Bot lacks channel permissions');
    logger.error('5. Network/firewall blocking WebSocket connection');
    logger.error('');
    logger.error('Solutions:');
    logger.error('');
    logger.error('Local Development:');
    logger.error('  1. Create .env file:');
    logger.error('     MEZON_TOKEN=your_actual_token');
    logger.error('     MEZON_BOT_ID=your_actual_bot_id');
    logger.error('  2. Restart the bot');
    logger.error('');
    logger.error('Cloud Deployment (Koyeb):');
    logger.error('  1. Go to Koyeb dashboard → Your app → Settings');
    logger.error('  2. Add environment variables:');
    logger.error('     MEZON_TOKEN=your_actual_token');
    logger.error('     MEZON_BOT_ID=your_actual_bot_id');
    logger.error('  3. Redeploy the app');
    logger.error('');
    logger.error('Verify Credentials:');
    logger.error('  1. Check Mezon bot dashboard');
    logger.error('  2. Regenerate token if needed');
    logger.error('  3. Verify bot ID is correct');
    logger.error('');
    logger.error('Check Logs:');
    logger.error('  Local: npm run start:dev');
    logger.error('  Koyeb: View logs in dashboard');
    logger.error('');
    logger.error('Test Health:');
    logger.error('  curl http://localhost:3000/health');
    logger.error('  curl https://your-app.koyeb.app/health');
    logger.error('');
    logger.error('═══════════════════════════════════════════════════════');
    logger.error('');
}
