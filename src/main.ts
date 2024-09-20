import { ConsoleLogger } from '@credo-ts/core'
import { IndyVdrPoolConfig } from '@credo-ts/indy-vdr'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { setupAgent } from './helpers/agent'
import { readFileSync } from 'fs'
import 'dotenv/config'
import { BASE_CACHE_PATH } from './constants'

async function bootstrap() {
  const configPath = process.env.INDY_VDR_PROXY_CONFIG_PATH ?? './res/app.config.json'
  const config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }))
  const logLevel = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 2
  const logger = new ConsoleLogger(logLevel)
  logger.info(`Registering App Module with config file ${configPath}`)
  const networks = config.networks as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]
  const capacity = process.env.CACHE_CAPACITY ? parseInt(process.env.CACHE_CAPACITY) : 1000
  const expiryMs = process.env.CACHE_EXPIRY_MS
    ? parseInt(process.env.CACHE_EXPIRY_MS)
    : 1000 * 60 * 60 * 24 * 7
  const path = process.env.CACHE_PATH ?? `${BASE_CACHE_PATH}/txn-cache`
  const agent = setupAgent({ networks, logger, cache: { capacity, expiryMs, path } })
  await agent.initialize()
  logger.info('Agent initialized')

  const app = await NestFactory.create(AppModule.register(agent))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((e) => {
  Logger.error('Error initializing server', e)
})
