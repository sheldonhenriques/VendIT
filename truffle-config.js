require('babel-register');
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "ankle rent assist adult spread tired office magnet episode sword job rough";
module.exports = {
  networks: {
    develop : {
      host: "127.0.0.10",
      port: 7545,
      network_id: "*",
    },
    ropsten: {
      provider:function(){
      return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bc9e1aa8a6424ad3a335b8756a81c934")
      },
      network_id: 3,
      gas:4612388,
      gasPrice:1000000000000
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
