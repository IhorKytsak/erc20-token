import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import 'dotenv/config'

const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      blockGasLimit: process.env.INC_GAS_LIMIT ? 10000000000000 : 30000000,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: 'https://rpc.ankr.com/eth_sepolia',
      accounts: [process.env.PRIVATE_KEY_1],
      chainId: 11155111,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  },
  sourcify: {
    enabled: false,
  },
  gasReporter: {
    enabled: true,
  },
  paths: {
    artifacts: './artifacts-zk',
    cache: './cache-zk',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}

export default config
