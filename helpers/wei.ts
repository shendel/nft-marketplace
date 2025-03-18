import { BigNumber, ethers } from "ethers"

export const fromWei = (amount, decimals = 18) => {
  return ethers.utils.formatUnits(amount, decimals)
}

export const toWei = (amount, decimals = 18) => {
  return ethers.utils.parseUnits(`${amount}`, decimals)
}