import { Controller, Get } from '@nestjs/common';
import { HeartbeatService } from './services/heartbeat.service';
import { ConnectionMonitorService } from './services/connection-monitor.service';

@Controller()
export class HealthController {
  constructor(
    private readonly heartbeatService: HeartbeatService,
    private readonly connectionMonitor: ConnectionMonitorService,
  ) { }

  @Get('health')
  getHealth() {
    const heartbeatStats = this.heartbeatService.getStats();
    const connectionStats = this.connectionMonitor.getConnectionStats();

    return {
      statusCode: 200,
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: heartbeatStats.uptime,
      heartbeat: {
        count: heartbeatStats.heartbeatCount,
        startTime: heartbeatStats.startTime,
      },
      connection: {
        healthy: connectionStats.isHealthy,
        lastCheck: connectionStats.lastCheck,
        failureCount: connectionStats.failureCount,
      },
      memory: {
        heapUsed: Math.round(heartbeatStats.memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(heartbeatStats.memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      },
    };
  }

  @Get('ping')
  getPing() {
    return {
      statusCode: 200,
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }
}

