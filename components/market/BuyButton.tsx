import useWeb3 from "/helpers/useWeb3"
import { useEffect, useState } from "react"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import BigNumber from "bignumber.js"

export default function BuyButton(options) {
  const {
    chainId,
    marketplaceContract,
    marketTokenInfo,
    price,
    currency,
  } = options
  
  const [
    isWalletConnecting,
    isConnected,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  ] = useWeb3(chainId)


  const [ sellCurrency, setSellCurrency ] = useState(false)
  const [ isSellCurrencyFetched, setIsSellCurrencyFetched ] = useState(false)
  const [ needApprove, setNeedApprove ] = useState(true)
  
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
        <button 
          className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
          type="button" 
          aria-label="Connect Wallet"
          style={{minWidth: '140px'}}
          onClick={() => { connectWeb3() }}
        >
          Connect Wallet
        </button>
      )}
      {address && (
        <>
          {`${activeChainId}` !== `${chainId}` ? (
            <button 
              className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
              type="button" 
              aria-label="Buy NFT lot"
              style={{minWidth: '140px'}}
              onClick={() => { switchChainId() }}
            >
              Switch to {needChainInfo.chainName}
            </button>
          ) : (
            <>
              {(marketTokenInfo.erc20 !== ZERO_ADDRESS && isSellCurrencyFetched && needApprove) ? (
                <button 
                  className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
                  type="button" 
                  aria-label="Approve"
                  style={{minWidth: '140px'}}
                >
                  Approve & Buy 1 for {price} {currency}
                </button>
              ) : (
                <button 
                  className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
                  type="button" 
                  aria-label="Buy NFT lot"
                  style={{minWidth: '140px'}}
                >
                  Buy 1 for {price} {currency}
                </button>
              )}
            </>
          )}
        </>
      )}
      
    </>
  )
}