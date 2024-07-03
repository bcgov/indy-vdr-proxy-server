import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealth(): void {
    Logger.log('GET /health')
  }

  postHealth(): void {
    Logger.log('POST /health')
  }
}
