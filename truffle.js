// Allows us to use ES6 in our migrations and tests.
require('@babel/register')
require('@babel/polyfill')

require('dotenv').config()

var HDWalletProvider = require('truffle-hdwallet-provider')

var mnemonic = process.env.HDWALLET_MNEMONIC

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    }
  }
}

if (process.env.MAINNET_PROVIDER_URL) {
  module.exports.networks['mainnet'] = {
    provider: new HDWalletProvider(mnemonic, process.env.MAINNET_PROVIDER_URL),
    network_id: 1,
    gas: 4612388,
    gasPrice: 5000000000
  }
}

if (process.env.ROPSTEN_PROVIDER_URL) {
  module.exports.networks['ropsten'] = {
    provider: new HDWalletProvider(mnemonic, process.env.ROPSTEN_PROVIDER_URL),
    network_id: 3,
    gas: 4612388,
    gasPrice: 100000000000
  }
}

if (process.env.RINKEBY_PROVIDER_URL) {
  module.exports.networks['rinkeby'] = {
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, process.env.RINKEBY_PROVIDER_URL),
      network_id: 4,
      gas: 4612388,
      gasPrice: 100000000000
    }
  }
}
