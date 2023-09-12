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

import useWeb3 from "/helpers/useWeb3"
import fetchUserNfts from "/helpers/fetchUserNfts"



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
    _action,
  ] = (router.asPath.split('#')[1] || '').split('/');
  const [ collectionAddress, setCollectionAddress ] = useState(_collectionAddress)
  const [ isSell, setIsSell ] = useState(_action == `sell`)
  const [ isMy, setIsMy ] = useState(_action == `my_listed`)
  
  useEffect(() => {
    const onHashChangeStart = (url) => {
      const [
        _collectionAddress,
        _action
      ] = (url.split('#')[1] || '').split('/');
      setCollectionAddress(_collectionAddress)
      setIsSell(_action == `sell`)
      setIsMy(_action == `my_listed`)
    }
    router.events.on("hashChangeStart", onHashChangeStart)
    return () => { router.events.off("hashChangeStart", onHashChangeStart) }
  }, [router.events])
  /* ---- END HASH ROUTING ----- */
  


  const [ chainId, setChainId ] = useState(storageData?.marketplaceChainId)
  const [ marketplaceContract, setMarketplaceContract ] = useState(storageData?.marketplaceContract)
  
  const {
    isWalletConnecting,
    isConnected,
    address: connectedAddress,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId
  } = useWeb3(chainId)
  

  
  // Fetch collection base info
  const [ collectionInfo, setCollectionInfo ] = useState(false)
  useEffect(() => {
    if (collectionAddress && chainId) {
      setCollectionInfo(false)
      fetchNFTCollectionMeta({
        chainId: chainId,
        address: collectionAddress,
        forAddress: connectedAddress,
      }).then((_collectionInfo) => {
        setCollectionInfo(_collectionInfo)
        console.log('>>> _collectionInfo', _collectionInfo)
      }).catch((err) => {
        console.log('>>> fail fetch collection info', err)
      })
    }
  }, [ collectionAddress, chainId, connectedAddress ] )
  
  // Fetch market info
  const [ marketInfo, setMarketInfo ] = useState(false)
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)
  const [ tokensAtSale, setTokensAtSale ] = useState([])
  const [ tokensAtSaleFetching, setTokensAtSaleFetching ] = useState(true)
  
  useEffect(() => {
    if (chainId && marketplaceContract) {
      setTokensAtSaleFetching(true)
      fetchMarketInfo({
        address: marketplaceContract, 
        chainId,
        collectionAddress,
        forAddress: connectedAddress
      }).then((_marketInfo) => {
        console.log('>>> MARKET INFO', _marketInfo)
        setMarketInfo(_marketInfo)

        setTokensAtSale(
          Web3ObjectToArray(_marketInfo.tokensAtSale)
            .sort((a,b) => {
              return Number(a.utx) > Number(b.utx) ? -1 : 1
            })
        )
        setTokensAtSaleFetching(false)
        setMarketInfoFetched(true)

      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract, collectionAddress, connectedAddress, isMy ])
  


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
  
  const [ userTokens, setUserTokens ] = useState([])
  const [ userTokensFetched, setUserTokensFetched ] = useState(false)
  
  
  useEffect(() => {
    if (chainId && collectionAddress && connectedAddress && collectionInfo) {
      setUserTokensFetched(false)
      fetchUserNfts({
        chainId,
        walletAddress: connectedAddress,
        nftAddress: collectionAddress,
      }).then((answer) => {
        setUserTokens(answer)
        setUserTokensFetched(true)
        
        setTokensUrls((newTokenUrls) => {
          Object.keys(answer).forEach((key) => {
            if (answer[key] !== false) {
              let { tokenURI, tokenId } = answer[key]
              if (collectionInfo.baseExtension) {
                if (tokenURI.substr(-collectionInfo.baseExtension.length) !== collectionInfo.baseExtension) {
                  tokenURI = `${tokenURI}${tokenId}${collectionInfo.baseExtension}`
                } 
              }
              newTokenUrls = {
                ...newTokenUrls,
                [collectionAddress]: {
                  ...newTokenUrls[collectionAddress],
                  [tokenId]: tokenURI,
                },
              }
            }
          })
          return newTokenUrls
        })
        
      }).catch((err) => {
        console.log('Fail fetch user tokens', err)
      })
    }
  }, [ chainId, collectionAddress, collectionInfo, connectedAddress ])
  
  const renderSubHeader = (title) => {
    return (
      <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100"
        style={{
          marginTop: '2em',
        }}
      >
        {title}
      </h2>
    )
  }
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
                    {marketInfo ? marketInfo.collectionListing[collectionAddress] : 0 }
                  </span>
                </p>
                {connectedAddress && (
                  <>
                    <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                      Your listed
                      <span className="max-w-[60px] truncate xl:max-w-[90px]">
                        {marketInfo && marketInfo.userCollectionListed ? marketInfo.userCollectionListed[collectionAddress] : 0 }
                      </span>
                    </p>
                    <p className="w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between">
                      Your NFTs
                      <span className="max-w-[60px] truncate xl:max-w-[90px]">
                        {collectionInfo?.balance || 0 }
                      </span>
                    </p>
                  </>
                )}
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
        {isMy && connectedAddress && (
          <>{renderSubHeader(`Your listed NFTs from this collection`)}</>
        )}
        {(!tokensAtSaleFetching && !isMy && (!isSell || !connectedAddress)) && (
          <>{renderSubHeader(`NFTs listed at Marketplace`)}</>
        )}
        {userTokensFetched && isSell && connectedAddress && (
          <>{renderSubHeader(`Your not listed NFTs from this collection`)}</>
        )}
        <div className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
          {isMy && connectedAddress && (
            <>
              {!tokensAtSaleFetching && (
                <>
                {tokensAtSale.filter((tokenInfo) => {
                  return tokenInfo.seller.toLowerCase() == connectedAddress.toLowerCase()
                }).map((tokenInfo, index) => {
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
                        isDeList={connectedAddress && connectedAddress.toLowerCase() == tokenInfo.seller.toLowerCase()}
                      />
                    </div>
                  )
                })}
                </>
              )}
            </>
          )}
          {(!tokensAtSaleFetching && !isMy && (!isSell || !connectedAddress)) && (
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
                      isDeList={connectedAddress && connectedAddress.toLowerCase() == tokenInfo.seller.toLowerCase()}
                    />
                  </div>
                )
              })}
            </>
          )}
          {userTokensFetched && isSell && connectedAddress && (
            <>
              {userTokens.map(( { tokenId } = tokenInfo, index) => {
                return (
                  <div key={index}>
                    <NftCard 
                      mediaUrl={
                        (tokensUrls[collectionAddress] && tokensUrls[collectionAddress][tokenId.toString()])
                        ? tokensUrls[collectionAddress][tokenId.toString()]
                        : false
                      }
                      collection={collectionAddress}
                      tokenId={tokenId}
                      chainId={chainId}
                      isSell={isSell}
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
