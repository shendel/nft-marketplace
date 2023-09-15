import { useEffect, useState } from "react"
import { CHAIN_INFO, ZERO_ADDRESS } from "/helpers/constants"
import { toWei, fromWei } from "/helpers/wei"
import callNftMethod from "/helpers/callNftMethod"
import callMPMethod from "/helpers/callMPMethod"
import BigNumber from "bignumber.js"
import { NftIsApproved, NftSetApprove } from '/helpers/nftApproveUtils'
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import useWeb3 from "/helpers/useWeb3"
import Web3ObjectToArray from "/helpers/Web3ObjectToArray"
import Button from "/components/market/Button"

export default function SellNftForm(options) {
  const {
    chainId,
    marketplaceContract,
    tokenId,
    collectionAddress,
    onCancel,
    onSell,
  } = {
    onCancel: () => {},
    onSell: () => {},
    ...options
  }

  const {
    address: userAddress,
    isWalletConnecting,
    isConnected,
    isSwitchChain,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  } = useWeb3(chainId)

  const chainInfo = CHAIN_INFO(chainId)
  const nativeCurrency = chainInfo.nativeCurrency

  const [ marketInfo, setMarketInfo ] = useState(false)
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)
  
  const [ allowedERC20Info, setAllowedERC20Info ] = useState({})
  const [ allowedERC20InfoFetched, setAllowedERC20InfoFetched ] = useState(false)
  

  const [ isApproved, setIsApproved ] = useState(false)
  const [ isApprovedFetching, setIsApprovedFetching ] = useState(true)
  const [ isApproving, setIsApproving ] = useState(false)

  const needChainInfo = CHAIN_INFO(chainId)

  const addNotify = (msg, style) => {
  }
  
  useEffect(() => {
    if (activeWeb3 && userAddress) {
      setIsApprovedFetching(true)
      NftIsApproved({
        activeWeb3,
        nftAddress: collectionAddress,
        ownerAddress: userAddress,
        operatorAddress: marketplaceContract,
      }).then((approved) => {
        setIsApproved(approved)
        setIsApprovedFetching(false)
      }).catch((err) => {
        console.log('>>> Fail check is approved', err)
        setIsApprovedFetching(false)
      })
    }
  }, [ activeWeb3, userAddress ])

  useEffect(() => {
    if (chainId && marketplaceContract) {
      
      fetchMarketInfo({
        address: marketplaceContract, 
        chainId,
        onlyInfo: true,
      }).then((_marketInfo) => {
        setMarketInfo(_marketInfo)
        setTradeFee(_marketInfo.tradeFee)
        setMarketInfoFetched(true)
      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract])

  useEffect(() => {
    if (marketInfo) {
      fetchTokensListInfo({
        erc20list: Web3ObjectToArray(marketInfo.allowedERC20),
        chainId,
      }).then((answ) => {
        setAllowedERC20Info(answ)
        setAllowedERC20InfoFetched(true)
      }).catch((err) => {
        console.log('>> fail fetch allowedERC20 token info', marketTokenInfo.erc20, err)
      })
    }
  }, [ marketInfo ])
  
  const [ tradeFee, setTradeFee ] = useState(0)
  const [ sellCurrency, setSellCurrency ] = useState(ZERO_ADDRESS)
  const [ sellPrice, setSellPrice ] = useState(0)
  const [ sellPriceWithFee, setSellPriceWithFee ] = useState(0)
  const [ hasSellPriceError, setHasSellPriceError ] = useState(false)
  
  const updateSellPrice = (newValue) => {
    
    setHasSellPriceError(false)
    try {
      const parsed = parseFloat(newValue)
      if (parsed <= 0) {
        setHasSellPriceError(true)
      } else {
        const priceInWei = toWei(
          newValue,
          (sellCurrency == ZERO_ADDRESS)
            ? nativeCurrency.decimals
            : allowedERC20Info[sellCurrency].decimals
        ).toString()

        const feePart = new BigNumber(priceInWei).dividedBy(100).multipliedBy(tradeFee)
        const withFee = new BigNumber(priceInWei).minus(feePart)

        setSellPriceWithFee(fromWei(
          withFee.toFixed(),
          (sellCurrency == ZERO_ADDRESS)
            ? nativeCurrency.decimals
            : allowedERC20Info[sellCurrency].decimals
        ))
      }
    } catch (e) {
      setSellPriceWithFee(false)
      setHasSellPriceError(true)
    }
    setSellPrice(newValue)
    
  }
  
  const doApproveAndSell = () => {
    if (sellPrice) {
      addNotify(`Approving. Confirm tx`)
      setIsApproving(true)
      NftSetApprove({
        activeWeb3,
        nftAddress: collectionAddress,
        operatorAddress: marketplaceContract,
        onTrx: (txHash) => {
          console.log('>> onTrx', txHash)
          addNotify(`Approve TX ${txHash}`, `success`)
        },
        onSuccess: (receipt) => {},
        onError: (err) => {
          console.log('>> onError', err)
          addNotify(`Fail approve. ${err.message ? err.message : ''}`, `error`)
          setIsApproving(false)
        },
        onFinally: (answer) => {
          addNotify(`Successfull approved`, `success`)
          setIsApproving(false)
          setIsApproved(true)
          doSell()
        }
      })
    }
  }
  
  const [ isSelling, setIsSelling ] = useState(false)
  const doSell = () => {
    setIsSelling(true)
    addNotify(`Placing NFT to Marketplace. Confirm transaction`)
    callMPMethod({
      activeWeb3,
      contractAddress: marketplaceContract,
      method: 'sellNFT',
      args: [
        collectionAddress,
        tokenId.toString(),
        toWei(
          sellPrice,
          sellCurrency == ZERO_ADDRESS
            ? nativeCurrency.decimals
            : allowedERC20Info[sellCurrency].decimals
        ),
        sellCurrency
      ],
      onTrx: (txHash) => {
        console.log('>> onTrx', txHash)
        addNotify(`Placing NFT at Marketplace TX ${txHash}`, `success`)
      },
      onSuccess: (receipt) => {},
      onError: (err) => {
        console.log('>> onError', err)
        addNotify(`Fail place NFT at Marketplace. ${err.message ? err.message : ''}`, `error`)
        setIsSelling(false)
      },
      onFinally: (answer) => {
        addNotify(`NFT successfull placed at Marketplace`, `success`)
        setIsSelling(false)
        onSell()
      }
    })
  }
  
  if (!marketInfoFetched || !allowedERC20InfoFetched) {
    return (
      <>
        <style jsx>
          {`
            .css-1tu9cnm {
              -webkit-animation: animation-103nb1t 2s linear infinite;
              animation: animation-103nb1t 2s linear infinite;
              width: 1em;
              height: 1em;
              margin: 0 auto;
              margin-top: 4px;
            }

            @-webkit-keyframes animation-103nb1t {
              100% {
                -webkit-transform: rotate(360deg);
                -moz-transform: rotate(360deg);
                -ms-transform: rotate(360deg);
                transform: rotate(360deg);
              }
            }

            @keyframes animation-103nb1t {
              100% {
                -webkit-transform: rotate(360deg);
                -moz-transform: rotate(360deg);
                -ms-transform: rotate(360deg);
                transform: rotate(360deg);
              }
            }
            .css-axmsrp {
              stroke-linecap: round;
              -webkit-animation: animation-1en1lui 1.5s ease-in-out infinite;
              animation: animation-1en1lui 1.5s ease-in-out infinite;
            }

            @-webkit-keyframes animation-1en1lui {
              0% {
                stroke-dasharray: 1,150;
                stroke-dashoffset: 0;
              }

              50% {
                stroke-dasharray: 90,150;
                stroke-dashoffset: -35;
              }

              100% {
                stroke-dasharray: 90,150;
                stroke-dashoffset: -124;
              }
            }

            @keyframes animation-1en1lui {
              0% {
                stroke-dasharray: 1,150;
                stroke-dashoffset: 0;
              }

              50% {
                stroke-dasharray: 90,150;
                stroke-dashoffset: -35;
              }

              100% {
                stroke-dasharray: 90,150;
                stroke-dashoffset: -124;
              }
            }
          `}
        </style>
        <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
          <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
            <svg viewBox="0 0 50 50" 
              className="css-1tu9cnm" 
              style={{
                width: '16px',
                height: '16px',
              }}
            >
              <circle cx="25" cy="25" r="20" fill="none" stroke="#FFF" strokeWidth="4" className="css-axmsrp"></circle>
            </svg>
          </div>
        </div>
      </>
    )
  }
  
  const tradeCurrencySymbol = (sellCurrency == ZERO_ADDRESS)
    ? nativeCurrency.symbol
    : allowedERC20Info[sellCurrency].symbol
    
  return (
    <>
      <style jsx>
        {`
          DIV.form {
            display: flex;
          }
          DIV.form INPUT {
            height: 2em;
            width: 100%;
            border: 2px solid #606060;
            padding-left: 0.5em
          }
          DIV.form INPUT.has-error {
            border-color: #990101;
          }
          DIV.form SELECT {
            height: 2em;
            max-width: 8em;
            border: 2px solid #606060;
            padding-left: 0.5em;
            padding-right: 0.5em;
          }
        `}
      </style>
      <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
        <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
          <p className="text-white opacity-60 mt-1 p-[2px]">
            Price:
          </p>
          <div className="form">
            <input 
              className={(hasSellPriceError) ? 'has-error' : ''}
              value={sellPrice}
              onChange={(e) => { updateSellPrice(e.target.value) }}
              type="number"
              min="0"
              step="0.001" 
              disabled={isApprovedFetching || isApproving || isSelling}
            />
            <select
              value={sellCurrency}
              onChange={(e) => { setSellCurrency(e.target.value) }}
              disabled={isApprovedFetching || isApproving || isSelling}
            >
              <option value={ZERO_ADDRESS}>{nativeCurrency.symbol} (Native)</option>
              {Object.keys(allowedERC20Info).length > 0 && (
                <>
                  {Object.keys(allowedERC20Info).map((key) => {
                    return (
                      <option value={key} key={key}>{allowedERC20Info[key].symbol}</option>
                    )
                  })}
                </>
              )}
            </select>
          </div>
          {Number(tradeFee) > 0 && (
            <div className="info">
              <p className="text-white opacity-60 mt-1 p-[2px]">Marketplace fee: {tradeFee}%</p>
              {sellPriceWithFee > 0 && (
                <p className="text-white opacity-60 mt-1 p-[2px]">
                  {`You are got ${sellPriceWithFee} ${tradeCurrencySymbol}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-evenly items-center">
        {`${activeChainId}` !== `${chainId}` ? (
          <Button onClick={() => { switchChainId() }} isLoading={isSwitchChain} width="50%">
            Switch network
          </Button>
        ) : (
          <>
            {isApproved ? (
              <Button 
                disabled={!sellPrice || hasSellPriceError}
                width="50%"
                isLoading={isSelling}
                onClick={doSell}
              >
                {`Sell`}
              </Button>
            ) : (
              <Button
                width="50%"
                onClick={doApproveAndSell}
                isLoading={isApprovedFetching || isApproving || isSelling}
                disabled={!sellPrice || hasSellPriceError}
              >
                {`Approve & Sell`}
              </Button>
            )}
          </>
        )}
        <Button
          width="50%"
          onClick={onCancel}
          disabled={isApproving || isSelling}
        >
          {`Cancel`}
        </Button>
      </div>
    </>
  )
}
