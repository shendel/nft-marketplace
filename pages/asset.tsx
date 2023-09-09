import type { NextPage } from "next"
import { useRouter } from "next/router"
import useStorage from "../storage/"
import { useEffect, useState } from "react"
import styles from "/styles/market.js"

import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import { ipfsUrl } from "/helpers/ipfsUrl"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"
import fetchNftContent from "/helpers/fetchNftContent"

import fetchNFTCollectionMeta from "/helpers/fetchNFTCollectionMeta"


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
    _ownChainId
  ] = (router.asPath.split('#')[1] || '').split('/');

  const [ collectionAddress, setCollectionAddress ] = useState(_collectionAddress)
  const [ tokenId, setTokenId ] = useState(_tokenId)
  const [ ownChainId, setOwnChainId ] = useState(_ownChainId)
  
  useEffect(() => {
    const onHashChangeStart = (url) => {
      const [
        _collectionAddress,
        _tokenId,
        _ownChainId,
      ] = (url.split('#')[1] || '').split('/');
      setCollectionAddress(_collectionAddress)
      setTokenId(_tokenId)
      setOwnChainId(_ownChainId)
    }
    router.events.on("hashChangeStart", onHashChangeStart)
    return () => { router.events.off("hashChangeStart", onHashChangeStart) }
  }, [router.events])
  const [ chainId, setChainId ] = useState(storageData?.marketplaceChainId)
  const [ marketplaceContract, setMarketplaceContract ] = useState(storageData?.marketplaceContract)
  
  
  
  
  // Fetch collection base info
  const [ collectionInfo, setCollectionInfo ] = useState(false)
  useEffect(() => {
    if (collectionAddress && (chainId || ownChainId)) {
      setCollectionInfo(false)
      fetchNFTCollectionMeta({
        chainId: ownChainId || chainId,
        address: collectionAddress,
      }).then((_collectionInfo) => {
        setCollectionInfo(_collectionInfo)
      }).catch((err) => {
        console.log('>>> fail fetch collection info', err)
      })
    }
  }, [ collectionAddress, chainId, ownChainId] )
  

  // Fetch token metadata url
  const [ nftMetadataUrl, setNftMetadataUrl ] = useState(false)
  useEffect(() => {
    if (collectionAddress && tokenId && (chainId || ownChainId)) {
      setNftMetadataUrl(false)
      setNftMetadataJson(false)
      fetchNftContent({
        address: collectionAddress,
        chainId: ownChainId || chainId,
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

  return (
    <>
      <Header />
      <style jsx>
        {styles}
      </style>
      <div>
        <article className="w-full ml-auto mr-auto px-4 md:mt-24 max-w-[1200px]">
          <div className="w-full flex flex-col gap-8 mt-4 md:mt-32 tablet:flex-row pb-32 tablet:pb-0">
            <div className="flex flex-col flex-1 w-full mt-8 tablet:mt-0">
              {nftMetadataJson && nftMetadataJson.image && (
                <img 
                  style={{
                    objectFit: `contain`,
                    width: `300px`,
                    height: `300px`,
                  }}
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
                <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">Traits</h3>
                {nftMetadataJson && nftMetadataJson.attributes && nftMetadataJson.attributes.length && (
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
                )}
                {/*
                <h3 className="mt-8 mb-[15px] text-[23px] font-medium font-GoodTimes text-moon-gold">History</h3>
                <div className="flex flex-wrap gap-4 mt-3 bg-white bg-opacity-[0.13] border border-white border-opacity-20 max-h-[410px] overflow-y-scroll"></div>
                */}
              </div>
            </div>
            <div className="relative w-full max-w-full top-0 tablet:flex-shrink tablet:sticky tablet:min-w-[370px] tablet:max-w-[450px] tablet:mt-4 tablet:mr-4">
              <div className="flex items-center mb-2">
                <a href="https://market.moondao.com/collection/0xE71f58663f80b61f5D127D9DE9d554ca66dED5f1">
                  {/* Collection image */}
                  {/*
                  <img
                    className="!w-[36px] !h-[36px] rounded-lg mr-4 ml-3 mb-2"
                    src="./Marketplace _ Asset_files/2.png"
                    style={{
                      objectFit: `contain`,
                      width: `300px`,
                      height: `300px`,
                    }}
                  />
                  */}
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
              <div className="flex items-center mb-2 mt-6 gap-2 transition-opacity duration-200 ease-in-out mx-4">
                <div 
                  className="mt-4 w-[48px] h-[48px] rounded-[50%] opacity-90 border-2 border-white border-opacity-20"
                  style={{
                    background: 'linear-gradient(90deg, #D194B9, #52D29D)',
                  }}
                ></div>
                <div className="m-0 p-0 ml-[6px] flex flex-col h-full mt-4">
                  <div>
                    <p className="text-white opacity-60 mt-1 p-[2px]">Seller</p>
                    <p className="font-semibold m-0 text-white text-opacity-90">0xEB25F9...833B</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full relative grow bg-transparent rounded-2xl overflow-hidden mt-8 mb-6">
                <div className="p-4 pl-5 rounded-xl bg-white bg-opacity-[0.13] w-full m-0 mb-3">
                  <p className="text-white opacity-60 mt-1 p-[2px]">Price</p>
                  <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">
                    29000 MOONEY 
                    <p
                      className="text-white opacity-60 mt-1 p-[2px]" 
                      style={{marginTop: '12px'}}
                    >Expiration</p>
                    <div className="text-[18px] leading-6 font-semibold text-white text-opacity-90 m-0 rounded-lg">01.01.2030 @ 09:00:00</div>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="flex justify-evenly items-center">
                <button className="connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" data-theme="dark" data-is-loading="false" type="button" aria-label="Connect Wallet" data-test="connect-wallet-button" 
                  style={{minWidth: '140px'}}
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </>
  )
};

export default MarketAsset;
