import { Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConsoleLogger } from '@credo-ts/core'
import { IndyVdrPoolConfig } from '@credo-ts/indy-vdr'
import { Logger } from '@nestjs/common'
import { IndyVdrProxyModule, setupAgent } from 'credo-ts-indy-vdr-proxy-server'
import { readFileSync } from 'fs'
import 'dotenv/config'

const configPath = process.env.INDY_VDR_PROXY_CONFIG_PATH ?? './res/app.config.json'
Logger.log(`Registering Indy VDR Proxy Module with config file ${configPath}`)
const config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }))
const networks = config.networks as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]
const logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 3
const ttl = process.env.THROTTLE_TTL ? parseInt(process.env.THROTTLE_TTL) : 60000
const limit = process.env.THROTTLE_LIMIT ? parseInt(process.env.THROTTLE_LIMIT) : 2000
Logger.log(`Using Credo log level ${logLevel}, throttle TTL ${ttl}, and throttle limit ${limit}`)

@Module({
  imports: [
    // Limit requests per user to {limit} number of requests every {ttl} milliseconds
    ThrottlerModule.forRoot([
      {
        ttl,
        limit,
      },
    ]),
    IndyVdrProxyModule.register(setupAgent({ networks, logger: new ConsoleLogger(logLevel) })),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
