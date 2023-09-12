import { useEffect, useState } from "react"
import useWeb3 from "/helpers/useWeb3"
import Button from "./Button"
import callMPMethod from "/helpers/callMPMethod"

export default function DeListingButton(options) {
  const {
    chainId,
    marketplaceContract,
    collectionAddress,
    tokenId,
    onDelist,
  } = options

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

  const addNotify = (msg, style) => {
    console.log('>>> NOTIFY', style, msg)
  }
  const [ isDeListing, setIsDeListing ] = useState(false)
  const doDeListing = () => {
    setIsDeListing(true)
    addNotify(`De-Listing NFT from marketplace. Confirm transaction`)
    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: 'deSellNFT',
      args: [
        collectionAddress,
        tokenId.toString()
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`De-Listing NFT from marketplace TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail De-List NFT. ${err.message ? err.message : ''}`, `error`)
        setIsDeListing(false)
      },
      onFinally: (answer) => {
        addNotify(`NFT successfull de-listed from marketplace`, `success`)
        setIsDeListing(false)
        onDelist()
      }
    })
  }
  
  return (
    <>
      {`${activeChainId}` !== `${chainId}` ? (
        <Button onClick={() => { switchChainId() }} isLoading={isSwitchChain}>
          {`Switch network for de-listing`}
        </Button>
      ) : (
        <Button onClick={doDeListing} isLoading={isDeListing}>
          {`De-List NFT from Marketplace`}
        </Button>
      )}
    </>
  )
}