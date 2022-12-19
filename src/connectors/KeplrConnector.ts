import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SendReturnResult, SendReturn, Send, SendOld } from '@web3-react/injected-connector/dist/types'
import { Window as KeplrWindow, Keplr } from '@keplr-wallet/types'
import { HttpProvider } from 'web3-providers-http'

import { MiniRpcProvider } from './NetworkConnector'
import { ChainId } from 'constants/chains'

const EVMOS_CHAINID = 'evmos_9001-2'

function toHexString(byteArray: Uint8Array) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2)
  }).join('')
}

export class KeplrConnector extends AbstractConnector {
  supportedChainIds?: number[] | undefined
  httpProvider: any
  constructor({ supportedChainIds }: { supportedChainIds: ChainId[] }) {
    super({ supportedChainIds })
    this.httpProvider = new MiniRpcProvider(9001, 'https://evmos-json-rpc.stakely.io')
  }

  async activate(): Promise<ConnectorUpdate<string | number>> {
    console.log('activate')
    if (window.keplr) {
      const { wallet, signer } = await ConnectKeplr(window.keplr)

      // get key
      const key = await wallet.getKey(EVMOS_CHAINID)
      console.log('keplr', { key })

      const ethAddress = `0x${toHexString(key.address)}`
      console.log({ ethAddress })
      return {
        provider: this.httpProvider,
        chainId: 9001,
        account: ethAddress,
      }
    }
    console.log('keplr: wrong')
    return {}
  }
  getProvider(): Promise<any> {
    return Promise.resolve(this.httpProvider)
  }
  getChainId(): Promise<string | number> {
    return Promise.resolve(9001)
  }
  getAccount(): Promise<string | null> {
    console.log('getAccount')
    throw new Error('Method not implemented.')
  }
  deactivate(): void {
    console.log('deactivate')
    // throw new Error('Method not implemented.')
  }
}

async function ConnectKeplr(keplr: Keplr) {
  //   const Bech32Prefix = 'evmos'
  //   // PrefixAccount is the prefix for account keys
  //   const PrefixAccount = 'acc'
  //   // PrefixValidator is the prefix for validator keys
  //   const PrefixValidator = 'val'
  //   // PrefixConsensus is the prefix for consensus keys
  //   const PrefixConsensus = 'cons'
  //   // PrefixPublic is the prefix for public keys
  //   const PrefixPublic = 'pub'
  //   // PrefixOperator is the prefix for operator keys
  //   const PrefixOperator = 'oper'

  //   // PrefixAddress is the prefix for addresses
  //   const PrefixAddress = 'addr'

  //   // Bech32PrefixAccAddr defines the Bech32 prefix of an account's address
  //   const Bech32PrefixAccAddr = Bech32Prefix
  //   // Bech32PrefixAccPub defines the Bech32 prefix of an account's public key
  //   const Bech32PrefixAccPub = Bech32Prefix + PrefixPublic
  //   // Bech32PrefixValAddr defines the Bech32 prefix of a validator's operator address
  //   const Bech32PrefixValAddr = Bech32Prefix + PrefixValidator + PrefixOperator
  //   // Bech32PrefixValPub defines the Bech32 prefix of a validator's operator public key
  //   const Bech32PrefixValPub = Bech32Prefix + PrefixValidator + PrefixOperator + PrefixPublic
  //   // Bech32PrefixConsAddr defines the Bech32 prefix of a consensus node address
  //   const Bech32PrefixConsAddr = Bech32Prefix + PrefixValidator + PrefixConsensus
  //   // Bech32PrefixConsPub defines the Bech32 prefix of a consensus node public key
  //   const Bech32PrefixConsPub = Bech32Prefix + PrefixValidator + PrefixConsensus + PrefixPublic

  await keplr.enable(EVMOS_CHAINID)

  const offlineSigner = keplr.getOfflineSigner(EVMOS_CHAINID)

  return { wallet: keplr, signer: offlineSigner }
}
