import type { NextPage } from "next"
import { useRouter } from "next/router"
import { getLink, getAssets, getBoolOption, getIntOption } from "/helpers"
import { ipfsUrl } from "/helpers/ipfsUrl"
import useStorage from "/storage/"
import { useEffect, useState } from "react"
import styles from "/styles/market.js"

import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import NftCardSceleton from "/components/market/NftCardSceleton"
import NftCard from "/components/market/NftCard"
import CollectionCard from "/components/market/CollectionCard"

import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import fetchNFTManyCollectionInfo from "/helpers/fetchNFTManyCollectionInfo"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"

import callMPMethod from "/helpers/callMPMethod"
import { CHAIN_INFO, ZERO_ADDRESS } from "/helpers/constants"
import { toWei, fromWei } from "/helpers/wei"
import BigNumber from "bignumber.js"

import Button from "/components/market/Button"

import Web3 from 'web3'
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import fetchNftContent from '/helpers/fetchNftContent'
import fetchManyNftContent from '/helpers/fetchManyNftContent'
import fetchNFTManyCollectionMeta from "/helpers/fetchNFTManyCollectionMeta"
import Web3ObjectToArray from '/helpers/Web3ObjectToArray'

import useWeb3 from "/helpers/useWeb3"

const Market: NextPage = (props) => {
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
  const VIEW_TYPE = {
    ASSETS: `assets`,
    COLLECTIONS: `collections`
  }
  const [
    _viewType,
  ] = (router.asPath.split('#')[1] || '').split('/');
  const [ viewType, setViewType ] = useState(_viewType || VIEW_TYPE.ASSETS)
  
  useEffect(() => {
    const onHashChangeStart = (url) => {
      const [
        _viewType,
      ] = (url.split('#')[1] || '').split('/');
      setViewType(_viewType || VIEW_TYPE.ASSETS)
    }
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
  

  const [ tokensAtSale, setTokensAtSale ] = useState([])
  const [ tokensAtSaleFetching, setTokensAtSaleFetching ] = useState(true)
  const [ tokensAtSaleCount, setTokensAtSaleCount ] = useState(0)
  
  const [ marketInfo, setMarketInfo ] = useState({})
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)


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
  

  const processError = (error, error_namespace) => {
    let metamaskError = false
    try {
      metamaskError = error.message.replace(`Internal JSON-RPC error.`,``)
      metamaskError = JSON.parse(metamaskError)
    } catch (e) {}
    const errMsg = (metamaskError && metamaskError.message) ? metamaskError.message : error.message
    
    switch (errMsg) {
      case `execution reverted: You don't own this token!`:
        console.log(`You dont own this token`)
        break;
      case `MetaMask Tx Signature: User denied transaction signature.`:
        console.log('Transaction denied')
        break;
      case `execution reverted: ERC721: invalid token ID`:
        console.log('Invalid token ID')
        break;
      default:
        console.log('Unkrnown error', error.message)
        break;
    }
  }

  const doSetTokensAtSale = (tokens) => {
    setTokensAtSale(tokens)
  }
  const [ needRefreshTokens, setNeedRefreshTokens ] = useState(false)
  useEffect(() => {
    if (needRefreshTokens) {
      setNeedRefreshTokens(false)
      fetchMarketInfo({
        address: marketplaceContract,
        chainId,
        onlyTokens: true,
      }).then((info) => {
        doSetTokensAtSale(info.tokensAtSale)
      })
    }
  }, [ needRefreshTokens ])
  
  useEffect(() => {
    if (marketInfoFetched) {
      doFetchTokenUrls(tokensAtSale)
    }
  }, [ marketInfoFetched, tokensAtSale ])

  useEffect(() => {
    if (chainId && marketplaceContract) {
      fetchMarketInfo({
        address: marketplaceContract, 
        chainId,
      }).then((_marketInfo) => {
        setMarketInfo(_marketInfo)
        
        setTokensAtSaleCount(_marketInfo.tokensAtSaleCount)
        doSetTokensAtSale(_marketInfo.tokensAtSale)
        setTokensAtSaleFetching(false)
        setMarketInfoFetched(true)
      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract])
  
  useEffect(() => {
    if (storageData
      && storageData.marketplaceChainId
      && storageData.marketplaceContract
    ) {
      setChainId(storageData.marketplaceChainId)
      setMarketplaceContract(storageData.marketplaceContract)
    }
  }, [storageData])
  
  // Fetch info about allowed erc20
  const [ allowedERC20Info, setAllowedERC20Info ] = useState(false)
  
  useEffect(() => {
    if (marketInfo) {
      fetchTokensListInfo({
        erc20list: Web3ObjectToArray(marketInfo.allowedERC20).filter((adr) => { return adr !== ZERO_ADDRESS }),
        chainId,
      }).then((answ) => {
        setAllowedERC20Info(answ)
      }).catch((err) => {
        console.log('>> fail fetch allowedERC20 token info', marketInfo.erc20, err)
      })
    }
  }, [ marketInfo ])

  
  const onSwitchViewType = () => {
    setViewType((viewType == VIEW_TYPE.ASSETS) ? VIEW_TYPE.COLLECTIONS : VIEW_TYPE.ASSETS)
    const viewTypeLink = getLink('buy', (viewType == VIEW_TYPE.ASSETS) ? `collections` : `assets`)
    router.push(viewTypeLink.replace('_MYAPP/',''))
  }
  
  useEffect(() => {
    if (viewType == VIEW_TYPE.ASSETS) {
      setNeedRefreshTokens(true)
    }
    if (viewType == VIEW_TYPE.COLLECTIONS) {
      setNeedRefreshCollections(true)
    }
  }, [viewType])

  const [ collectionsInfo, setCollectionsInfo ] = useState({})
  const [ collectionsMeta, setCollectionsMeta ] = useState({})
  
  const [ needRefreshCollections, setNeedRefreshCollections ] = useState(false)
  
  useEffect(() => {
    if (Object.keys(collectionsInfo).length) {
      const metaPromiseList = []
      Object.keys(collectionsInfo)
        .filter((nftAddress) => {
          return collectionsMeta[nftAddress] === undefined
        })
        .forEach((nftAddress) => {
          metaPromiseList.push( new Promise(async (resolve) => {
            let collectionMetaJson = false
            let collectionZeroJson = false
            let collectionOneJson = false
            
            if (collectionsInfo[nftAddress].contractURI) {
              try {
                collectionMetaJson = await fetchNftMetadata(ipfsUrl(collectionsInfo[nftAddress].contractURI))
              } catch (e) {}
            }
            if (collectionsInfo[nftAddress].zeroTokenURI) {
              try {
                collectionZeroJson = await fetchNftMetadata(ipfsUrl(collectionsInfo[nftAddress].zeroTokenURI))
              } catch (e) {}
            }
            if (!collectionMetaJson && !collectionZeroJson && collectionsInfo[nftAddress].baseExtension && collectionsInfo[nftAddress].hiddenMetadataUri) {
              try {
                collectionOneJson = await fetchNftMetadata(ipfsUrl(`${collectionsInfo[nftAddress].hiddenMetadataUri}${1}${collectionsInfo[nftAddress].baseExtension}`))
              } catch (e) {}
            }
            const collectionMeta = {
              name: collectionMetaJson?.name || collectionZeroJson?.name || collectionsInfo[nftAddress].symbol || `-`,
              description: collectionMetaJson?.description || collectionZeroJson?.description || collectionsInfo[nftAddress].name || `-`,
              image: collectionMetaJson?.image || collectionZeroJson?.image || collectionOneJson?.image || false,
              totalSupply: collectionsInfo[nftAddress]?.totalSupply || 0,
            }
            
            setCollectionsMeta((newMeta) => {
              return {
                ...newMeta,
                [nftAddress]: collectionMeta,
              } 
            })

            resolve(true)
          }) )
        })
      Promise.all(metaPromiseList).then((ready) => {})
    }
  }, [ collectionsInfo ])
  
  useEffect(() => {
    if (needRefreshCollections && marketInfo && marketInfo.chainId) {
      setNeedRefreshCollections(false)
      fetchNFTManyCollectionInfo({
        addressList: Web3ObjectToArray(marketInfo.nftCollections),
        chainId: marketInfo.chainId
      }).then((answer) => {
        setCollectionsInfo({
          ...collectionsInfo,
          ...answer
        })
      }).catch((err) => {
        console.log('>> err', err)
      })
    }
  }, [ needRefreshCollections, marketInfo ])

  const [ viewOffset, setViewOffset ] = useState(0)
  const viewLimit = 15
  const doLoadMore = () => {
    setViewOffset(viewOffset+viewLimit)
  }
  return (
  <>
    <style jsx>
      {styles}
    </style>
    <div>
      <Header {...props} />
      <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
            Buy NFTs
          </h2>
          {/* Filter */}
          <div className="my-8 flex gap-6 sm:gap-8 lg:my-10 flex-col items-center sm:flex-row">
            <div className="flex gap-6">
              <div className="flex flex-col divide-y-2 text-left font-semibold tracking-wider">
                <p className={`${(viewType == VIEW_TYPE.ASSETS) ? 'false' : 'opacity-60'} text-yellow-200 py-1 transition-all duration-150`}>Assets</p>
                <p className="text-indigo-300 py-1">
                  <span className={`${(viewType == VIEW_TYPE.ASSETS) ? 'opacity-60' : 'false'} transition-all duration-150`}>
                    Collections
                  </span>
                </p>
              </div>

              <div className={`${(viewType == VIEW_TYPE.ASSETS) ? 'bg-moon-gold' : 'bg-indigo-600'} flex w-8 h-16 rounded-full ease-in-ease-out duration-150`}>
                <button
                  onClick={onSwitchViewType} 
                  className={`${(viewType == VIEW_TYPE.ASSETS) ? 'false' : 'translate-y-8'} w-9 h-9 bg-white rounded-full ease-in-ease-out duration-150`}
                ></button>
              </div>
            </div>
            {/*
            <select className="font-bold rounded-sm px-3 mt-3 py-2 w-[230px] focus:ring ring-indigo-200">
              <option value="all" selected="">All</option>
              <option value="trending">Trending</option>
              <option value="expiring">Expiring Soon</option>
            </select>
            */}
          </div>
          <p className="mt-[14px] lg:mt-6 text-xl opacity-80">
            {viewType == VIEW_TYPE.ASSETS && (<>{`Pick an asset`}</>)}
            {viewType == VIEW_TYPE.COLLECTIONS && (<>{`Pick from a collection`}</>)}
          </p>
          <section className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
            {viewType == VIEW_TYPE.ASSETS && (
              <>
                {!tokensAtSaleFetching && (
                  <>
                    {tokensAtSale.slice(0, viewOffset + viewLimit).map((tokenInfo, index) => {
                      const {
                        tokenId,
                      } = tokenInfo

                      return (
                        <NftCard 
                          key={index}
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
                      )
                    })}
                  </>
                )}
                
              </>
            )}
            {viewType == VIEW_TYPE.COLLECTIONS && (
              <>
                {marketInfo && marketInfo.nftCollections && (
                  <>
                    {Web3ObjectToArray(marketInfo.nftCollections).map((nftAddress) => {
                      return (
                        <CollectionCard 
                          key={nftAddress}
                          address={nftAddress}
                          isLoading={collectionsInfo[nftAddress] === undefined}
                          collectionInfo={collectionsInfo[nftAddress] || false}
                          collectionMeta={collectionsMeta[nftAddress] || false}
                          listedCount={marketInfo.collectionListing[nftAddress]}
                        />
                      )
                    })}
                  </>
                )}
              </>
            )}
            <article className="relative group overflow-hidden">
              <div className="w-[335px] h-[1px] overflow-hidden"></div>
            </article>
          </section>
          {viewType == VIEW_TYPE.ASSETS && (viewOffset + viewLimit) < tokensAtSale.length && (
            <div style={{textAlign: 'center', width: '100%', paddingTop: '2em'}}>
              <Button
                onClick={doLoadMore}
              >
                {`Load more`}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer {...props} />
    </div>
    </>
  );
};

export default Market;
