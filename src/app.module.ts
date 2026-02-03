import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NezonModule } from '@n0xgg04/nezon';
import { PingHandler } from './handlers/ping.handler';
import { TarotHandler } from './handlers/tarot.handler';
import { NumerologyHandler } from './handlers/numerology.handler';
import { HoroscopeHandler } from './handlers/horoscope.handler';
import { UtilityHandler } from './handlers/utility.handler';
import { HelpHandler } from './handlers/help.handler';
import { TarotApiService } from './services/tarot-api.service';
import { HeartbeatService } from './services/heartbeat.service';
import { ConnectionMonitorService } from './services/connection-monitor.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    NezonModule.forRoot({
      token: process.env.MEZON_TOKEN ?? '',
      botId: process.env.MEZON_BOT_ID ?? '',
      autoRetry: true,           // Enable automatic reconnection
      maxRetry: undefined,        // Unlimited retry attempts
      retryDuration: undefined,   // No time limit for retries
    }),
  ],
  controllers: [HealthController],
  providers: [
    // Services
    TarotApiService,
    HeartbeatService,
    ConnectionMonitorService,
    // Handlers
    PingHandler,
    TarotHandler,
    NumerologyHandler,
    HoroscopeHandler,
    UtilityHandler,
    HelpHandler,
  ],
})
export class AppModule { }
