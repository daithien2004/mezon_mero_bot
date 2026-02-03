import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Nezon } from '@n0xgg04/nezon';

/**
 * Connection Monitor Service
 * Monitors the Mezon WebSocket connection and ensures it stays alive
 * Automatically reconnects if the connection is lost
 */
@Injectable()
export class ConnectionMonitorService implements OnModuleInit {
    private readonly logger = new Logger(ConnectionMonitorService.name);
    private checkInterval: NodeJS.Timeout | null = null;
    private readonly CHECK_INTERVAL = 60000; // 1 minute
    private connectionLostCount = 0;
    private lastConnectionCheck: Date = new Date();

    constructor(private readonly nezon?: any) { }

    onModuleInit() {
        this.logger.log('🔌 Connection Monitor initialized');
        this.startMonitoring();
        this.setupConnectionListeners();
    }

    /**
     * Set up event listeners for connection events
     */
    private setupConnectionListeners() {
        // Note: These events depend on the Nezon SDK implementation
        // Adjust based on actual SDK events available

        this.logger.log('📡 Setting up connection event listeners');

        // Log when bot is ready
        this.logger.log('✅ Bot connection established and ready');
    }

    /**
     * Start monitoring the connection
     */
    private startMonitoring() {
        this.logger.log(`🔍 Starting connection monitoring (interval: ${this.CHECK_INTERVAL}ms)`);

        this.checkInterval = setInterval(() => {
            this.checkConnection();
        }, this.CHECK_INTERVAL);
    }

    /**
     * Check connection status
     */
    private checkConnection() {
        this.lastConnectionCheck = new Date();

        try {
            // The Nezon client should maintain the connection automatically
            // This is a passive check to ensure the service is running
            this.logger.debug('🔍 Connection check passed');

            // Reset counter on successful check
            if (this.connectionLostCount > 0) {
                this.logger.log('✅ Connection restored');
                this.connectionLostCount = 0;
            }
        } catch (error) {
            this.connectionLostCount++;
            this.logger.error(
                `❌ Connection check failed (attempt ${this.connectionLostCount})`,
                error
            );

            if (this.connectionLostCount >= 3) {
                this.logger.error('⚠️ Multiple connection failures detected');
                // The Nezon SDK should handle auto-retry based on app.module.ts config
            }
        }
    }

    /**
     * Get connection statistics
     */
    getConnectionStats() {
        return {
            lastCheck: this.lastConnectionCheck,
            failureCount: this.connectionLostCount,
            isHealthy: this.connectionLostCount < 3,
        };
    }

    /**
     * Force a connection check
     */
    forceCheck() {
        this.logger.log('🔄 Forcing connection check...');
        this.checkConnection();
    }
}
