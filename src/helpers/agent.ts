import { AnonCredsModule } from '@credo-ts/anoncreds'
import { AskarModule } from '@credo-ts/askar'
import {
  Agent,
  AgentDependencies,
  ConsoleLogger,
  DidsModule,
  Logger,
  LogLevel,
} from '@credo-ts/core'
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrModule,
  IndyVdrPoolConfig,
  IndyVdrSovDidResolver,
} from '@credo-ts/indy-vdr'
import { NodeFileSystem } from '@credo-ts/node/build/NodeFileSystem'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'
import { EventEmitter } from 'events'
import { WebSocket } from 'ws'

class CustomFileSystem extends NodeFileSystem {
  public constructor() {
    super({
      baseDataPath: `/credo/data`,
      baseCachePath: `/credo/cache`,
      baseTempPath: `/credo/tmp`,
    })
  }
}

const agentDependencies: AgentDependencies = {
  FileSystem: CustomFileSystem,
  fetch,
  EventEmitterClass: EventEmitter,
  WebSocketClass: WebSocket,
}

export type IndyVdrProxyAgent = Agent<ReturnType<typeof getIndyVdrProxyAgentModules>>

export function setupAgent(options: {
  networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]
  logger?: Logger
}) {
  return new Agent({
    config: {
      label: 'Indy VDR Proxy',
      walletConfig: {
        id: 'indy-vdr-proxy',
        key: 'indy-vdr-proxy',
      },
      autoUpdateStorageOnStartup: true,
      backupBeforeStorageUpdate: false,
      logger: options.logger ?? new ConsoleLogger(LogLevel.debug),
    },
    dependencies: agentDependencies,
    modules: getIndyVdrProxyAgentModules(options.networks),
  })
}

const getIndyVdrProxyAgentModules = (networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]) => {
  return {
    askar: new AskarModule({
      ariesAskar,
    }),
    anoncreds: new AnonCredsModule({
      registries: [new IndyVdrAnonCredsRegistry()],
      anoncreds,
    }),
    dids: new DidsModule({ resolvers: [new IndyVdrSovDidResolver()] }),
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks,
    }),
  } as const
}
