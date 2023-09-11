import {
  setupWeb3,
  switchOrAddChain,
  onBlockchainChanged,
  doConnectWithMetamask,
  isMetamaskConnected,
  onWalletChanged,
  getConnectedAddress 
} from "/helpers/setupWeb3"
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
  
  const [ isWalletConnection, setIsWalletConnecting ] = useState(false)
  const [ activeWeb3, setActiveWeb3 ] = useState(false)
  const [ activeChainId, setActiveChainId ] = useState(false)
  const [ address, setAddress ] = useState(false)


  const initOnWeb3Ready = async () => {
    if (activeWeb3 && (`${activeChainId}` == `${chainId}`)) {
      window.tt = activeWeb3
      activeWeb3.eth.getAccounts().then((accounts) => {
        setAddress(accounts[0] || false)

      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      if (_isConnected) {
        connectWithMetamask()
      } else {
        setAddress(false)
      }
    }
  }

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
  useEffect(() => {
    initOnWeb3Ready()
  }, [ activeWeb3 ])
  
  const onConnect = async () => {
    initOnWeb3Ready()
  }
  onWalletChanged(onConnect)
  const connectWithMetamask = async () => {
    doConnectWithMetamask({
      onBeforeConnect: () => { setIsWalletConnecting(true) },
      onSetActiveChain: setActiveChainId,
      onConnected: async (cId, web3) => {
        setActiveWeb3(web3)
        setIsWalletConnecting(false)
        if (!web3) {
          setAddress(await getConnectedAddress())
        }
      },
      onError: (err) => {
        setIsWalletConnecting(false)
      },
    })
  }
  
  const doSwitchNetwork = () => {
    switchOrAddChain(chainId)
  }
  onBlockchainChanged((chainData) => {
    initOnWeb3Ready()
  })
  
  const needChainInfo = CHAIN_INFO(chainId)
  
  return (
    <>
      {!address && (
        <button 
          className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
          type="button" 
          aria-label="Connect Wallet"
          style={{minWidth: '140px'}}
          onClick={connectWithMetamask}
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
              onClick={doSwitchNetwork}
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