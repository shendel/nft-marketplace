export const accountUnlockedStorageKey = 'ff-deploy-account-unlocked'

export const CURRENCIES = {
  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18
  },
  ETH: {
    name: "Ether",
    symbol: 'ETH',
    decimals: 18
  },
  MATIC: {
    name: "Polygon",
    symbol: 'MATIC',
    decimals: 18
  },
  ARBETH: {
    name: "Ether (Arbitrum One)",
    symbol: 'ETH',
    decimals: 18
  },
  XDAI: {
    name: "xDai",
    symbol: 'xDAI',
    decimals: 18
  },
  FTM: {
    name: "FTM",
    symbol: 'FTM',
    decimals: 18
  },
  ALV: {
    name: 'ALV',
    symbol: 'ALV',
    decimals: 18
  },
  CRO: {
    name: 'CRO',
    symbol: 'CRO',
    decimals: 18
  },
  BROCK: {
    name: 'BROCK',
    symbol: 'BROCK',
    decimals: 18
  }
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const MULTICALL_CONTRACTS = {
  1: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  4: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  5: '0xf0cc52809a6c63dab849e368b0620db17cb41cf8', // v2 '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  100: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  77: '0x2D0Cf59485baa2A105541b9bf850E06C071AFab8',
  137: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  80001: '0x6aa1bdc159e28beca44cc7f1a260a25e7b63f53d',
  56: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  97: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  42161: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  421611: '0xf27ee99622c3c9b264583dacb2cce056e194494f',
  250: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
  3797: '0x48d7ac38530697aDB91061B6D141C8c763edE565',
  25: '0x9a0abe9db9e01de47ea85fbbc073494479d55180', // Cronoscan
  7171: '0x83048f0Bf34FEeD8CEd419455a4320A735a92e9d' // BROCK
}

export const AVAILABLE_NETWORKS_INFO = [
  {
    slub: 'bitrock',
    chainName: 'Bit-Rock',
    chainId: '0x1C03',
    networkVersion: 7171,
    rpcUrls: ['https://brockrpc.io'],
    blockExplorerUrls: ['https://explorer.bit-rock.io/'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.BROCK,
    multicall: '0x83048f0Bf34FEeD8CEd419455a4320A735a92e9d',
    storage: '0xd152CD6F9cf76921759d3f51f743651e549f6925',
    exStorage: '0x2f87D23cd8d788bC9a32E540cdd8253F9b1F54CF'
  },
  {
    slub: 'cronos_mainnet',
    chainName: 'Cronos',
    chainId: '0x19',
    networkVersion: 25,
    rpcUrls: ['https://evm.cronos.org'],
    blockExplorerUrls: ['https://alveyscan.com/'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.CRO,
    multicall: '0x48d7ac38530697aDB91061B6D141C8c763edE565',
    storage: '',
    exStorage: ''
  },
  {
    slub: 'alv_mainnet',
    chainName: 'AlveyChain',
    chainId: '0xED5',
    networkVersion: 3797,
    rpcUrls: ['https://rpc.alveycoin.com/rpc'], // ['https://rpc2.alvey.io/rpc'],
    blockExplorerUrls: ['https://alveyscan.com/'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.ALV,
    multicall: '0x48d7ac38530697aDB91061B6D141C8c763edE565',
    storage: '0x87a6417F03E106A05698F18829bB3a40CBC54f61',
    exStorage: '0x021a76444261B27d5734d25e55F5d4fCBbFD20Bc'
  },
  {
    slug: 'bsc_testnet',
    chainName: 'Binance Smart Chain - Testnet',
    chainId: '0x61',
    networkVersion: 97,
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.BNB
  },
  {
    slug: 'bsc_mainnet',
    chainName: 'Binance Smart Chain',
    chainId: '0x38',
    networkVersion: 56,
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.BNB
  },
  /*
  {
    slug: 'matic_testnet',
    chainName: 'Polygon - Testnet (mumbai)',
    chainId: '0x13881',
    networkVersion: 80001,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.MATIC
  },
  */
  {
    slug: 'matic_mainnet',
    chainName: 'Polygon',
    chainId: '0x89',
    networkVersion: 137,
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.MATIC
  },
  /*
  {
    slug: 'eth_rinkeby',
    chainName: 'Ethereum - Testnet (Rinkeby)',
    chainId: '0x4',
    networkVersion: 4,
    rpcUrls: ['https://rinkeby.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.ETH
  },
  */
  {
    slug: 'eth_goerli',
    chainName: 'Ethereum - Testnet (Goerli)',
    chainId: '0x5',
    networkVersion: 5,
    rpcUrls: ['https://eth-goerli.g.alchemy.com/v2/wNvkA78LYEG7fb5S5z4nJIfB22dAcvuH'],//['https://goerli.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.ETH
  },
  {
    slug: 'eth_mainnet',
    chainName: 'Ethereum',
    chainId: '0x1',
    networkVersion: 1,
    rpcUrls: ['https://mainnet.infura.io/v3/5ffc47f65c4042ce847ef66a3fa70d4c'],
    blockExplorerUrls: ['https://etherscan.io'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.ETH
  },
  /*
  {
    slug: 'arbeth_testnet',
    chainName: 'Arbitrum - Testnet (Rinkeby)',
    chainId: '0x66EEB',
    networkVersion: 421611,
    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.ARBETH
  },
  */
  {
    slug: 'arbeth_mainnet',
    chainName: 'Arbitrum',
    chainId: '0xA4B1',
    networkVersion: 42161,
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://explorer.arbitrum.io'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.ARBETH
  },
  /*
  {
    slug: 'xdai_testnet',
    chainName: 'xDai - Testnet (Sokol)',
    chainId: '0x4d',
    networkVersion: 77,
    rpcUrls: ['https://sokol.poa.network'],
    blockExplorerUrls: ['https://blockscout.com/poa/sokol'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.XDAI
  },
  */
  {
    slug: 'xdai_mainnet',
    chainName: 'Gnosis (xDai)',
    chainId: '0x64',
    networkVersion: 100,
    rpcUrls: ['https://rpc.gnosischain.com'],
    blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.XDAI
  },
  /*
  {
    slug: 'fantom_testnet',
    chainName: 'Fantom testnet',
    chainId: '0xfa2',
    networkVersion: 4002,
    rpcUrls: ['https://rpc.testnet.fantom.network/'],
    blockExplorerUrls: ['https://testnet.ftmscan.com'],
    isTestnet: true,
    nativeCurrency: CURRENCIES.FTM
  },
  */
  {
    slug: 'fantom_mainnet',
    chainName: 'Fantom',
    chainId: '0xfa',
    networkVersion: 250,
    rpcUrls: ['https://rpc.ftm.tools/'],
    blockExplorerUrls: ['https://ftmscan.com'],
    isTestnet: false,
    nativeCurrency: CURRENCIES.FTM
  },
];

export const CHAIN_EXPLORER_LINK = (options) => {
  const {
    address,
    hash,
    chainId,
  } = options
  const chainInfo = CHAIN_INFO(chainId)
  if (chainInfo) {
    if (address) return `${chainInfo.blockExplorerUrls[0]}/address/${address}`
    if (hash) return `${chainId.blockExplorerUrls[0]}/tx/${hash}`
  } else {
    return ``
  }
}
export const CHAINS_LIST = (() => {
  const ret = Object.keys(AVAILABLE_NETWORKS_INFO).map((k) => {
    return {
      id: AVAILABLE_NETWORKS_INFO[k].networkVersion,
      title: AVAILABLE_NETWORKS_INFO[k].chainName,
    }
  })
  ret.unshift({
    id: 0,
    title: `Select Blockchain`,
  })
  return ret
})()

export const CHAIN_INFO = (chainId) => {
  const exists = AVAILABLE_NETWORKS_INFO.filter((chainInfo) => {
    return `${chainInfo.networkVersion}` == `${chainId}`
  })
  return exists.length
    ? exists[0]
    : {
      networkVersion: chainId,
      chainName: `Unknown`,
      nativeCurrency: {
        name: "Unknown",
        symbol: 'Unknown',
        decimals: 18
      }
    }
} 