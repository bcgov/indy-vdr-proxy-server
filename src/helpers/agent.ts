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
      baseDataPath: `/var/credo/data`,
      baseCachePath: `/var/credo/cache`,
      baseTempPath: `/var/credo/tmp`,
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
  cache?: { capacity: number, expiryMs: number, path?: string }
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
    modules: getIndyVdrProxyAgentModules({ networks: options.networks, cache: options.cache }),
  })
}

const getIndyVdrProxyAgentModules = (options: { networks: [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]], cache?: { capacity: number, expiryMs: number, path?: string } }) => {
  if (options.cache) {
    indyVdr.setLedgerTxnCache({ capacity: options.cache.capacity, expiry_offset_ms: options.cache.expiryMs, path: options.cache.path })
  }
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
      networks: options.networks,
    }),
  } as const
}
