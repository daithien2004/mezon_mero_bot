import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  getHealth() {
    return {
      statusCode: 200,
      data: 'OK',
    };
  }
}
