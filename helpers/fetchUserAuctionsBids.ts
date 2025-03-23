import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'
import Web3ObjectToArray from "./Web3ObjectToArray"

const fetchUserAuctionsBids = (options) => {
  const {
    address,
    userAddress,
    chainId,
    offers,
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

        const calls = {}
        offers.forEach((offerId) => {
          calls[`bid_${offerId}`] = { func: 'bids', args: [offerId, userAddress] }
          calls[`high_${offerId}`] = { func: 'highestBidder', args: [offerId] }
        })
        callMulticall({
          multicall,
          target: address,
          encoder: abiI,
          calls
        }).then((mcAnswer) => {
          console.log('>>> User bids', mcAnswer)
          const bids = {}
          const high = {}
          Object.keys(mcAnswer).forEach((item) => {
            const [ key, index ] = item.split(`_`)
            if (key == `bid`) bids[index] = mcAnswer[item]
            if (key == 'high') high[index] = mcAnswer[item]
          })
          resolve({
            chainId,
            address,
            userAddress,
            bids,
            high,
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

export default fetchUserAuctionsBids