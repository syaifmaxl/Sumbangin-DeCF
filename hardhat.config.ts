import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify"; 
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 43113,
    },
  },
  etherscan: {
    apiKey: {
      fuji: "Syaif_Ganteng",
    },
    customChains: [
      {
        network: "fuji",
        chainId: 43113,
        urls: {
          apiURL:
            "https://api.avascan.info/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://testnet.avascan.info",
        },
      },
    ],
  },
};

export default config;
