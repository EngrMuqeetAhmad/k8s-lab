import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
private config: ConfigService
  ) {
 console.log(this.config.get('PORT'));
 console.log(this.config.get('ENVIRONMENT'));
 }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-api', 'http://localhost:3000/health/ping'),
    ]);
  }

  @Get('ping')
  ping() {
    return { status: 'ok' };
  }
}
