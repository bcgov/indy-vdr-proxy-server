import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('/', () => {
    it('should return respond to a root GET with "Proxy is available"', () => {
      expect(appController.getRoot()).toBe('Proxy is available')
    })
  })

  describe('/health', () => {
    it('should return respond to a GET health check without returning anything', () => {
      expect(appController.getHealth()).toBe(void 0)
    })
    it('should return respond to a POST health check without returning anything', () => {
      expect(appController.postHealth()).toBe(void 0)
    })
  })
})
