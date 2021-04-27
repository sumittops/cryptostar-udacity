const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "original permit absent jazz guitar shell blind capital scare canvas female toward";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/d58d4a61ba42462da5407460f0e2ddd3'),
      network_id: '*',
      gas: 4500000,
      gasPrice: 100000000000,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
