import { IndyVdrPoolConfig } from '@credo-ts/indy-vdr'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { setupAgent } from '../src/helpers/agent'
import { readFileSync } from 'fs'

const configPath = process.env.INDY_VDR_PROXY_CONFIG_PATH ?? './res/app.config.json'
const config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }))
const networks = config.networks as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]

describe('AppModule (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register(setupAgent({ networks }))],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Proxy is available')
  })

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(204).expect({})
  })

  it('/health (POST)', () => {
    return request(app.getHttpServer()).post('/health').expect(204).expect({})
  })
})
