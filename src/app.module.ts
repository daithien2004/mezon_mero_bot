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
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NezonModule.forRoot({
      token: process.env.MEZON_TOKEN ?? '',
      botId: process.env.MEZON_BOT_ID ?? '',
    }),
  ],
  controllers: [HealthController],
  providers: [
    TarotApiService,
    PingHandler,
    TarotHandler,
    NumerologyHandler,
    HoroscopeHandler,
    UtilityHandler,
    HelpHandler,
  ],
})
export class AppModule {}
