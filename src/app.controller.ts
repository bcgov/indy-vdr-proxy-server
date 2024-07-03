import { Controller, Get, HttpCode, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @HttpCode(204)
  getHealth(): void {
    return this.appService.getHealth()
  }

  @Post('/health')
  @HttpCode(204)
  postHealth(): void {
    return this.appService.postHealth()
  }
}