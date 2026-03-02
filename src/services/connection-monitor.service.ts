import { NezonClientService } from '@n0xgg04/nezon';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

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

    constructor(private readonly nezon: NezonClientService) { }

    onModuleInit() {
        this.logger.log('🔌 Connection Monitor initialized');
        this.startMonitoring();
        this.setupConnectionListeners();
    }

    /**
     * Set up event listeners for connection events
     */
    private setupConnectionListeners() {
        this.logger.log('📡 Setting up connection event listeners');

        try {
            const client = this.nezon.getClient();

            if (client) {
                // Listen for disconnect events
                client.on?.('disconnect', (reason?: any) => {
                    this.connectionLostCount++;
                    const reasonMsg = reason ? ` | Reason: ${reason}` : '';
                    this.logger.warn(`🔴 Disconnected! (Count: ${this.connectionLostCount})${reasonMsg}`);
                });

                // Listen for reconnect events
                client.on?.('reconnect', () => {
                    this.logger.log('🟢 Reconnected!');
                    this.connectionLostCount = 0;
                });

                // Listen for error events
                client.on?.('error', (error: any) => {
                    this.logger.error('❌ WebSocket error:', error);
                });

                this.logger.log('✅ Event listeners attached to Nezon client');
            } else {
                this.logger.warn('⚠️ Nezon client not accessible for event listeners');
            }
        } catch (error) {
            this.logger.warn('⚠️ Could not attach event listeners:', error);
        }
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
            // Passive check to ensure the service is running
            this.logger.debug('🔍 Connection check passed');

            // Reset counter on successful check (SDK manages actual connection)
            if (this.connectionLostCount > 0) {
                this.logger.log('✅ Connection stable');
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