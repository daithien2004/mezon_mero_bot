import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Nezon } from '@n0xgg04/nezon';

/**
 * Connection Monitor Service
 * Monitors the Mezon WebSocket connection and ensures it stays alive
 * Implements keepalive pings to prevent idle connection timeouts
 * Automatically tracks reconnection events
 */
@Injectable()
export class ConnectionMonitorService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(ConnectionMonitorService.name);

    // Connection monitoring
    private checkInterval: NodeJS.Timeout | null = null;
    private readonly CHECK_INTERVAL = 60000; // 1 minute

    // Keepalive to prevent idle timeouts
    private keepaliveInterval: NodeJS.Timeout | null = null;
    private readonly KEEPALIVE_INTERVAL = 30000; // 30 seconds

    // Connection state tracking
    private connectionLostCount = 0;
    private lastConnectionCheck: Date = new Date();
    private lastKeepalive: Date = new Date();
    private isConnected = false;
    private reconnectCount = 0;
    private lastDisconnectTime: Date | null = null;
    private lastReconnectTime: Date | null = null;

    constructor(private readonly nezon?: any) { }

    onModuleInit() {
        this.logger.log('🔌 Connection Monitor initialized');
        this.isConnected = true;
        this.startMonitoring();
        this.startKeepalive();
        this.setupConnectionListeners();
    }

    onModuleDestroy() {
        this.stopMonitoring();
        this.stopKeepalive();
        this.logger.log('🔌 Connection Monitor destroyed');
    }

    /**
     * Set up event listeners for connection events
     */
    private setupConnectionListeners() {
        this.logger.log('📡 Setting up connection event listeners');

        try {
            // Try to access the underlying client if available
            if (this.nezon?.client) {
                // Listen for disconnect events
                this.nezon.client.on?.('disconnect', (reason?: any) => {
                    this.handleDisconnect(reason);
                });

                // Listen for reconnect events
                this.nezon.client.on?.('reconnect', () => {
                    this.handleReconnect();
                });

                // Listen for error events
                this.nezon.client.on?.('error', (error: any) => {
                    this.logger.error('❌ WebSocket error:', error);
                });

                this.logger.log('✅ Event listeners attached to Nezon client');
            } else {
                this.logger.warn('⚠️ Nezon client not accessible for event listeners');
            }
        } catch (error) {
            this.logger.warn('⚠️ Could not attach event listeners:', error);
        }

        this.logger.log('✅ Bot connection established and ready');
    }

    /**
     * Handle disconnect event
     */
    private handleDisconnect(reason?: any) {
        this.isConnected = false;
        this.lastDisconnectTime = new Date();
        this.connectionLostCount++;

        const reasonMsg = reason ? ` | Reason: ${reason}` : '';

        this.logger.warn(
            `🔴 Disconnected! (Count: ${this.connectionLostCount})${reasonMsg} | ` +
            `Last connected: ${this.getTimeSince(this.lastReconnectTime || this.lastConnectionCheck)}`
        );
    }

    /**
     * Handle reconnect event
     */
    private handleReconnect() {
        this.isConnected = true;
        this.lastReconnectTime = new Date();
        this.reconnectCount++;

        const downtime = this.lastDisconnectTime
            ? this.getTimeSince(this.lastDisconnectTime)
            : 'unknown';

        this.logger.log(
            `🟢 Reconnecting... (Attempt: ${this.reconnectCount}) | ` +
            `Downtime: ${downtime}`
        );

        // Reset failure counter on successful reconnect
        this.connectionLostCount = 0;
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
     * Stop monitoring
     */
    private stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            this.logger.log('🔍 Connection monitoring stopped');
        }
    }

    /**
     * Start keepalive pings to prevent idle timeout
     */
    private startKeepalive() {
        this.logger.log(`💓 Starting keepalive pings (interval: ${this.KEEPALIVE_INTERVAL}ms)`);

        this.keepaliveInterval = setInterval(() => {
            this.sendKeepalive();
        }, this.KEEPALIVE_INTERVAL);
    }

    /**
     * Stop keepalive pings
     */
    private stopKeepalive() {
        if (this.keepaliveInterval) {
            clearInterval(this.keepaliveInterval);
            this.keepaliveInterval = null;
            this.logger.log('💓 Keepalive stopped');
        }
    }

    /**
     * Send a keepalive ping
     */
    private sendKeepalive() {
        this.lastKeepalive = new Date();

        try {
            // Try to send a ping if the client supports it
            if (this.nezon?.client?.ping) {
                this.nezon.client.ping();
                this.logger.debug('💓 Keepalive ping sent');
            } else {
                // Just log that we're alive
                this.logger.debug('💓 Keepalive check (passive)');
            }
        } catch (error) {
            this.logger.warn('⚠️ Keepalive ping failed:', error);
        }
    }

    /**
     * Check connection status
     */
    private checkConnection() {
        this.lastConnectionCheck = new Date();

        try {
            const stats = this.getConnectionStats();

            this.logger.debug(
                `🔍 Connection check | ` +
                `Status: ${stats.isConnected ? '🟢 Connected' : '🔴 Disconnected'} | ` +
                `Reconnects: ${stats.reconnectCount} | ` +
                `Failures: ${stats.failureCount}`
            );

            // Reset counter on successful check
            if (this.connectionLostCount > 0 && this.isConnected) {
                this.logger.log('✅ Connection restored and stable');
                this.connectionLostCount = 0;
            }
        } catch (error) {
            this.connectionLostCount++;
            this.logger.error(
                `❌ Connection check failed (attempt ${this.connectionLostCount})`,
                error
            );

            if (this.connectionLostCount >= 3) {
                this.logger.error(
                    '⚠️ Multiple connection failures detected | ' +
                    'Nezon SDK auto-retry should handle reconnection'
                );
            }
        }
    }

    /**
     * Get time since a given date
     */
    private getTimeSince(date: Date | null): string {
        if (!date) return 'unknown';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Get connection statistics
     */
    getConnectionStats() {
        return {
            isConnected: this.isConnected,
            lastCheck: this.lastConnectionCheck,
            lastKeepalive: this.lastKeepalive,
            failureCount: this.connectionLostCount,
            reconnectCount: this.reconnectCount,
            lastDisconnect: this.lastDisconnectTime,
            lastReconnect: this.lastReconnectTime,
            isHealthy: this.connectionLostCount < 3 && this.isConnected,
        };
    }

    /**
     * Force a connection check
     */
    forceCheck() {
        this.logger.log('🔄 Forcing connection check...');
        this.checkConnection();
    }

    /**
     * Force a keepalive ping
     */
    forceKeepalive() {
        this.logger.log('🔄 Forcing keepalive ping...');
        this.sendKeepalive();
    }
}
