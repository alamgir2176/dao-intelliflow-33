import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Custom chains for the DAO platform
export const hyperionTestnet = defineChain({
  id: 133717,
  name: 'Hyperion Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tMETIS',
    symbol: 'tMETIS',
  },
  rpcUrls: {
    default: {
      http: ['https://hyperion-testnet.metisdevops.link'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperion Testnet Explorer',
      url: 'https://hyperion-testnet-explorer.metisdevops.link',
    },
  },
  testnet: true,
});

export const lazaiTestnet = defineChain({
  id: 133718,
  name: 'LazAI (Pre-Testnet)',
  nativeCurrency: {
    decimals: 18,
    name: 'LAZAI',
    symbol: 'LAZAI',
  },
  rpcUrls: {
    default: {
      http: ['https://lazai-testnet.metisdevops.link'],
    },
  },
  blockExplorers: {
    default: {
      name: 'LazAI Testnet Explorer',
      url: 'https://lazai-testnet-explorer.metisdevops.link',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'AI DAO Governance Platform',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [hyperionTestnet, lazaiTestnet],
  ssr: false,
});