import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AppService {
  getRoot(): string {
    Logger.log('GET /')
    return 'Proxy is available'
  }

  getHealth(): void {
    Logger.log('GET /health')
  }

  postHealth(): void {
    Logger.log('POST /health')
  }
}
