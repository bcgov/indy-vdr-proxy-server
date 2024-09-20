import { DynamicModule, Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Logger } from '@nestjs/common'
import { IndyVdrProxyAgent, IndyVdrProxyModule } from 'credo-ts-indy-vdr-proxy-server'
import 'dotenv/config'

const ttl = process.env.THROTTLE_TTL ? parseInt(process.env.THROTTLE_TTL) : 60000
const limit = process.env.THROTTLE_LIMIT ? parseInt(process.env.THROTTLE_LIMIT) : 2000
Logger.log(`Using throttle TTL ${ttl}, and throttle limit ${limit}`)

@Module({})
export class AppModule {
  static register(agent: IndyVdrProxyAgent): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // Limit requests per user to {limit} number of requests every {ttl} milliseconds
        ThrottlerModule.forRoot([
          {
            ttl,
            limit,
          },
        ]),
        IndyVdrProxyModule.register(agent),
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }
  }
}
