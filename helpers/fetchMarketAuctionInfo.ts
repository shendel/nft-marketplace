import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'

// @To-Do - use new method
const fetchMarketAuctionInfo = (options) => {
  const {
    marketAddress,
    chainId,
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

        const contract = new web3.eth.Contract(MarketContractAbi, marketAddress)
        contract.methods._auctionListedNfts(offerId).call()
          .then((answer) => {
            resolve(answer)
          })
          .catch((err) => {
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

export default fetchMarketAuctionInfo