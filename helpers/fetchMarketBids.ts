import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'
import Web3ObjectToArray from "./Web3ObjectToArray"

const fetchMarketBids = (options) => {
  const {
    address,
    chainId,
    collection,
    tokenId,
    offerId,
  } = {
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
        const mcI = new AbiInterface(MulticallAbi)

        callMulticall({
          multicall,
          target: address,
          encoder: abiI,
          calls: {
            tokenInfo: { func: 'marketTokensGet', args: [ collection, tokenId ] },
            bids: { func: 'getOfferBids', args: [ offerId ] },
            highBidOwner: { func: 'highestBidder', args: [ offerId ] },
            timestamp: {
              func: 'getCurrentBlockTimestamp',
              target: MULTICALL_CONTRACTS[chainId],
              encoder: mcI
            }
          }
        }).then((mcAnswer) => {
          resolve({
            chainId,
            address,
            collection,
            tokenId,
            offerId,
            ...mcAnswer,
            bids: Web3ObjectToArray(mcAnswer.bids)
          })
        }).catch((err) => {
          console.log('>>> Fail fetch market bids', err)
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

export default fetchMarketBids