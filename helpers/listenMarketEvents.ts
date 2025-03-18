import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'

import { CHAIN_INFO } from "./constants"

// @To-Do - use new method
const listenMarketEvents = (options) => {
  const {
    marketAddress,
    chainId,
    onEvent,
    event,
    filter,
  } = {
    onConnect: () => {},
    onEvent: () => {},
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    const MarketContractAbi = MarketContractData.abi
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const contract = new web3.eth.Contract(MarketContractAbi, marketAddress)

        const t = contract.events[event](filter)
          .on("connected", (subscriptionId) => {
            console.log('>>> connected', subscriptionId)
            resolve(subscriptionId)
          })
          .on('data', (data) => {
            console.log(data)
            onEvent(data)
          })
          .on('error', (err) => {
            console.log(err)
          })
          console.log('>>> t', t)
      } catch (err) {
        reject(err)
      }
    } else {
      reject(`NOT_SUPPORTED_CHAIN`)
    }
  })
}

export default listenMarketEvents