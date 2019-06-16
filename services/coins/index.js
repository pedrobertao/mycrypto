import '../../shim'
import TronWeb from 'tronweb'
const bitcoin = require('bitcoinjs-lib')

class MyCrypto {
  async getAddress (coinAbbr) {
    coinAbbr = coinAbbr.toUpperCase()
    return this.generateAddress(coinAbbr)
  }

  async generateAddress (coinAbbr) {
    switch (coinAbbr) {
      case 'BTC': {
        const keyPair = bitcoin.ECPair.makeRandom()
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
        return address
      }

      case 'TRX': {
        const { address } = await TronWeb.createAccount()
        return address.base58
      }
      default: return 'Not Available'
    }
  }
}

export default new MyCrypto()
