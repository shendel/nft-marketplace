import NftMedia from "./NftMedia"
import { useEffect, useState } from 'react'
import  fetch from "node-fetch"
import { ipfsUrl } from "/helpers/ipfsUrl"
import { getLink } from "/helpers/getLink"
import { useRouter } from "next/router"
import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import { fromWei } from "/helpers/wei"

export default function NftCard(props) {
  const router = useRouter()
  const {
    mediaUrl,
    allowedERC20Info,
    collectionAddress,
    tokenInfo,
    chainId,
  } = props
  
  const chainInfo = CHAIN_INFO(chainId)
  const {
    price,
    erc20,
  } = tokenInfo

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
    console.log('>>> useState', mediaUrl) 
    if (mediaUrl) {
      console.log('>>> fetch media', mediaUrl)
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
            console.log('>>> json', json)
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
    const buyLink = getLink('asset', `${tokenInfo.collection}/${tokenInfo.tokenId}`)
    router.push(buyLink.replace('_MYAPP/',''))
  }
  
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
                        <img
                          className="object-cover object-center group-hover:scale-110 transition-all duration-200"
                          style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
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
              {/*
              <svg xmlns="http://www.w3.org/2000/svg" width="24.54" height="24.07" viewBox="0 0 350 365" fill="none" className="">
                <path fill="#00156A" d="M332.21 295.813V67.692a267.979 267.979 0 0 0-157.325-51.039A267.98 267.98 0 0 0 17.559 67.692v228.121a268.057 268.057 0 0 0 157.326 51.02 268.054 268.054 0 0 0 157.325-51.02Z"></path>
                <path fill="#F7931E" d="M107.87 181.547c32.269 0 58.428-26.148 58.428-58.403 0-32.255-26.159-58.403-58.428-58.403S49.443 90.89 49.443 123.144c0 32.255 26.159 58.403 58.427 58.403Z"></path>
                <path fill="#8A002D" d="M332.21 295.556c-229.5-26.866-143.758-101.974-131.564-109.313-8.626 5.132-183.087 109.364-183.087 109.364l20.537 13.498a260.277 260.277 0 0 0 136.397 38.839 260.276 260.276 0 0 0 136.513-38.429l21.23-13.882-.026-.077Z"></path>
                <path fill="#F2F2F2" d="M216.023 176.364s15.248-12.086 15.402-20.683c.257-9.52-17.969-37.643-17.969-37.643 12.835 17.423 20.947 24.351 20.947 24.351 11.886 11.086 36.941-5.132 61.842-20.938 0 0-29.47 20.938-42.075 36.643-5.16 6.646.257 18.629 5.109 26.661 0 0-10.5-15.884-20.974-16.449-9.601-.385-22.282 8.058-22.282 8.058Z"></path>
                <path fill="#fff" d="M174.898 16.654a267.054 267.054 0 0 1 157.312 51.32v228.891a267.213 267.213 0 0 1-157.325 51.221 267.214 267.214 0 0 1-157.326-51.221V67.846a267.055 267.055 0 0 1 157.339-51.32v.128Zm0-10.393A276.044 276.044 0 0 0 11.526 59.558l-4.235 3.079V301.97l4.235 3.079a277.557 277.557 0 0 0 163.372 53.17 277.558 277.558 0 0 0 163.371-53.17l4.21-3.079V62.637l-4.21-3.08A276.095 276.095 0 0 0 174.898 6.39v-.128Z"></path>
                <defs>
                  <lineargradient id="a" x1="17.559" x2="332.21" y1="181.752" y2="181.752" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00156A"></stop>
                    <stop offset="0.19" stop-color="#032074"></stop>
                    <stop offset="0.72" stop-color="#0B3B8E"></stop>
                  </lineargradient>
                  <lineargradient id="b" x1="49.443" x2="166.298" y1="123.144" y2="123.144" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F7931E"></stop>
                    <stop offset="0.47" stop-color="#F8A439"></stop>
                    <stop offset="1" stop-color="#F9B95C"></stop>
                  </lineargradient>
                  <lineargradient id="c" x1="134.774" x2="228.645" y1="365.044" y2="202.4" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#8A002D"></stop>
                    <stop offset="0.78" stop-color="#D7594F"></stop>
                  </lineargradient>
                </defs>
              </svg>
              */}
              {viewPrice}
            </p>
          </div>
          <div className="mt-5 pr-9 flex flex-col items-end">
            <p className="font-bold text-xl">#{tokenInfo.tokenId}</p>
            <button onClick={goToBuy} className="absolute top-12 mt-10 border-[0.5px] hover:scale-105 px-[10px] py-[4px] transition-all duration-150 hover:bg-slate-900 rounded-tl-[10px] rounded-br-[10px]">
              <a>Buy now</a>
            </button>
          </div>
        </div>
      </article>
    </>
  )
}