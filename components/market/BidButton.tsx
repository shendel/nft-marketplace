import useWeb3 from "/helpers/useWeb3"
import { useEffect, useState } from "react"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import fetchMarketBids from '/helpers/fetchMarketBids'
import callMPMethod from "/helpers/callMPMethod"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import BigNumber from "bignumber.js"
import { fromWei, toWei } from '/helpers/wei'
import approveToken from "/helpers/approveToken"

import EndTimer from "./EndTimer"
import Button from "./Button"

export default function BidButton(options) {
  const {
    chainId,
    marketplaceContract,
    marketTokenInfo,
    price,
    currency,
    currencyDecimals,
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


  const addNotify = (msg, style) => {

  }
  
  const [ sellCurrency, setSellCurrency ] = useState(false)
  const [ isSellCurrencyFetched, setIsSellCurrencyFetched ] = useState(false)
  const [ needApprove, setNeedApprove ] = useState(true)

  const [ isBuyLot, setIsBuyLot ] = useState(false)
  const [ isBidLot, setIsBidLot ] = useState(false)
  
  const [ lotInfo, setLotInfo ] = useState(marketTokenInfo)
  const [ lotBids, setLotBids ] = useState([])
  const [ blockchainUtx, setBlockchainUtx ] = useState(0)
  const [ timeIsOut, setTimeIsOut ] = useState(false)

  const _fetchBidsHistory = () => {
    if (marketTokenInfo) {
      const {
        collection,
        tokenId,
        offerId,
      } = marketTokenInfo
      fetchMarketBids({
        address: marketplaceContract,
        chainId,
        collection,
        tokenId,
        offerId
      }).then(({
        tokenInfo,
        bids,
        timestamp,
        highestBidder
      }) => {
        if (tokenInfo && tokenInfo.utx && tokenInfo.utx != "0") setLotInfo(tokenInfo)
        setBlockchainUtx(timestamp)
        setTimeIsOut(Number(timestamp) > Number(lotInfo.endAt))
        setLotBids(bids.sort((a,b) => {
          return (new BigNumber(a.bid).isGreaterThan(b.bid)) ? -1 : 1
        }))
      }).catch((err) => {
        console.log('>> fail fetch bids', err)
      })
    }
  }
  const [ isUserHightBid, setIsUserHightBid ] = useState(false)
  const [ userBid, setUserBid ] = useState(false)
  const [ deltaBid, setDeltaBid ] = useState(false)

  useEffect(() => {
    if (lotBids && lotBids.length && address && lotInfo) {
      setIsUserHightBid(address.toLowerCase() == lotBids[0].owner.toLowerCase())
      const hasUserBid = lotBids.filter(({ owner }) => { return owner.toLowerCase() == address.toLowerCase() })
      if (hasUserBid.length) {
        setUserBid(hasUserBid[0].bid)
        setDeltaBid(new BigNumber(lotInfo.price).minus(hasUserBid[0].bid).toString())
      } else {
        setDeltaBid(false)
      }
    } else {
      setIsUserHightBid(false)
      setDeltaBid(false)
    }
  }, [ lotBids ])

  useEffect(() => {
    const updateInterval = setInterval(() => {
      _fetchBidsHistory()
    }, 5000)
    _fetchBidsHistory()
    return () => {
      clearInterval(updateInterval)
    }
  }, [ marketTokenInfo ])

  const [ isCollectingNFT, setIsCollectiongNFT ] = useState(false)
  const doCollectNFT = () => {
    addNotify(`Finishing auction... Confirm transaction`)
    setIsCollectiongNFT(true)
    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: 'completeAuction',
      args: [
        lotInfo.offerId
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`Close auction TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail close auction. ${err.message ? err.message : ''}`, `error`)
        setIsCollectiongNFT(false)
      },
      onFinally: (answer) => {
        addNotify(`Successfull closed`, `success`)
        setIsCollectiongNFT(false)
      }
    }).catch((err) => {
      console.log('>>> FAIL CLOSE', err)
      setIsCollectiongNFT(false)
    })
  }
  const [ isRefunding, setIsRefunding ] = useState(false)
  const doRefund = () => {
    addNotify(`Refunding funds. Confirm transaction`)
    setIsRefunding(true)
    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: 'withdrawBid',
      args: [
        lotInfo.offerId
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`Rufund TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail refund. ${err.message ? err.message : ''}`, `error`)
        setIsRefunding(false)
      },
      onFinally: (answer) => {
        addNotify(`Successfull refunded`, `success`)
        setIsRefunding(false)
      }
    }).catch((err) => {
      console.log('>>> FAIL REFUND', err)
      setIsRefunding(false)
    })
  }
  
  const doBidLot = () => {

    addNotify(`Biding NFT. Confirm transaction`)
    setIsBidLot(true)
    
    const bidAmount = (deltaBid) ? deltaBid : marketTokenInfo.price.toString()

    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: 'bid',
      ...(marketTokenInfo.erc20 == ZERO_ADDRESS
        ? {
          weiAmount: bidAmount
        } : {}
      ),
      args: [
        marketTokenInfo.offerId,
        bidAmount,
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`Bid NFT TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail bid NFT. ${err.message ? err.message : ''}`, `error`)
        setIsBidLot(false)
      },
      onFinally: (answer) => {
        addNotify(`NFT success bided`, `success`)
        setIsBidLot(false)
      }
    }).catch((err) => {
      console.log('>>> FAIL BID', err)
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
      <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
        <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
          <p className="text-white opacity-60 mt-1 p-[2px]">
            {lotBids.length > 0 ? (
              <>{`High Bid`}</>
            ) : (
              <>{`Start Price`}</>
            )}
          </p>
          {currency && lotInfo && lotInfo.price ? (
            <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
              {fromWei((lotBids.length > 0 && lotBids[0] > 0) ? lotBids[0].bid : lotInfo.price, currencyDecimals)}
              {` `}
              {currency}
              
            </div>
          ) : (
            <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
              <div style={{
                width: '100%',
                height: '16px',
                borderRadius: 'inherit'
              }}
              className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"></div>
            </div>
          )}
          <div></div>
        </div>
      </div>
      {!address && (
        <div className="flex justify-evenly items-center">
          <Button onClick={() => { connectWeb3() }} isLoading={isWalletConnecting}>
            Connect Wallet
          </Button>
        </div>
      )}
      {address && (
        <>
          {`${activeChainId}` !== `${chainId}` ? (
            <div className="flex justify-evenly items-center">
              <Button onClick={() => { switchChainId() }} isLoading={isSwitchChain}>
                Switch to {needChainInfo.chainName}
              </Button>
            </div>
          ) : (
            <>
              {lotInfo.status == "2" || timeIsOut ? (
                <>
                  <div className="flex justify-evenly items-center">
                    <strong>The auction has ended</strong>
                  </div>
                  {(new BigNumber(userBid).isGreaterThan(0)) && isUserHightBid && (
                    <>
                      <div className="flex justify-evenly items-center" style={{paddingBottom: '1rem'}}>
                        Congratulations, your bid was the highest
                      </div>
                      <div className="flex justify-evenly items-center">
                        <Button onClick={doCollectNFT} isLoading={isCollectingNFT}>
                          Complete Auction
                        </Button>
                      </div>
                    </>
                  )}
                  {(new BigNumber(userBid).isGreaterThan(0)) && !isUserHightBid && (
                    <>
                      <div className="flex justify-evenly items-center" style={{paddingBottom: '1rem'}}>
                        We are sorry, but your bet did not win
                      </div>
                      <div className="flex justify-evenly items-center">
                        {(new BigNumber(userBid).isGreaterThan(0)) ? (
                          <Button onClick={doRefund} isLoading={isRefunding}>
                            Refund {fromWei(userBid, currencyDecimals)} {currency}
                          </Button>
                        ) : (
                          <Button disabled={true}>
                            Already refunded
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {blockchainUtx && lotInfo && (
                    <div className="flex justify-evenly items-center" style={{ paddingBottom: '1rem' }}>
                      <EndTimer
                        title={`Time left to finish`}
                        utxNow={blockchainUtx}
                        utxEnd={lotInfo.endAt}
                      />
                    </div>
                  )}
                  {userBid && (
                    <div className="flex justify-evenly items-center" style={{ paddingBottom: '1rem' }}>
                      <span>
                        {`You bid is: `}
                        <strong>{fromWei(userBid, currencyDecimals)}{` `}{currency}</strong>
                      </span>
                    </div>
                  )}
                  {(address && address.toLowerCase() == lotInfo.seller.toLowerCase()) ? (
                    <>
                      <strong>This is your lot. Wait when auction will be finished</strong>
                    </>
                  ) : (
                    <>
                      {isUserHightBid ? (
                        <div className="flex justify-evenly items-center">
                          <Button disabled={true}>You bid is high</Button>
                        </div>
                      ) : (
                        <div className="flex justify-evenly items-center">
                          {(marketTokenInfo.erc20 !== ZERO_ADDRESS && isSellCurrencyFetched && needApprove) ? (
                            <Button onClick={doApproveAndBuy} isLoading={isApproving || isBuyLot}>
                              Approve & Bid {fromWei(lotInfo.price, currencyDecimals)} {currency}
                            </Button>
                          ) : (
                            <Button onClick={doBidLot} isLoading={isBidLot}>
                              {deltaBid ? (
                                <>Bid {fromWei(lotInfo.price, currencyDecimals)} (+{fromWei(deltaBid, currencyDecimals)}) {currency}</>
                              ) : (
                                <>Bid {fromWei(lotInfo.price, currencyDecimals)} {currency}</>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      
    </>
  )
}