import { setupWeb3, switchOrAddChain, doConnectWithMetamask, isMetamaskConnected, onWalletChanged } from "/helpers/setupWeb3"
import { useEffect, useState } from "react"



export default function BuyButton(options) {
  const [ isWalletConnection, setIsWalletConnecting ] = useState(false)
  const [ activeWeb3, setActiveWeb3 ] = useState(false)
  const [ activeChainId, setActiveChainId ] = useState(false)
  const [ address, setAddress ] = useState(false)
  const chainId = 5

  const initOnWeb3Ready = async () => {
    console.log('>>> initOnWeb3Ready')
    if (activeWeb3 && (`${activeChainId}` == `${chainId}`)) {
      window.tt = activeWeb3
      activeWeb3.eth.getAccounts().then((accounts) => {
        console.log('>>> accounts')
        setAddress(accounts[0] || false)

      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      if (_isConnected) {
        connectWithMetamask()
      }
    }
  }

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
      onConnected: (cId, web3) => {
        console.log('>>> on connected')
        setActiveWeb3(web3)
        setIsWalletConnecting(false)
      },
      onError: (err) => {
        console.log(">>>> connectWithMetamask", err)
        processError(err)
        setIsWalletConnecting(false)
      },
      needChainId: chainId,
    })
  }
  
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
            >
              Switch network
            </button>
          ) : (
            <button 
              className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
              type="button" 
              aria-label="Buy NFT lot"
              style={{minWidth: '140px'}}
            >
              Buy NFT
            </button>
          )}
        </>
      )}
    </>
  )
}