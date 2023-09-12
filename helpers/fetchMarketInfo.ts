import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'


const fetchMarketInfo = (options) => {
  const {
    address,
    chainId,
    collectionAddress,
    onlyTokens,
    onlyInfo,
    userAddress,
    forAddress,
  } = {
    onlyTokens: false,
    onlyInfo: false,
    userAddress: false,
    forAddress: false,
    collectionAddress: false,
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    const MarketContractAbi = MarketContractData.abi
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const multicall = new web3.eth.Contract(MulticallAbi, MULTICALL_CONTRACTS[chainId])
        const abiI = new AbiInterface(MarketContractAbi)

        callMulticall({
          multicall,
          target: address,
          encoder: abiI,
          calls: 
            (userAddress)
              ? {
                tokens:                     { func: 'getUserTokensAtSale', args: [ userAddress ] }
              } : (onlyTokens)
                ? {
                  tokensAtSaleCount:        { func: 'getTokensAtSaleCount' },
                  tokensAtSale:             { func: 'getTokensAtSale' },
                } : {
                  isMPContract:             { func: 'isMarketPlaceContract' },
                  owner:                    { func: 'owner' },
                  version:                  { func: 'version' },
                  nftCollections:           { func: 'getAllowedCollections' },
                  collectionListing:        { func: 'getCollectionsTokensCount' },
                  ...((forAddress)
                    ? {
                      userCollectionListed: { func: 'getUserCollectionsTokenCount', args: [ forAddress ] }
                    } : {}
                  ),
                  tradeFee:                 { func: 'getTradeFee' },
                  ...((!onlyInfo && !collectionAddress)
                    ? {
                      tokensAtSaleCount:    { func: 'getTokensAtSaleCount' },
                      tokensAtSale:         { func: 'getTokensAtSale' },
                    } : {}
                  ),
                  ...((collectionAddress)
                    ? {
                      tokensAtSale:         { func: 'getCollectionTokensAtSale', args: [ collectionAddress ] },
                    } : {}
                  ),
                  allowedERC20:             { func: 'getAllowedERC20' },
                  feeReceiver:              { func: 'getFeeReceiver' },
                }
        }).then((mcAnswer) => {
          if (mcAnswer.collectionListing) {
            let _collectionListing = {}
            Object.keys(mcAnswer.collectionListing).map((key) => {
              _collectionListing[mcAnswer.collectionListing[key].collection] = mcAnswer.collectionListing[key].count
            })
            mcAnswer.collectionListing = _collectionListing
          }
          if (mcAnswer.userCollectionListed) {
            let _userCollectionListed = {}
            Object.keys(mcAnswer.userCollectionListed).map((key) => {
              _userCollectionListed[mcAnswer.userCollectionListed[key].collection] = mcAnswer.userCollectionListed[key].count
            })
            mcAnswer.userCollectionListed = _userCollectionListed
          }
          resolve({
            chainId,
            address,
            ...mcAnswer
          })
        }).catch((err) => {
          console.log('>>> Fail fetch all info', err)
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    } else {
      reject(`NOT_SUPPORTED_CHAIN`)
    }
  })
}

export default fetchMarketInfo