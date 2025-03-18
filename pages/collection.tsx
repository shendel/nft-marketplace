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
import fetchNFTCollectionAllTokens from '/helpers/fetchNFTCollectionAllTokens'

import useWeb3 from "/helpers/useWeb3"
import fetchUserNfts from "/helpers/fetchUserNfts"
import { getLink } from "/helpers/getLink"
import { getAssets } from "/helpers/getAssets"

import useUrlHash from "/helpers/useUrlHash"
import Button from "/components/market/Button"
import ImgPrecache from "/components/market/ImgPrecache"

import { ZERO_ADDRESS, CHAIN_INFO } from "/helpers/constants"
import { BigNumber } from "ethers"
import { fromWei } from '/helpers/wei'

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
    _bestOfferSource,
  ] = (router.asPath.split('#')[1] || '').split('/');
  
  const [ collectionAddress, setCollectionAddress ] = useState(_collectionAddress)
  const [ isListed, setIsListed ] = useState(!_action)
  const [ isSell, setIsSell ] = useState(_action == `sell`)
  const [ isMy, setIsMy ] = useState(_action == `my_listed`)
  const [ isAll, setIsAll ] = useState(_action == `all`)
  const [ isBestOffer, setIsBestOffer ] = useState(_action == 'best_offers')
  const [ bestOfferSource, setBestOfferSource ] = useState(_bestOfferSource)
  
  const urlHash = useUrlHash()
  
  useEffect(() => {
    console.log('>>> HASH', urlHash)
    if (urlHash) {
      const [
        _collectionAddress,
        _action,
        _bestOfferSource,
      ] = urlHash.split('/')
      setCollectionAddress(_collectionAddress)
      setIsListed(!_action)
      setIsSell(_action == `sell`)
      setIsMy(_action == `my_listed`)
      setIsAll(_action == `all`)
      setIsBestOffer(_action == 'best_offers')
      setBestOfferSource(_bestOfferSource)
      setViewOffset(0)
    }
  }, [ urlHash ])
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
  const [ bestOffersTokens, setBestOffersTokens ] = useState([])
  const [ floorPrice, setFloorPrice ] = useState({})
  const [ bestPrice, setBestPrice ] = useState({})
  const [ marketVolume, setMarketVolume ] = useState({})

  const [ tokensAtSaleFetching, setTokensAtSaleFetching ] = useState(true)
  
  const [ userTokensAtSale, setUserTokensAtSale ] = useState([])
  
  const [ allTokens, setAllTokens ] = useState([])
  const [ allTokensFetched, setAllTokensFetched ] = useState(false)
  const [ allTokensFetching, setAllTokensFetching ] = useState(false)
  const [ allTokensFetchCurrent, setAllTokensFetchCurrent ] = useState(0)
  const [ allTokensFetchTotal, setAllTokensFetchTotal ] = useState(0)

  useEffect(() => {
    if (isAll && collectionAddress && chainId) {
      setAllTokensFetched(false)
      setAllTokensFetching(true)
      fetchNFTCollectionAllTokens({
        chainId,
        collectionAddress,
        onFetching: (cursorPos, total) => {
          setAllTokensFetchCurrent(cursorPos)
          setAllTokensFetchTotal(total)
        }
      }).then((result) => {
        setAllTokens(Web3ObjectToArray(result))
        setAllTokensFetched(true)
        setAllTokensFetching(false)
      }).catch((err) => {
        setAllTokensFetching(false)
        console.log('>>> fetchNFTCollectionAllTokens', err)
      })
    }
  }, [isAll])

  const _processBestOffers = (tokens) => {
    console.log('>>> PROCESS BEST OFFERS', tokens)
    const byERC20 = {}
    const floorPrice = {}
    const marketVolume = {}
    const bestPrice = {}
    tokens.forEach((token) => {
      if (!byERC20[token.erc20]) {
        byERC20[token.erc20] = []
        floorPrice[token.erc20] = BigNumber.from(0)
        marketVolume[token.erc20] = BigNumber.from(0)
        bestPrice[token.erc20] = BigNumber.from(token.price)
      }
      byERC20[token.erc20].push(token)
      marketVolume[token.erc20] = marketVolume[token.erc20].add(token.price)
      if (BigNumber.from(token.price).lt(bestPrice[token.erc20])) bestPrice[token.erc20] = BigNumber.from(token.price)
    })
    let _tokens = []
    Object.keys(byERC20).forEach((erc20) => {
      _tokens = [
        ..._tokens,
        ...byERC20[erc20].sort((a,b) => {
          return (BigNumber.from(a.price).gt(b.price)) ? 1 : -1
        })
      ]
      floorPrice[erc20] = marketVolume[erc20].div(byERC20[erc20].length).toString()
      marketVolume[erc20] = marketVolume[erc20].toString()
    })
    setBestOffersTokens(_tokens)
    setFloorPrice(floorPrice)
    setMarketVolume(marketVolume)
    setBestPrice(bestPrice)
    console.log(_tokens)
    console.log(floorPrice)
    console.log(marketVolume)
  }
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

        setTokensAtSale(_marketInfo.tokensAtSale)
        _processBestOffers(_marketInfo.tokensAtSale)
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
      console.log('>>> marketInfo.allowedERC20', marketInfo.allowedERC20)
      fetchTokensListInfo({
        erc20list: Web3ObjectToArray(marketInfo.allowedERC20).filter((adr) => { return adr !== ZERO_ADDRESS }),
        chainId,
      }).then((answ) => {
        console.log('>>>> INFO ERC20', answ, marketInfo.allowedERC20)
        setAllowedERC20Info(answ)
      }).catch((err) => {
        console.log('>> fail fetch allowedERC20 token info',  err)
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
      if (connectedAddress) {
        setUserTokensAtSale(tokensAtSale.filter((tokenInfo) => {
          return tokenInfo.seller.toLowerCase() == connectedAddress.toLowerCase()
        }))
      }      
    }
  }, [ marketInfo, collectionInfo, connectedAddress, tokensAtSale ])
  
  const [ userTokens, setUserTokens ] = useState([])
  const [ userTokensFetched, setUserTokensFetched ] = useState(false)
  const [ userTokensFetching, setUserTokensFetching ] = useState(false)
  const [ userTokensFetchCurrent, setUserTokensFetchCurrent ] = useState(0)
  const [ userTokensFetchTotal, setUserTokensFetchTotal ] = useState(0)

  
  useEffect(() => {
    if (chainId && collectionAddress && connectedAddress && collectionInfo) {
      setUserTokensFetched(false)
      setUserTokensFetching(true)
      fetchNFTCollectionAllTokens({
        chainId,
        collectionAddress,
        chunkSize: 200,
        userAddress: connectedAddress,
        onFetching: (cursorPos, total) => {
          setUserTokensFetchCurrent(cursorPos)
          setUserTokensFetchTotal(total)
        }
      }).then((result) => {
        const answer = Web3ObjectToArray(result).filter((tokenInfo) => {
          //return (tokenInfo && tokenInfo.ownerOf.toLowerCase() == '0x9277eE6EfEB5FE9581738F157612795C57DffAF0'.toLowerCase())
          return (tokenInfo && tokenInfo.ownerOf.toLowerCase() == connectedAddress.toLowerCase())
        })
        setUserTokens(answer)
        setUserTokensFetched(true)
        setUserTokensFetching(false)

      }).catch((err) => {
        setAllTokensFetching(false)
        console.log('>>> fetchNFTCollectionAllTokens', err)
      })
      
      /*
      fetchUserNfts({
        chainId,
        walletAddress: connectedAddress,
        nftAddress: collectionAddress,
      }).then((answer) => {
        setUserTokens(answer)
        setUserTokensFetched(true)
        setUserTokensFetching(false)
        
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
      */
    }
  }, [ chainId, collectionAddress, collectionInfo, connectedAddress ])
  
  const renderSubHeader = (title) => {
    return (
      <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100"
        style={{
          marginTop: '2em',
          textAlign: 'center'
        }}
      >
        {title}
      </h2>
    )
  }
  
  const renderLoader = (title) => {
    return (
      <>
        <style jsx>
          {`
            .loader {
              padding-top: 2em;
              padding-boolean: 2em;
              text-align: center;
            }
            .loader IMG {
              display: block;
              margin: 0 auto;
              width: 6em;
            }
            .loader STRONG {
              display: block;
            }
          `}
        </style>
        <div className="loader">
          <img src={getAssets(`images/loader.svg`, 'loader')} />
          <strong>{title}</strong>
        </div>
      </>
    )
  }
  
  const [ viewOffset, setViewOffset ] = useState(0)
  const viewLimit = 15
  const doLoadMore = () => {
    setViewOffset(viewOffset + viewLimit)
  }
  let showLoadMore = false
  if (isMy && connectedAddress && (viewOffset + viewLimit) < userTokensAtSale.length ) showLoadMore = true
  if (userTokensFetched && isSell && connectedAddress && (viewOffset + viewLimit) < userTokens.length ) showLoadMore = true
  if (!tokensAtSaleFetching && (!isMy || !connectedAddress) && (!isSell || !connectedAddress) && !isAll && (viewOffset + viewLimit) < tokensAtSale.length ) showLoadMore = true
  if (isAll && !allTokensFetching && (viewOffset + viewLimit) < allTokens.length) showLoadMore = true
  
  const infoPanelItemStyle = `w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between`
  const infoPanelBest = `w-[149px] xl:w-[189px] rounded-[3px] bg-[#301B3D] py-[6px] xl:py-2 px-[10px] xl:px-3 flex items-center justify-between`
  
  
  const chainInfo = CHAIN_INFO(chainId)
  
  return (
    <>
      <Header {...props} />
      <style jsx>
        {styles}
      </style>
      <main className="px-6 pt-10 md:pt-12 lg:pt-16 flex flex-col items-center w-full">
        {collectionInfo && (
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12 lg:gap-16 xl:gap-20">
            {collectionInfo.image && (
              <div>
                <ImgPrecache
                  style={{
                    objectFit: 'contain',
                    width: '300px',
                    height:'300px',
                  }}
                  className="border-4 p-2 rounded-full object-cover xl:w-[320px] xl:h-[320px]"
                  alt={`${collectionInfo.name} thumbnail`}
                  src={ipfsUrl(collectionInfo.image)}
                />
              </div>
            )}
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
                <a href={getLink('collection', `${collectionAddress}`)}>
                  <p className={`${infoPanelItemStyle} ${(isListed) ? 'active' : ''}`}>
                    Listed
                    <span className="max-w-[60px] truncate xl:max-w-[90px]">
                      {marketInfo ? marketInfo.collectionListing[collectionAddress] : 0 }
                    </span>
                  </p>
                </a>
                {connectedAddress && (
                  <>
                    <a href={getLink('collection', `${collectionAddress}/my_listed`)}>
                      <p className={`${infoPanelItemStyle} ${(isMy) ? 'active' : ''}`}>
                        Your listed
                        <span className="max-w-[60px] truncate xl:max-w-[90px]">
                          {marketInfo && marketInfo.userCollectionListed ? marketInfo.userCollectionListed[collectionAddress] : 0 }
                        </span>
                      </p>
                    </a>
                    <a href={getLink('collection', `${collectionAddress}/sell`)}>
                      <p className={`${infoPanelItemStyle} ${(isSell) ? 'active' : ''}`}>
                        Your NFTs
                        <span className="max-w-[60px] truncate xl:max-w-[90px]">
                          {collectionInfo?.balance || 0 }
                        </span>
                      </p>
                    </a>
                  </>
                )}
                <a href={getLink('collection', `${collectionAddress}/all`)}>
                  <p className={`${infoPanelItemStyle} ${(isAll) ? 'active' : ''}`}>
                    Supply
                    <span className="max-w-[60px] truncate xl:max-w-[90px]">
                      {collectionInfo.totalSupply || 0 }
                    </span>
                  </p>
                </a>
              </div>
              <div className="mt-7 xl:mt-9 grid grid-cols-1 gap-3 text-sm xl:text-base w-[320px] xl:w-[400px]">
                {bestPrice[ZERO_ADDRESS] && (
                  <a href={getLink('collection', `${collectionAddress}/best_offers/${ZERO_ADDRESS}`)}>
                    <p style={{ width: '394px' }} className={`${infoPanelItemStyle} ${(isBestOffer && ZERO_ADDRESS == bestOfferSource) ? 'active' : ''}`}>
                      Best Offer
                      <span className="max-w-[60px] truncate xl:max-w-[90px]">
                        {fromWei(bestPrice[ZERO_ADDRESS], chainInfo.nativeCurrency.decimals)}
                        {` `}
                        {chainInfo.nativeCurrency.symbol}
                      </span>
                    </p>
                  </a>
                )}
                {allowedERC20Info && (
                  <>
                    {Object.keys(bestPrice).map((erc20) => {
                      if (erc20 != ZERO_ADDRESS) {
                        return (
                          <a key={erc20} href={getLink('collection', `${collectionAddress}/best_offers/${erc20}`)}>
                            <p style={{ width: '394px' }} className={`${infoPanelItemStyle} ${(isBestOffer && erc20 == bestOfferSource) ? 'active' : ''}`}>
                              Best Offer
                              <span className="max-w-[60px] truncate xl:max-w-[90px]">
                                {fromWei(bestPrice[erc20], allowedERC20Info[erc20].decimals)}
                                {` `}
                                {allowedERC20Info[erc20].symbol}
                              </span>
                            </p>
                          </a>
                        )
                      }
                    })}
                  </>
                )}
              </div>
              <div className="mt-8 xl:mt-9 max-w-[320px] xl:max-w-[420px]">
                <p className=" xl:text-base xl:leading-loose text-sm font-light leading-relaxed">
                  {collectionInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}
        {isAll && (
          <>
            {renderSubHeader(`All NFTs from this collection`)}
            {allTokensFetching && renderLoader(`Fetching ${(allTokensFetchTotal > 0) ? Math.round(allTokensFetchCurrent/allTokensFetchTotal*100) : 0}%`)}
          </>
        )}
        {isMy && connectedAddress && (
          <>
            {renderSubHeader(`Your listed NFTs from this collection`)}
            {tokensAtSaleFetching && renderLoader(`Fetching`)}
          </>
        )}
        {((!isMy || !connectedAddress) && (!isSell || !connectedAddress) && !isAll) && (
          <>
            {isBestOffer
              ? renderSubHeader('Best offers')
              : renderSubHeader(`NFTs listed at Marketplace`)
            }
            {tokensAtSaleFetching && renderLoader(`Fetching`)}
          </>
        )}
        {isSell && connectedAddress && (
          <>
            {renderSubHeader(`Your not listed NFTs`)}
            {userTokensFetching && renderLoader(`Fetching ${(userTokensFetchTotal > 0) ? Math.round(userTokensFetchCurrent/userTokensFetchTotal*100) : 0}%`)}
          </>
        )}
        {isBestOffer && !tokensAtSaleFetching && allowedERC20Info && (
          <div className="volumeHolder">
            <p>
              <span>Floor Price</span>
              <span>
                {fromWei(floorPrice[bestOfferSource], (bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.decimals : allowedERC20Info[bestOfferSource].decimals)}
                {` `}
                {(bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.symbol : allowedERC20Info[bestOfferSource].symbol}
              </span>
            </p>
            <p>
              <span>Top Offer</span>
              <span>
                {fromWei(bestPrice[bestOfferSource], (bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.decimals : allowedERC20Info[bestOfferSource].decimals)}
                {` `}
                {(bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.symbol : allowedERC20Info[bestOfferSource].symbol}
              </span>
            </p>
            <p>
              <span>Total Volume</span>
              <span>
                {fromWei(marketVolume[bestOfferSource], (bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.decimals : allowedERC20Info[bestOfferSource].decimals)}
                {` `}
                {(bestOfferSource == ZERO_ADDRESS) ? chainInfo.nativeCurrency.symbol : allowedERC20Info[bestOfferSource].symbol}
              </span>
            </p>
          </div>
        )}
        <div className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
          {isAll && (
            <>
              {allTokensFetched && !allTokensFetching && (
                <>
                  {allTokens.slice(0, viewOffset + viewLimit).map(( { tokenId, tokenURI } = tokenInfo, index) => {
                    return (
                      <div key={index}>
                        <NftCard 
                          mediaUrl={tokenURI}
                          collection={collectionAddress}
                          tokenId={tokenId}
                          chainId={chainId}
                          isShow={true}
                        />
                      </div>
                    )
                  })}
                </>
              )}
            </>
          )}
          {isMy && connectedAddress && (
            <>
              {!tokensAtSaleFetching && (
                <>
                {userTokensAtSale.slice(0, viewOffset + viewLimit).map((tokenInfo, index) => {
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
          {(!tokensAtSaleFetching && (!isMy || !connectedAddress) && (!isSell || !connectedAddress) && !isAll) && (
            <>
              {((isBestOffer)
                ? bestOffersTokens.filter((token) => {
                  return (token.erc20 == bestOfferSource)
                })
                : tokensAtSale
              ).slice(0, viewOffset + viewLimit).map((tokenInfo, index) => {
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
              {userTokens.slice(0, viewOffset + viewLimit).map(( { tokenURI, tokenId } = tokenInfo, index) => {
                return (
                  <div key={index}>
                    <NftCard 
                      mediaUrl={tokenURI}
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
        {showLoadMore && (
          <div style={{textAlign: 'center', paddingTop: '2em'}}>
            <Button
              onClick={doLoadMore}
            >
              {`Load more`}
            </Button>
          </div>
        )}
      </main>
      <Footer {...props} />
    </>
  )
};

export default MarketCollection;
