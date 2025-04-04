import useWeb3 from "/helpers/useWeb3"
import { useEffect, useState } from "react"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import callMPMethod from "/helpers/callMPMethod"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import BigNumber from "bignumber.js"

import approveToken from "/helpers/approveToken"

import Button from "./Button"
import fetchBalance from '/helpers/fetchBalance'
import fetchTokenBalance from '/helpers/fetchTokenBalance'

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

  const [ isBalanceFetching, setIsBalanceFetching ] = useState(false)
  const [ userBalance, setUserBalance ] = useState(0)
  
  const doFetchUserBalance = () => {
    if (address && marketTokenInfo) {
      setIsBalanceFetching(true)
      if (marketTokenInfo.erc20 == ZERO_ADDRESS) {
        fetchBalance({
          address,
          chainId
        }).then((balance) => {
          setUserBalance(balance)
          setIsBalanceFetching(false)
        }).catch((err) => {
          console.log('Fail fetch user balance', err)
          setUserBalance(0)
          setIsBalanceFetching(false)
        })
      } else {
        fetchTokenBalance(
          address,
          marketTokenInfo.erc20,
          chainId
        ).then(({ wei }) => {
          setUserBalance(wei)
          setIsBalanceFetching(false)
        }).catch((err) => {
          console.log('Fail fetch user balance', err)
          setIsBalanceFetching(false)
        })
      }
    }
  }
  useEffect(() => {
    doFetchUserBalance()
  }, [ address, marketTokenInfo ])
  
  const addNotify = (msg, style) => {

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
      method: 'buyNFT',
      ...(marketTokenInfo.erc20 == ZERO_ADDRESS
        ? {
          weiAmount: marketTokenInfo.price.toString()
        } : {}
      ),
      args: [
        marketTokenInfo.collection,
        marketTokenInfo.tokenId.toString(),
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
        onBuy()
      }
    })
  }

  const [ isEnoughtBalance, setIsEnoughtBalance ] = useState(false)
  useEffect(() => {
    if (marketTokenInfo) {
      setIsEnoughtBalance(!new BigNumber(marketTokenInfo.price).isGreaterThan(userBalance))
    }
  }, [ userBalance, marketTokenInfo ])
  
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
              {isEnoughtBalance ? (
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
              ) : (
                <Button disabled={true}>
                  Not enough balance
                </Button>
              )}
            </>
          )}
        </>
      )}
      
    </>
  )
}