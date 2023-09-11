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

import { setupWeb3, switchOrAddChain, doConnectWithMetamask, isMetamaskConnected, onWalletChanged } from "../helpers/setupWeb3"
import { calcSendArgWithFee } from "/helpers/calcSendArgWithFee"

import fetchTokensListInfo from "/helpers/fetchTokensListInfo"
import fetchNFTManyCollectionInfo from "/helpers/fetchNFTManyCollectionInfo"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"

import callMPMethod from "/helpers/callMPMethod"
import nftSaleToken from "/components/nftSaleToken"
import { CHAIN_INFO, ZERO_ADDRESS } from "/helpers/constants"
import { toWei, fromWei } from "/helpers/wei"
import BigNumber from "bignumber.js"
import approveToken from "/helpers/approveToken"
import fetchUserNfts from "/helpers/fetchUserNfts"
import SellNftModal from "/components/SellNftModal"
import Paginator from "/components/Paginator"

import Web3 from 'web3'
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import fetchNftContent from '/helpers/fetchNftContent'
import fetchManyNftContent from '/helpers/fetchManyNftContent'
import fetchNFTManyCollectionMeta from "/helpers/fetchNFTManyCollectionMeta"
import Web3ObjectToArray from '/helpers/Web3ObjectToArray'
import { NftIsApproved } from '/helpers/nftApproveUtils'


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

  
  const [ nftInfo, setNftInfo ] = useState({})
  const [ nftInfoFetched, setNftInfoFetched ] = useState(false)

  const [ tokensAtSale, setTokensAtSale ] = useState([])
  const [ tokensAtSaleFetching, setTokensAtSaleFetching ] = useState(true)
  const [ tokensAtSaleCount, setTokensAtSaleCount ] = useState(0)
  const [ tokensAtSaleOffset, setTokensAtSaleOffset ] = useState(0)
  const tokensAtSaleLimit = 4
  
  const [ marketInfo, setMarketInfo ] = useState({})
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)

  const [activeChainId, setActiveChainId] = useState(false)
  const [activeWeb3, setActiveWeb3] = useState(false)
  const [address, setAddress] = useState(false)

  const [airdropContract, setAirdropContract] = useState(false)

  const [isWalletConecting, setIsWalletConnecting] = useState(false)

  const [ currentLot, setCurrentLot ] = useState(false)
  const [ isApproving, setIsApproving ] = useState(false)

  const doApproveAndBuy = (lotIndex) => {
    addNotify(`Approving... Confirm transaction`)

    const {
      erc20,
      price,
    } = tokensAtSale[lotIndex]

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
        doBuyLot(lotIndex)
      },
      onError: (err) => {
        setIsApproving(false)
        addNotify(`Fail approve token. ${err.message ? err.message : ''}`, `error`)
      }
    })
  }

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
  
  const [ isRemoveFromTrade, setIsRemoveFromTrade ] = useState(false)
  
  const doRemoveFromTrade = (lotIndex) => {
    const {
      tokenId
    } = tokensAtSale[lotIndex]

    openConfirmWindow({
      title: `Remove lot from marketplace`,
      message: `Do you want remove NFT #${tokenId.toString()} from marketplace?`,
      onConfirm: () => {
        setIsRemoveFromTrade(true)
        addNotify(`Removing NFT from marketplace. Confirm transaction`)
        callMPMethod({
          activeWeb3,
          contractAddress: marketplaceContract,
          method: 'deSellNFT',
          args: [
            tokenId.toString()
          ],
          onTrx: (txHash) => {
            console.log('>> onTrx', txHash)
            addNotify(`Remove NFT from marketplace TX ${txHash}`, `success`)
          },
          onSuccess: (receipt) => {},
          onError: (err) => {
            console.log('>> onError', err)
            addNotify(`Fail remove NFT. ${err.message ? err.message : ''}`, `error`)
            setIsRemoveFromTrade(false)
          },
          onFinally: (answer) => {
            addNotify(`NFT successfull removed from marketplace`, `success`)
            setIsRemoveFromTrade(false)
            refreshTokensAtSale()
          }
        })
      }
    })
  }

  const [ isBuying, setIsBuying ] = useState(false)
  const doBuyLot = (lotIndex) => {
    openConfirmWindow({
      title: `Buying NFT`,
      message: `Do you want buy NFT #${tokensAtSale[lotIndex].tokenId.toString()}?`,
      onConfirm: () => {
        addNotify(`Buying NFT. Confirm transaction`)
        setIsBuying(true)
        callMPMethod({
          activeWeb3,
          contractAddress: marketplaceContract,
          method: tokensAtSale[lotIndex].erc20 == ZERO_ADDRESS ? 'buyNFT' : 'buyNFTbyERC20',
          ...(tokensAtSale[lotIndex].erc20 == ZERO_ADDRESS
            ? {
              weiAmount: tokensAtSale[lotIndex].price.toString()
            } : {}
          ),
          args: [
            tokensAtSale[lotIndex].tokenId.toString()
          ],
          onTrx: (txHash) => {
            console.log('>> onTrx', txHash)
            addNotify(`Buy NFT TX ${txHash}`, `success`)
          },
          onSuccess: (receipt) => {},
          onError: (err) => {
            console.log('>> onError', err)
            addNotify(`Fail buy NFT. ${err.message ? err.message : ''}`, `error`)
            setIsBuying(false)
          },
          onFinally: (answer) => {
            addNotify(`NFT success buyed`, `success`)
            setIsBuying(false)
            doSwitchTab(TABS.USER)
          }
        })
      }
    })
  }

  const [ userNfts, setUserNfts ] = useState([])
  const [ reloadUserNfts, setReloadUserNfts ] = useState(true)
  const [ isUserNftsFetching, setIsUserNftsFetching ] = useState(false)

  const doFetchUserNfts = () => {
    if (chainId && marketplaceContract && address) {
      setIsUserNftsFetching(true)
      fetchMarketInfo({
        address: marketplaceContract,
        chainId,
        userAddress: address,
      }).then((info) => {
        console.log(info)
        setUserNfts(Web3ObjectToArray(info.tokens))
        setIsUserNftsFetching(false)
        doFetchTokenUrls(Web3ObjectToArray(info.tokens).map((tokenInfo) => { return tokenInfo.tokenId }))
      })
    }
  }
  
  const [ otherUserNfts, setOtherUserNfts ] = useState([])
  const [ isOtherUserNftsFetching, setIsOtherUserNftsFetching ] = useState(false)
  
  const doFetchOtherUserNfts = () => {
    if (chainId && marketInfo && marketInfo.marketNft && address) {
      setIsOtherUserNftsFetching(true)
      fetchUserNfts({
        chainId,
        walletAddress: address,
        nftAddress: marketInfo.marketNft
      }).then((nfts) => {
        setOtherUserNfts(nfts)
        const userNftsUrls = {}
        nfts.forEach((info) => {
          userNftsUrls[info.tokenId] = info.tokenURI
        })
        setTokensUrls({
          ...tokensUrls,
          ...userNftsUrls
        })
        setIsOtherUserNftsFetching(false)
      }).catch((err) => {
        console.log('>>> fail fetch other user nfts', err)
        setIsOtherUserNftsFetching(false)
      })
    }
  }


  const [ isSellNft, setIsSellNft ] = useState(false)
  const [ sellNftInfo, setSellNftInfo ] = useState({})
  const doSellNft = (lotIndex) => {
    setSellNftInfo(otherUserNfts[lotIndex])
    setIsSellNft(true)
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


  const refreshTokensAtSale = () => {
    goToPage(tokensAtSaleOffset)
    doFetchUserNfts()
  }

  const initOnWeb3Ready = async () => {
    if (activeWeb3 && (`${activeChainId}` == `${chainId}`)) {
      window.tt = activeWeb3
      activeWeb3.eth.getAccounts().then((accounts) => {
        setAddress(accounts[0])

      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
        processError(err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      if (_isConnected) {
        connectWithMetamask()
      }
    }
  }

  const [ isNeedReload, setIsNeedReload ] = useState(false)
  const [ refreshIndex, setRefreshIndex ] = useState(0)
  useEffect(() => {
    if (isNeedReload) {
      setIsNeedReload(false)
      goToPage(0)
      doFetchUserNfts()
      doFetchOtherUserNfts()
    }
  }, [ isNeedReload ])
  
  useEffect(() => {
    onWalletChanged(async (newAccount) => {
      setAddress(newAccount)
      setIsNeedReload(true)
    })
  }, [])

  
  const goToPage = (offset) => {
    if (chainId && marketplaceContract) {
      setTokensAtSaleFetching(true)
      fetchMarketInfo({
        address: marketplaceContract,
        chainId,
        offset,
        limit: tokensAtSaleLimit,
        onlyTokens: true,
      }).then((info) => {
        setTokensAtSale(Web3ObjectToArray(info.tokensAtSale))
        setTokensAtSaleFetching(false)
        doFetchTokenUrls(Web3ObjectToArray(info.tokensAtSale))
      })
    }
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
        setTokensAtSale(Web3ObjectToArray(info.tokensAtSale))
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
      const chainInfo = CHAIN_INFO(chainId)
      if (chainInfo) {
        try {
          const web3 = new Web3(chainInfo.rpcUrls[0])
          setActiveWeb3(web3)
          fetchMarketInfo({
            address: marketplaceContract, 
            chainId,
            offset: tokensAtSaleOffset,
            limit: tokensAtSaleLimit
          }).then((_marketInfo) => {
            setMarketInfo(_marketInfo)
            
            setTokensAtSaleCount(_marketInfo.tokensAtSaleCount)
            setTokensAtSale(Web3ObjectToArray(_marketInfo.tokensAtSale))
            setTokensAtSaleFetching(false)
            setMarketInfoFetched(true)
            if (address) {
              doFetchOtherUserNfts()
            }
          }).catch((err) => {
            console.log('>>> fail fetch market info', err)
          })
        } catch (err) {
          console.log('>>> err', err)
        }
      }
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

  useEffect(() => {
    if (activeWeb3 && chainId && marketplaceContract) {
      initOnWeb3Ready()
    }
  }, [activeWeb3, chainId, marketplaceContract])


  const connectWithMetamask = async () => {
    doConnectWithMetamask({
      onBeforeConnect: () => { setIsWalletConnecting(true) },
      onSetActiveChain: setActiveChainId,
      onConnected: (cId, web3) => {
        setActiveWeb3(web3)
        setIsWalletConnecting(false)
      },
      onError: (err) => {
        console.log(">>>> connectWithMetamask", err)
        processError(err)
        setIsWalletConnecting(false)
      },
    })
  }

  const chainInfo = CHAIN_INFO(chainId)
  const nativeCurrency = chainInfo.nativeCurrency
  
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

  
  const onSwitchViewType = () => {
    setViewType((viewType == VIEW_TYPE.ASSETS) ? VIEW_TYPE.COLLECTIONS : VIEW_TYPE.ASSETS)
    const viewTypeLink = getLink('market', (viewType == VIEW_TYPE.ASSETS) ? `collections` : `assets`)
    router.push(viewTypeLink.replace('_MYAPP/',''))
  }
  
  useEffect(() => {
    console.log('view type change', viewType)
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
            console.log('>>> collectionsInfo', nftAddress, collectionsInfo[nftAddress])
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
            const collectionMeta = {
              name: collectionMetaJson?.name || collectionZeroJson?.name || collectionsInfo[nftAddress].symbol || `-`,
              description: collectionMetaJson?.description || collectionZeroJson.description || collectionsInfo[nftAddress].name || `-`,
              image: collectionMetaJson?.image || collectionZeroJson.image || false,
              totalSupply: collectionsInfo[nftAddress]?.totalSupply || 0,
            }
            
            setCollectionsMeta((newMeta) => {
              return {
                ...newMeta,
                [nftAddress]: collectionMeta,
              } 
            })
            
            console.log('>>> collectionMeta', collectionMeta)
            resolve(true)
          }) )
        })
      Promise.all(metaPromiseList).then((ready) => {
        console.log('>>> ready', ready)
      })
    }
  }, [ collectionsInfo ])
  
  useEffect(() => {
    if (needRefreshCollections && marketInfo && marketInfo.chainId) {
      setNeedRefreshCollections(false)
      fetchNFTManyCollectionInfo({
        addressList: Web3ObjectToArray(marketInfo.nftCollections),
        chainId: marketInfo.chainId
      }).then((answer) => {
        console.log('>> answer', answer)
        setCollectionsInfo({
          ...collectionsInfo,
          ...answer
        })
      }).catch((err) => {
        console.log('>> err', err)
      })
    }
  }, [ needRefreshCollections, marketInfo ])


  window.doTest = () => {
    fetchNFTManyCollectionMeta({
      addressList: Web3ObjectToArray(marketInfo.nftCollections),
      chainId: marketInfo.chainId
    }).then((answer) => {
      
      console.log('>>> answer', answer)
    }).catch((err) => {
      console.log('>>> err', err)
    })
  }
  return (
  <>
    <style jsx>
      {styles}
    </style>
    <div>
      <Header />
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
                    {tokensAtSale.map((tokenInfo, index) => {
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
                        />
                      )
                    })}
                  </>
                )}
              </>
            )}
            <article className="relative group overflow-hidden">
              <div className="w-[335px] h-[275px] overflow-hidden"></div>
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default Market;
