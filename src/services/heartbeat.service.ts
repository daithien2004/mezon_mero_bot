import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

/**
 * Heartbeat Service
 * Keeps the bot alive by running periodic tasks
 * Prevents the bot from timing out when no users are connected
 */
@Injectable()
export class HeartbeatService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(HeartbeatService.name);
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
    private startTime: Date;
    private heartbeatCount = 0;

    onModuleInit() {
        this.startTime = new Date();
        this.logger.log('🫀 Heartbeat Service initialized');
        this.startHeartbeat();
    }

    onModuleDestroy() {
        this.stopHeartbeat();
        this.logger.log('🫀 Heartbeat Service destroyed');
    }

    /**
     * Start the heartbeat interval
     */
    private startHeartbeat() {
        if (this.heartbeatInterval) {
            this.logger.warn('Heartbeat already running');
            return;
        }

        this.logger.log(`🫀 Starting heartbeat (interval: ${this.HEARTBEAT_INTERVAL}ms)`);

        // Initial heartbeat
        this.sendHeartbeat();

        // Set up interval
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, this.HEARTBEAT_INTERVAL);
    }

    /**
     * Stop the heartbeat interval
     */
    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
            this.logger.log('🫀 Heartbeat stopped');
        }
    }

    /**
     * Send a heartbeat ping
     */
    private sendHeartbeat() {
        this.heartbeatCount++;
        const uptime = this.getUptime();

        this.logger.debug(
            `💓 Heartbeat #${this.heartbeatCount} | Uptime: ${uptime}`
        );

        // You can add additional health checks here
        // For example: check memory usage, active connections, etc.
        const memoryUsage = process.memoryUsage();
        const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

        if (this.heartbeatCount % 10 === 0) {
            // Log detailed info every 10 heartbeats (5 minutes)
            this.logger.log(
                `💓 Heartbeat #${this.heartbeatCount} | ` +
                `Uptime: ${uptime} | ` +
                `Memory: ${memoryMB}MB`
            );
        }
    }

    /**
     * Get formatted uptime
     */
    private getUptime(): string {
        const now = new Date();
        const uptimeMs = now.getTime() - this.startTime.getTime();

        const seconds = Math.floor(uptimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Get bot statistics
     */
    getStats() {
        return {
            uptime: this.getUptime(),
            heartbeatCount: this.heartbeatCount,
            startTime: this.startTime,
            memoryUsage: process.memoryUsage(),
        };
    }

    /**
     * Restart heartbeat (useful for debugging)
     */
    restart() {
        this.logger.log('🔄 Restarting heartbeat...');
        this.stopHeartbeat();
        this.startHeartbeat();
    }
}
