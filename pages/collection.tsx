import type { NextPage } from "next"
import { useRouter } from "next/router"
import useStorage from "../storage/"
import { useEffect, useState } from "react"
import styles from "/styles/market.js"

import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import fetchNFTCollectionMeta from "/helpers/fetchNFTCollectionMeta"
import fetchManyNftContent from '/helpers/fetchManyNftContent'
import fetchTokensListInfo from "/helpers/fetchTokensListInfo"

import { ipfsUrl } from "/helpers/ipfsUrl"
import Web3ObjectToArray from "/helpers/Web3ObjectToArray"

import NftCardSceleton from "/components/market/NftCardSceleton"
import NftCard from "/components/market/NftCard"

import fetchMarketInfo from '/helpers/fetchMarketInfo'



const MarketCollection: NextPage = (props) => {
  const {
    storageData,
    storageData: {
      isBaseConfigReady,
    },
    isOwner,
  } = props
  /* HASH ROUTING */
  const router = useRouter();
  const subRouter = (router.asPath.split('#')[1] || '').split('/');
  const [
    _collectionAddress,
    _ownChainId,
  ] = (router.asPath.split('#')[1] || '').split('/');
  const [ collectionAddress, setCollectionAddress ] = useState(_collectionAddress)
  const [ ownChainId, setOwnChainId ] = useState(_ownChainId)
  
  useEffect(() => {
    const onHashChangeStart = (url) => {
      const [
        _collectionAddress,
        _ownChainId,
      ] = (url.split('#')[1] || '').split('/');
      setCollectionAddress(_collectionAddress)
      setOwnChainId(_ownChainId)
    }
    router.events.on("hashChangeStart", onHashChangeStart)
    return () => { router.events.off("hashChangeStart", onHashChangeStart) }
  }, [router.events])
  /* ---- END HASH ROUTING ----- */
  


  const [ chainId, setChainId ] = useState(storageData?.marketplaceChainId)
  const [ marketplaceContract, setMarketplaceContract ] = useState(storageData?.marketplaceContract)
  
  
  
  
  // Fetch collection base info
  const [ collectionInfo, setCollectionInfo ] = useState(false)
  useEffect(() => {
    if (collectionAddress && (ownChainId || chainId)) {
      setCollectionInfo(false)
      fetchNFTCollectionMeta({
        chainId: ownChainId || chainId,
        address: collectionAddress,
      }).then((_collectionInfo) => {
        setCollectionInfo(_collectionInfo)
        console.log('>>> _collectionInfo', _collectionInfo)
      }).catch((err) => {
        console.log('>>> fail fetch collection info', err)
      })
    }
  }, [ collectionAddress, chainId, ownChainId ] )
  
  // Fetch market info
  const [ marketInfo, setMarketInfo ] = useState(false)
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)
  const [ tokensAtSale, setTokensAtSale ] = useState([])
  const [ tokensAtSaleFetching, setTokensAtSaleFetching ] = useState(true)
  
  
  useEffect(() => {
    if (chainId && marketplaceContract) {
      fetchMarketInfo({
        address: marketplaceContract, 
        chainId,
        collectionAddress,
      }).then((_marketInfo) => {
        console.log('>>> MARKET INFO', _marketInfo)
        setMarketInfo(_marketInfo)

        setTokensAtSale(Web3ObjectToArray(_marketInfo.tokensAtSale))
        setTokensAtSaleFetching(false)
        setMarketInfoFetched(true)

      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract, collectionAddress ])
  // Fetch info about allowed erc20
  const [ allowedERC20Info, setAllowedERC20Info ] = useState(false)
  
  useEffect(() => {
    if (marketInfo) {
      fetchTokensListInfo({
        erc20list: Web3ObjectToArray(marketInfo.allowedERC20),
        chainId,
      }).then((answ) => {
        setAllowedERC20Info(answ)
      }).catch((err) => {
        console.log('>> fail fetch allowedERC20 token info', marketTokenInfo.erc20, err)
      })
    }
  }, [ marketInfo ])
  // Fetch tokens URIs
  const [ tokensUrls, setTokensUrls ] = useState({})
  
  const doFetchTokenUrls = (tokensInfo) => {
    const fetchArgs = {
      chainId: marketInfo.chainId,
      tokensInfo: tokensInfo.map((tokenInfo) => {
        return {
          address: tokenInfo.collection,
          tokenId: tokenInfo.tokenId
        }
      })
    }
    fetchManyNftContent(
      fetchArgs
    ).then((answer) => {
      setTokensUrls((newTokenUrls) => {
        Object.keys(answer).forEach((address_id) => {
          if (answer[address_id] !== false) {
            const [ collection, tokenId ] = address_id.split(`_`)
            newTokenUrls = {
              ...newTokenUrls,
              [collection]: {
                ...newTokenUrls[collection],
                [tokenId]: answer[address_id].tokenURI,
              },
            }
          }
        })
        return newTokenUrls
      })
    }).catch((err) => {
      console.log('>> err', err)
    })
  }
  
  useEffect(() => {
    if (marketInfo && collectionInfo) {
      doFetchTokenUrls(tokensAtSale)
    }
  }, [ marketInfo, collectionInfo, tokensAtSale ])
  
  return (
    <>
      <Header />
      <style jsx>
        {styles}
      </style>
      <main className="px-6 pt-10 md:pt-12 lg:pt-16 flex flex-col items-center w-full">
        {collectionInfo && (
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12 lg:gap-16 xl:gap-20">
            <div>
              {collectionInfo.image && (
                <img
                  style={{
                    objectFit: 'contain',
                    width: '300px',
                    height:'300px',
                  }}
                  className="border-4 p-2 rounded-full object-cover xl:w-[320px] xl:h-[320px]"
                  alt={`${collectionInfo.name} thumbnail`}
                  src={ipfsUrl(collectionInfo.image)}
                />
              )}
            </div>
            <div className="mt-4 md:mt-0 xl:-mt-4">
              <div className="mt-8 w-[320px] md:w-[420px] xl:w-[520px] ">
                <h2 className="mt-8 font-GoodTimes text-2xl md:text-3xl xl:text-4xl  bg-clip-text text-transparent bg-gradient-to-b from-indigo-100 via-moon-orange to-moon-secondary">
                  {collectionInfo.name}
                </h2>
              </div>
              <div className="mt-7 xl:mt-9 grid grid-cols-2 gap-3 text-sm xl:text-base w-[320px] xl:w-[400px]">
                {/*
                <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                  Floor
                  <span className="flex items-center gap-[6px] max-w-[60px] xl:max-w-[90px] truncate">
                    {collectionInfo.avgPrice || 0}
                  </span>
                </p>
                */}
                <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                  Listed
                  <span className="max-w-[60px] truncate xl:max-w-[90px]">
                    {collectionInfo.listed || 0 }
                  </span>
                </p>
                <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                  Supply
                  <span className="max-w-[60px] truncate xl:max-w-[90px]">
                    {collectionInfo.totalSupply || 0 }
                  </span>
                </p>
              </div>
              <div className="mt-8 xl:mt-9 max-w-[320px] xl:max-w-[420px]">
                <p className=" xl:text-base xl:leading-loose text-sm font-light leading-relaxed">
                  {collectionInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
          {!tokensAtSaleFetching && (
            <>
              {tokensAtSale.map((tokenInfo, index) => {
                const {
                  tokenId,
                } = tokenInfo

                return (
                  <div key={index}>
                    <NftCard 
                      mediaUrl={
                        (tokensUrls[tokenInfo.collection] && tokensUrls[tokenInfo.collection][tokenId.toString()])
                        ? tokensUrls[tokenInfo.collection][tokenId.toString()]
                        : false
                      }
                      tokenInfo={tokenInfo}
                      allowedERC20Info={allowedERC20Info}
                      chainId={chainId}
                    />
                  </div>
                )
              })}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
};

export default MarketCollection;
