import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  app: 'questory';
  status: 'ok';
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      app: 'questory',
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
