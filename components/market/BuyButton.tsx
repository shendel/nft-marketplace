import useWeb3 from "/helpers/useWeb3"
import { useEffect, useState } from "react"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import callMPMethod from "/helpers/callMPMethod"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import BigNumber from "bignumber.js"

import approveToken from "/helpers/approveToken"

import Button from "./Button"

export default function BuyButton(options) {
  const {
    chainId,
    marketplaceContract,
    marketTokenInfo,
    price,
    currency,
    onBuy,
  } = {
    onBuy: () => {},
    ...options
  }
    
  
  const {
    isWalletConnecting,
    isConnected,
    isSwitchChain,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  } = useWeb3(chainId)

console.log('>>> marketTokenInfo', marketTokenInfo)
  const addNotify = (msg, style) => {
    console.log('>>> NOTIFY', style, msg)
  }

  const [ sellCurrency, setSellCurrency ] = useState(false)
  const [ isSellCurrencyFetched, setIsSellCurrencyFetched ] = useState(false)
  const [ needApprove, setNeedApprove ] = useState(true)

  const [ isBuyLot, setIsBuyLot ] = useState(false)
  const doBuyLot = () => {

    addNotify(`Buying NFT. Confirm transaction`)
    setIsBuyLot(true)
    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: marketTokenInfo.erc20 == ZERO_ADDRESS ? 'buyNFT' : 'buyNFTbyERC20',
      ...(marketTokenInfo.erc20 == ZERO_ADDRESS
        ? {
          weiAmount: marketTokenInfo.price.toString()
        } : {}
      ),
      args: [
        marketTokenInfo.collection,
        marketTokenInfo.tokenId.toString()
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`Buy NFT TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail buy NFT. ${err.message ? err.message : ''}`, `error`)
        setIsBuyLot(false)
      },
      onFinally: (answer) => {
        addNotify(`NFT success buyed`, `success`)
        setIsBuyLot(false)
      }
    })
  }

  const [ isApproving, setIsApproving ] = useState(false)

  const doApproveAndBuy = (lotIndex) => {
    addNotify(`Approving... Confirm transaction`)

    const {
      erc20,
      price,
    } = marketTokenInfo

    setIsApproving(true)
    approveToken({
      activeWeb3,
      chainId,
      tokenAddress: erc20,
      approveFor: marketplaceContract,
      weiAmount: price.toString(),
      onTrx: (hash) => {
        addNotify(`Approving TX hash ${hash}`, `success`)
      },
      onFinally: () => {
        addNotify(`Approved`, `success`)
        setIsApproving(false)
        doBuyLot()
      },
      onError: (err) => {
        setIsApproving(false)
        addNotify(`Fail approve token. ${err.message ? err.message : ''}`, `error`)
      }
    })
  }
  
  useEffect(() => {
    if (address) {
      if (marketTokenInfo.erc20 != ZERO_ADDRESS) {
        fetchTokensListInfo({
          erc20list: [ marketTokenInfo.erc20] ,
          chainId,
          withAllowance: {
            allowanceFrom: address,
            allowanceTo: marketplaceContract
          }
        }).then((answ) => {
          if (answ && answ[marketTokenInfo.erc20] && answ[marketTokenInfo.erc20].symbol) {
            setNeedApprove( new BigNumber(marketTokenInfo.price.toString()).isGreaterThan( answ[marketTokenInfo.erc20].allowance) )
            setIsSellCurrencyFetched(true)
          }
        }).catch((err) => {
          setIsSellCurrencyFetched(true)
        })
      } else {
        setIsSellCurrencyFetched(true)
      }
    }
  }, [ address ])
  
  const needChainInfo = CHAIN_INFO(chainId)
  
  return (
    <>
      {!address && (
        <Button onClick={() => { connectWeb3() }} isLoading={isWalletConnecting}>
          Connect Wallet
        </Button>
      )}
      {address && (
        <>
          {`${activeChainId}` !== `${chainId}` ? (
            <Button onClick={() => { switchChainId() }} isLoading={isSwitchChain}>
              Switch to {needChainInfo.chainName}
            </Button>
          ) : (
            <>
              {(marketTokenInfo.erc20 !== ZERO_ADDRESS && isSellCurrencyFetched && needApprove) ? (
                <Button onClick={doApproveAndBuy} isLoading={isApproving || isBuyLot}>
                  Approve & Buy 1 for {price} {currency}
                </Button>
              ) : (
                <Button onClick={doBuyLot} isLoading={isBuyLot}>
                  Buy 1 for {price} {currency}
                </Button>
              )}
            </>
          )}
        </>
      )}
      
    </>
  )
}