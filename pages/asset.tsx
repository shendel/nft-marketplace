import type { NextPage } from "next"
import { useRouter } from "next/router"
import useStorage from "../storage/"
import { useEffect, useState } from "react"
import styles from "/styles/market.js"
import { getLink } from "/helpers/"
import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import { ipfsUrl } from "/helpers/ipfsUrl"
import Web3ObjectToArray from "/helpers/Web3ObjectToArray"
import { toWei, fromWei } from "/helpers/wei"

import { fetchNftMetadata } from "/helpers/fetchNftMetadata"

import fetchNftContent from "/helpers/fetchNftContent"

import fetchNFTCollectionMeta from "/helpers/fetchNFTCollectionMeta"
import fetchMarketTokenInfo from "/helpers/fetchMarketTokenInfo"
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import fetchNFTTokenOwner from "/helpers/fetchNFTTokenOwner"
import AddressBlock from "/components/market/AddressBlock"

import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"

import BuyButton from "/components/market/BuyButton"
import useWeb3 from "/helpers/useWeb3"

import Button from "/components/market/Button"
import SellNftForm from "/components/market/SellNftForm"
import DeListingButton from "/components/market/DeListingButton"
import ImgPrecache from "/components/market/ImgPrecache"

const MarketAsset: NextPage = (props) => {
  const {
    storageData,
    storageData: {
      isBaseConfigReady,
    },
    isOwner,
  } = props
  
  
  
  const router = useRouter();
  const subRouter = (router.asPath.split('#')[1] || '').split('/');
  const [
    _collectionAddress,
    _tokenId,
    _isSellOpened,
  ] = (router.asPath.split('#')[1] || '').split('/');

  const [ collectionAddress, setCollectionAddress ] = useState(_collectionAddress)
  const [ tokenId, setTokenId ] = useState(_tokenId)
  const [ isSellOpened, setIsSellOpened ] = useState((_isSellOpened == `sell`))
  
  // HAsH ROUTER
  useEffect(() => {
    const onHashChangeStart = (url) => {
      const [
        _collectionAddress,
        _tokenId,
        _isSellOpened,
      ] = (url.split('#')[1] || '').split('/');
      console.log('>>> HASH', _isSellOpened)
      setCollectionAddress(_collectionAddress)
      setTokenId(_tokenId)
      setMarketTokenInfo(false)
      setSellCurrency(false)
      setIsSellCurrencyFetched(false)
      setIsSellOpened(_isSellOpened == `sell`)
    }
    router.events.on("hashChangeStart", onHashChangeStart)
    return () => { router.events.off("hashChangeStart", onHashChangeStart) }
  }, [router.events])
  const [ chainId, setChainId ] = useState(storageData?.marketplaceChainId)
  const [ marketplaceContract, setMarketplaceContract ] = useState(storageData?.marketplaceContract)
  const { address: connectedAddress } = useWeb3(chainId)
  // ---- END HASH ROUTER -----

  // Fetch token info from market
  const [ marketTokenInfo, setMarketTokenInfo ] = useState(false)
  const [ tokenNotListening, setTokenNotListening ] = useState(false)
  
  const _doFetchMarketTokenInfo = () => {
    fetchMarketTokenInfo({
      marketAddress: marketplaceContract,
      chainId,
      collectionAddress,
      tokenId,
    }).then((answ) => {
      console.log('>>> market token info', answ)
      if (answ?.tokenInfo) {
        setMarketTokenInfo(answ.tokenInfo)
        setTokenNotListening(false)
      } else {
        setTokenNotListening(true)
      }
    }).catch((err) => {
      console.log('>>> Fail fetch market token info', err)
    })
  }
  useEffect(() => {
    if (chainId && tokenId && collectionAddress && marketplaceContract) {
      _doFetchMarketTokenInfo()
    }
  }, [ collectionAddress, chainId, tokenId, marketplaceContract ])
  
  const [ sellCurrency , setSellCurrency ] = useState(`...`)
  const [ isSellCurrencyFetched, setIsSellCurrencyFetched ] = useState(false)

  useEffect(() => {
    if (marketTokenInfo && chainId) {
      if (marketTokenInfo.erc20 === ZERO_ADDRESS) {
        const chainInfo = CHAIN_INFO(chainId)
        setSellCurrency(chainInfo.nativeCurrency)
        setIsSellCurrencyFetched(true)
      } else {
        fetchTokensListInfo({
          erc20list: [ marketTokenInfo.erc20] ,
          chainId,
          // @To-Do - add check allowance when logged in
          /*
          withAllowance: true
          */
        }).then((answ) => {
          if (answ && answ[marketTokenInfo.erc20] && answ[marketTokenInfo.erc20].symbol) {
            setSellCurrency(answ[marketTokenInfo.erc20])
          }
          setIsSellCurrencyFetched(true)
          console.log('>> allowedERC20', answ)
        }).catch((err) => {
          setIsSellCurrencyFetched(true)
          console.log('>> fail fetch allowedERC20 token info', marketTokenInfo.erc20, err)
        })
      }
    }
  }, [ marketTokenInfo, chainId ])
  // Fetch collection base info
  const [ collectionInfo, setCollectionInfo ] = useState(false)
  useEffect(() => {
    if (collectionAddress && (chainId)) {
      setCollectionInfo(false)
      fetchNFTCollectionMeta({
        chainId: chainId,
        address: collectionAddress,
      }).then((_collectionInfo) => {
        setCollectionInfo(_collectionInfo)
      }).catch((err) => {
        console.log('>>> fail fetch collection info', err)
      })
    }
  }, [ collectionAddress, chainId ] )
  
  
  const [ isTokenOwnerFetched, setIsTokenOwnerFetched ] = useState(false)
  const [ tokenOwner, setTokenOwner ] = useState(false)

  const _doFetchTokenOwner = () => {
    setIsTokenOwnerFetched(false)
    fetchNFTTokenOwner({
      chainId,
      collection: collectionAddress,
      tokenId,
    }).then((owner) => {
      setTokenOwner(owner)
      setIsTokenOwnerFetched(true)
    }).catch((err) => {
      console.log('>>> Fail fetch token owner', err)
    })
  }
  useEffect(() => {
    _doFetchTokenOwner()
  }, [ tokenId, collectionAddress, chainId ])
  
  const [ isMyToken, setIsMyToken ] = useState(false)
  useEffect(() => {
    if (connectedAddress && tokenOwner) {
      console.log('>>> IS MY TOKEN', connectedAddress && tokenOwner && connectedAddress.toLowerCase() == tokenOwner.toLowerCase())
      console.log(connectedAddress, tokenOwner)
      setIsMyToken(connectedAddress.toLowerCase() == tokenOwner.toLowerCase())
    } else {
      setIsMyToken(false)
    }
  }, [ connectedAddress, tokenOwner ])
  
  const doTokenInfoReload = () => {
    _doFetchTokenOwner()
    _doFetchMarketTokenInfo()
  }

  // Fetch token metadata url
  const [ nftMetadataUrl, setNftMetadataUrl ] = useState(false)
  useEffect(() => {
    if (collectionAddress && tokenId && (chainId)) {
      setNftMetadataUrl(false)
      setNftMetadataJson(false)
      fetchNftContent({
        address: collectionAddress,
        chainId: chainId,
        ids: [tokenId],
      }).then((_nftMetadataUrl) => {
        if (_nftMetadataUrl && _nftMetadataUrl[tokenId]) {
          setNftMetadataUrl(_nftMetadataUrl[tokenId])
        }
      }).catch((err) => {
        console.log('>>> fail fetch nft metadata url', err)
      })
    }
  }, [collectionAddress, tokenId])
  // Fetch token metadata json from url
  const [ nftMetadataJson, setNftMetadataJson ] = useState(false)
  useEffect(() => {
    if (nftMetadataUrl) {
      fetchNftMetadata(ipfsUrl(nftMetadataUrl)).then((_nftMetadataJson) => {
        setNftMetadataJson(_nftMetadataJson)
        console.log(_nftMetadataJson)
      }).catch((err) => {
        console.log('>>> fail parse nft json metadata', err, nftMetadataUrl)
      })
    }
  }, [nftMetadataUrl])

  const switchIsSellOpened = () => {
    setIsSellOpened(!isSellOpened)
  }

  return (
    <>
      <Header {...props} />
      <style jsx>
        {styles}
      </style>
      <div>
        <article className="w-full ml-auto mr-auto px-4 md:mt-24 max-w-[1200px]">
          <div className="w-full flex flex-col gap-8 mt-4 md:mt-32 tablet:flex-row pb-32 tablet:pb-0">
            <div className="flex flex-col flex-1 w-full mt-8 tablet:mt-0">
              {nftMetadataJson && nftMetadataJson.image && (
                <ImgPrecache
                  load="lazy"
                  style={{
                    objectFit: `contain`,
                    width: `300px`,
                    height: `300px`,
                  }}
                  loadStyle={{
                    width: `300px`,
                    height: `300px`,
                  }}
                  loadTitle="Loading NFT image:"
                  className="!w-full !h-full bg-white bg-opacity-[0.04] rounded-2xl"
                  alt={nftMetadataJson.name || ``}
                  src={nftMetadataJson.image}
                />
              )}
              <div className="px-4">
                <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">Description</h3>
                <p className="font-medium text-base leading-[25px] opacity-80 font-mono">
                  {nftMetadataJson && nftMetadataJson.description && (
                    <>
                      {nftMetadataJson.description}
                    </>
                  )}
                </p>
                {nftMetadataJson && nftMetadataJson.attributes && nftMetadataJson.attributes.length && (
                  <>
                    <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">Traits</h3>
                    <div className="py-3 flex flex-wrap gap-4 md:gap-5 mt-3">
                      {nftMetadataJson.attributes.map((attr, index) => {
                        if (attr && attr.trait_type && attr.value) {
                          return (
                            <div key={index} className="flex flex-col gap-[6px] rounded-lg bg-slate-900 text-center min-w-[128px] lg:min-w-[142px] min-h-[32px] lg:min-h-[38px] grow-0">
                              <p className="text-moon-gold opacity-70 px-2 pt-1 pb-[2px] bg-[#030712] font-semibold uppercase tracking-widest text-sm">
                                {attr.trait_type}
                              </p>
                              <p className="text-base px-2 pb-2 text-white tracking-wider text-[17px] font-mono capitalize">
                                {attr.value}
                              </p>
                            </div>
                          )
                        } else return null
                      })}
                      <p></p>
                    </div>
                  </>
                )}
                {nftMetadataJson && nftMetadataJson.properties && nftMetadataJson.properties.length && (
                  <>
                    <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">Properties</h3>
                    <div className="py-3 flex flex-wrap gap-4 md:gap-5 mt-3">
                      {nftMetadataJson.properties.map((attr, index) => {
                        if (attr && attr.type && attr.name) {
                          return (
                            <div key={index} className="flex flex-col gap-[6px] rounded-lg bg-slate-900 text-center min-w-[128px] lg:min-w-[142px] min-h-[32px] lg:min-h-[38px] grow-0">
                              <p className="text-moon-gold opacity-70 px-2 pt-1 pb-[2px] bg-[#030712] font-semibold uppercase tracking-widest text-sm">
                                {attr.type}
                              </p>
                              <p className="text-base px-2 pb-2 text-white tracking-wider text-[17px] font-mono capitalize">
                                {attr.name}
                              </p>
                            </div>
                          )
                        } else return null
                      })}
                      <p></p>
                    </div>
                  </>
                )}
                {/*
                <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">History</h3>
                <div className="flex flex-wrap gap-4 mt-3 bg-white bg-opacity-[0.13] border border-white border-opacity-20 max-h-[410px] overflow-y-scroll"></div>
                */}
              </div>
            </div>
            <div className="relative w-full max-w-full top-0 tablet:flex-shrink tablet:sticky tablet:min-w-[370px] tablet:max-w-[450px] tablet:mt-4 tablet:mr-4">
              <div className="flex items-center mb-2">
                <a href={getLink(`collection`, collectionAddress)}>
                  {/* Collection image */}
                  {collectionInfo && collectionInfo.image && (
                    <ImgPrecache
                      className="!w-[36px] !h-[36px] rounded-lg mr-4 ml-3 mb-2"
                      src={ipfsUrl(collectionInfo.image)}
                      style={{
                        objectFit: `contain`,
                        width: `300px`,
                        height: `300px`,
                      }}
                    />
                  )}
                  <p className="truncate w-full mx-4 mt-[5px] opacity-50">
                    {collectionInfo && collectionInfo.name ? (
                      <>{collectionInfo.name}</>
                    ) : (
                      <>....</>
                    )}
                  </p>
                </a>
              </div>
              <h1 className="font-GoodTimes font-medium text-[32px] break-words mb-2 mx-4 text-moon-white">
                {nftMetadataJson && nftMetadataJson.name ? (
                  <>{nftMetadataJson.name}</>
                ) : (
                  <>{`...`}</>
                )}
              </h1>
              <div className="inline-block">
                <p className="font-medium truncate mx-4 mt-4 text-[20px] py-1 px-[10px] rounded-sm bg-moon-secondary bg-opacity-40">Token ID #
                  {tokenId}
                </p>
              </div>
              {tokenNotListening && (
                <>
                  {!isMyToken && isTokenOwnerFetched && (
                    <AddressBlock label={`NFT Owner`} address={tokenOwner} />
                  )}
                  {!isMyToken || !(isMyToken && isSellOpened) && (
                    <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
                      <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
                        <p className="text-white opacity-60 mt-1 p-[2px]">
                          NFT not listening at marketplace
                        </p>
                      </div>
                    </div>
                  )}
                  {isMyToken && (
                    <>
                      {!isSellOpened && (
                        <div className="flex justify-evenly items-center">
                          <Button onClick={switchIsSellOpened} >{`Sell this NFT token`}</Button>
                        </div>
                      )}
                      {isSellOpened && (
                        <SellNftForm
                          marketplaceContract={marketplaceContract}
                          chainId={chainId}
                          tokenId={tokenId}
                          collectionAddress={collectionAddress}
                          onSell={() => {
                            setIsSellOpened(false)
                            doTokenInfoReload()
                          }}
                          onCancel={() => {
                            setIsSellOpened(false)
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
              {!tokenNotListening && (
                <>
                  <AddressBlock label={`Seller`} address={marketTokenInfo?.seller} />
                  <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
                    <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
                      <p className="text-white opacity-60 mt-1 p-[2px]">Price</p>
                      {isSellCurrencyFetched && sellCurrency && marketTokenInfo && marketTokenInfo.price ? (
                        <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                          {fromWei(marketTokenInfo.price, sellCurrency.decimals)}
                          {` `}
                          {sellCurrency.symbol}
                          {/*
                          <p
                            className="text-white opacity-60 mt-1 p-[2px]" 
                            style={{marginTop: '12px'}}
                          >Expiration</p>
                          <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">01.01.2030 @ 09:00:00</div>
                          */}
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
                  {(
                    marketTokenInfo
                    && connectedAddress
                    && (marketTokenInfo.seller.toLowerCase() == connectedAddress.toLowerCase())
                  ) && (
                    <div className="flex justify-evenly items-center">
                      <DeListingButton
                        chainId={chainId}
                        marketplaceContract={marketplaceContract}
                        collectionAddress={collectionAddress}
                        tokenId={tokenId}
                        onDelist={doTokenInfoReload}
                      />
                    </div>
                  )}
                  {(
                    isSellCurrencyFetched
                    && sellCurrency
                    && marketTokenInfo
                    && (
                      !connectedAddress
                      || 
                      (marketTokenInfo.seller.toLowerCase() !== connectedAddress.toLowerCase())
                    )
                    && marketTokenInfo.price
                  ) && (
                    <div className="flex justify-evenly items-center">
                      <BuyButton 
                        chainId={chainId}
                        marketplaceContract={marketplaceContract}
                        marketTokenInfo={marketTokenInfo}
                        price={fromWei(marketTokenInfo.price, sellCurrency.decimals)}
                        onBuy={doTokenInfoReload}
                        currency={sellCurrency.symbol}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </article>
      </div>
      <Footer {...props} />
    </>
  )
};

export default MarketAsset;
