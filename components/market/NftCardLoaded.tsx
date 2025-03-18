import NftMedia from "./NftMedia"
import { useEffect, useState } from 'react'
import  fetch from "node-fetch"
import { ipfsUrl } from "/helpers/ipfsUrl"
import { getLink } from "/helpers/getLink"
import { useRouter } from "next/router"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import { fromWei } from "/helpers/wei"
import ImgPrecache from "/components/market/ImgPrecache"

export default function NftCard(props) {
  const router = useRouter()
  const {
    mediaUrl,
    allowedERC20Info,
    collectionAddress,
    tokenInfo,
    chainId,
    isSell,
    isDeList,
    tokenId: _tokenId,
    collection: _collection,
    userAddress,
    isShow,
  } = {
    isShow: false,
    tokenId: false,
    collection: false,
    allowedERC20Info: false,
    tokenInfo: false,
    isSell: false,
    isDeList: false,
    userAddress: false,
    ...props,
  }
  const chainInfo = CHAIN_INFO(chainId)
  const {
    tokenId,
    collection,
    price,
    erc20,
  } = tokenInfo || {
    tokenId: _tokenId,
    collection: _collection,
    price: false,
    erc20: false
  }

  const viewPrice = (
    <>
      {erc20 !== ZERO_ADDRESS && allowedERC20Info && !allowedERC20Info[erc20] ? (
        <>...</>
      ) : (
        <>
          {allowedERC20Info !== false ? (
            <>
              {fromWei(price, (erc20 === ZERO_ADDRESS) ? chainInfo.nativeCurrency.decimals : allowedERC20Info[erc20].decimals)}
              {` `}
              {(erc20 === ZERO_ADDRESS) ? chainInfo.nativeCurrency.symbol : allowedERC20Info[erc20].symbol}
            </>
          ) : (
            <>{`...`}</>
          )}
        </>
      )}
    </>
  )
 

  const [ isFetched, setIsFetched ] = useState(false)
  const [ isFetching, setIsFetching ] = useState(true)
  const [ isImageUrl, setIsImageUrl ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [ jsonData, setJsonData ] = useState({})
  
  useState(() => {
    if (mediaUrl) {
      fetch(ipfsUrl(mediaUrl))
        .then((res) => {
          const contentType = res.headers.get('content-type')
          if (contentType.startsWith(`image/`)) {
            return `IMAGE`
          }
          return res.text()
        })
        .then((text) => {
          if (text == `IMAGE`) return `IMAGE`
          try {
            // UTF-8 BOM
            return JSON.parse(text.slice(1))
          } catch (e) {
            try {
              return JSON.parse(text)
            } catch (e) {
              return `FAIL_PARSE`
            }
          }
        })
        .then((json) => {
          
          if (json !== `FAIL_PARSE` && json !== `IMAGE`) {
            setJsonData(json)
          } else {
            if (json === `IMAGE`) {
              setIsImageUrl(true)
            } else {
              setIsError(true)
            }
          }
          setIsFetched(true)
          setIsFetching(false)
        })
        .catch((err) => {
          console.log('fail fetch', err)
        })
    }
  }, [mediaUrl])

  const [ isLoadedMedia, setIsLoadedMedia ] = useState(false)
  const onLoaded = () => {
    setIsLoadedMedia(true)
  }
  const goToBuy = () => {
    if (tokenInfo.isBitable) {
      const buyLink = getLink('asset', `${collection}/${tokenId}/auction/${tokenInfo.offerId}`)
      router.push(buyLink.replace('_MYAPP/',''))
    } else {
      const buyLink = getLink('asset', `${collection}/${tokenId}${(isSell) ? '/sell' : ''}`)
      router.push(buyLink.replace('_MYAPP/',''))
    }
  }
  console.log('>>> tokenInfo', tokenInfo)
  return (
    <>
      <article className="relative group overflow-hidden">
        <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -left-8 -top-3"></div>
        <div className="bg-main-background h-[40px] w-[100px] z-50 rotate-[-32.17deg] absolute -right-8 -bottom-3"></div>
        <div className="w-[335px] h-[275px] overflow-hidden"
          style={{
            position: `relative`,
          }}
        >
          <button onClick={goToBuy}>
            {isFetching ? (
              <div className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"
                style={{
                  width: '335px',
                  height: '275px',
                  borderRadius: 'inherit',
                }}
              ></div>
            ) : (
              <>
                {isFetched && (
                  <>
                    {jsonData && jsonData.image && (
                      <>
                        <div className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"
                          style={{
                            width: '335px',
                            height: '275px',
                            borderRadius: 'inherit',
                            position: 'absolute',
                          }}
                        ></div>
                        <ImgPrecache
                          className="object-cover object-center group-hover:scale-110 transition-all duration-200"
                          style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                          }}
                          loadStyle={{
                            width: '335px',
                            height: '275px',
                          }}
                          src={ipfsUrl(jsonData.image)}
                          onLoad={onLoaded}
                          loading="lazy"
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </button>
        </div>
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 relative z-10 bg-opacity-10 w-[335px] h-[162px] flex justify-between">
          <div className="pl-6 mt-5 flex flex-col items-start">
            <h6 className="text-lg font-bold">
              {jsonData && jsonData.name ? (
                <>{jsonData.name}</>
              ) : (
                <>{`...`}</>
              )}
            </h6>
            <p className="mt-11 text-xl flex items-center gap-3 truncate">
              {/*<!-- CURRENCY ICON -->*/}
              {!isSell && (<>{viewPrice}</>)}
            </p>
          </div>
          <div className="mt-5 pr-9 flex flex-col items-end">
            <p className="font-bold text-xl">#{tokenId}</p>
            <button onClick={goToBuy} className="absolute top-12 mt-10 border-[0.5px] hover:scale-105 px-[10px] py-[4px] transition-all duration-150 hover:bg-slate-900 rounded-tl-[10px] rounded-br-[10px]">

              <a>
                {isDeList
                  ? (tokenInfo.isBitable) ? `At auction` : `De-List`
                  : (isSell)
                    ? `Sell now`
                    : (isShow)
                      ? `More info`
                      : (tokenInfo.isBitable) ? 'Bid' : `Buy now`
                }
              </a>
            </button>
          </div>
        </div>
      </article>
    </>
  )
}