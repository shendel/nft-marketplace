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
import fetchUserAuctions from "/helpers/fetchUserAuctions"
import fetchUserAuctionsBids from "/helpers/fetchUserAuctionsBids"

import fetchNFTManyCollectionInfo from "/helpers/fetchNFTManyCollectionInfo"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"

import callMPMethod from "/helpers/callMPMethod"
import { CHAIN_INFO, ZERO_ADDRESS } from "/helpers/constants"
import { toWei, fromWei } from "/helpers/wei"
import BigNumber from "bignumber.js"


import Web3 from 'web3'
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import fetchNftContent from '/helpers/fetchNftContent'
import fetchManyNftContent from '/helpers/fetchManyNftContent'
import fetchNFTManyCollectionMeta from "/helpers/fetchNFTManyCollectionMeta"
import Web3ObjectToArray from '/helpers/Web3ObjectToArray'

import useWeb3 from "/helpers/useWeb3"

const ProfilePage: NextPage = (props) => {
  const {
    storageData,
    storageData: {
      isBaseConfigReady,
    },
    isOwner,
  } = props
  
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
  

  const [ marketInfo, setMarketInfo ] = useState(false)
  const [ marketInfoFetched, setMarketInfoFetched ] = useState(false)

  useEffect(() => {
    if (chainId && marketplaceContract) {
      fetchMarketInfo({
        address: marketplaceContract, 
        chainId,
        onlyInfo: true,
        forAddress: connectedAddress,
      }).then((_marketInfo) => {
        setMarketInfo(_marketInfo)
        setBlockchainUtx(_marketInfo.timestamp)
        setMarketInfoFetched(true)
      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract, connectedAddress ])
  
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
  
  useEffect(() => {
    if (storageData
      && storageData.marketplaceChainId
      && storageData.marketplaceContract
    ) {
      setChainId(storageData.marketplaceChainId)
      setMarketplaceContract(storageData.marketplaceContract)
    }
  }, [storageData])

  const [ collectionsInfo, setCollectionsInfo ] = useState({})
  const [ collectionsMeta, setCollectionsMeta ] = useState({})

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
    if (marketInfo && marketInfo.chainId) {
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
  }, [ marketInfo ])

  const [ userAuctionsMetaUrls, setUserAuctionsMetaUrls ] = useState(false)
  const [ userAuctions, setUserAuctions ] = useState(false)
  const [ userAuctionsBids, setUserAuctionsBids ] = useState(false)
  const [ auctionHighBids, setAuctionHighBids ] = useState(false)
  const [ userAuctionsFetching, setUserAuctionsFetching ] = useState(false)
  const [ blockchainUtx, setBlockchainUtx ] = useState(false)
  
  useEffect(() => {
    if (connectedAddress) {
      setUserAuctionsMetaUrls(false)
      fetchUserAuctions({
        address: marketplaceContract,
        chainId,
        userAddress: connectedAddress
      }).then((answer) => {
        console.log('>>> User auctions', answer)
        setUserAuctions(answer.userOffers)
        setBlockchainUtx(answer.timestamp)
        const userOffersIds = answer.userOffers.map(({ offerId }) => { return offerId })
        console.log('>>>> User offers', userOffersIds)
        fetchUserAuctionsBids({
          address: marketplaceContract,
          chainId,
          userAddress: connectedAddress,
          offers: userOffersIds
        }).then(({ bids, high }) => {
          setAuctionHighBids(high)
          setUserAuctionsBids(bids)
        }).catch((err) => {
          console.log('>>> Fail fetch user bids', err)
        })
        const tokensInfo = answer.userOffers.map(({ collection, tokenId }) => {
          return {
            address: collection,
            tokenId
          }
        })
        console.log('>>> tokensInfo', tokensInfo)
        
        fetchManyNftContent({
          chainId,
          tokensInfo,
        }).then((tokensInfo) => {
          setUserAuctionsMetaUrls(tokensInfo)
        }).catch((err) => {
          console.log('>>>> fail fetch tokens urls', err)
        })
      }).catch((err) => {
        console.log('fail fetch user auctions', err)
      })
    } else {
      setUserAuctions(false)
      setUserAuctionsMetaUrls(false)
    }
  }, [ connectedAddress ])
  
  return (
  <>
    <style jsx>
      {styles}
    </style>
    <div>
      <Header {...props} />
      <div className="pt-10 md:pt-12 lg:pt-16 xl:pt-20 m flex flex-col items-center w-full">
        <div className="flex flex-col items-center md:items-start">
          {!connectedAddress && (
            <>
              <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
                Your listed NFTs
              </h2>
              <p className="text-center mt-10 lg:mt-12 opacity-80 text-lg md:text-left text-red-400 w-3/4">
                {`Please connect your wallet`}
              </p>
              <section className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
                <article className="relative group overflow-hidden">
                  <div className="w-[335px] h-[275px] overflow-hidden"></div>
                </article>
              </section>
            </>
          )}
          {connectedAddress && (
            <>
              <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
                Your auctions
              </h2>
              {(userAuctions && userAuctions.length > 0) ? (
                <div style={{ marginTop: '1rem', marginBottom: '2rem' }} className="mt-20 md:mt-24 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
                  {userAuctions.map((tokenInfo, index) => {
                    const { tokenId, collection, offerId, seller } = tokenInfo
                    const mediaUrl = userAuctionsMetaUrls[`${collection}_${tokenId}`]?.tokenURI || false
                    let wonCollect = false
                    let loseCollect = false
                    let isWinner = true
                    if (auctionHighBids
                      && auctionHighBids[offerId]
                      && auctionHighBids[offerId].toLowerCase() == connectedAddress.toLowerCase()
                      && userAuctionsBids
                      && userAuctionsBids[offerId]
                      && userAuctionsBids[offerId] != "0"
                    ) wonCollect = true
                    if (auctionHighBids
                      && auctionHighBids[offerId]
                      && auctionHighBids[offerId].toLowerCase() != connectedAddress.toLowerCase()
                      && userAuctionsBids
                      && userAuctionsBids[offerId]
                      && userAuctionsBids[offerId] != "0"
                    ) loseCollect = true
                    if (auctionHighBids
                      && auctionHighBids[offerId]
                      && auctionHighBids[offerId].toLowerCase() == connectedAddress.toLowerCase()
                    ) isWinner = true
                    return (
                      <div key={index}>
                        <NftCard 
                          mediaUrl={mediaUrl}
                          collection={collection}
                          tokenId={tokenId}
                          tokenInfo={tokenInfo}
                          chainId={chainId}
                          isDeList={(connectedAddress.toLowerCase() == seller.toLowerCase())}
                          userAddress={connectedAddress}
                          blockchainUtx={blockchainUtx}
                          wonCollect={wonCollect}
                          loseCollect={loseCollect}
                          isWinner={isWinner}
                          allowedERC20Info={allowedERC20Info}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-[14px] lg:mt-6 text-xl opacity-80" style={{ paddingBottom: '2rem' }}>
                  {`You have no active or completed auctions.`}
                </p>
              )}
              <h2 className="font-GoodTimes tracking-wide flex items-center text-3xl lg:text-4xl bg-clip-text text-transparent bg-gradient-to-br from-moon-gold to-indigo-100">
                Your listed NFTs
              </h2>
              <p className="mt-[14px] lg:mt-6 text-xl opacity-80">
                {`Pick from a collection`}
              </p>
              <section className="mt-10 md:mt-16 flex flex-col gap-10 md:grid md:grid-cols-2 md:grid-flow-row md:gap-12 xl:grid-cols-3 xl:gap-14">
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
                          userListedCount={marketInfo.userCollectionListed ? marketInfo.userCollectionListed[nftAddress] : 0}
                          isMy={true}
                        />
                      )
                    })}
                  </>
                )}
                <article className="relative group overflow-hidden">
                  <div className="w-[335px] h-[275px] overflow-hidden"></div>
                </article>
              </section>
            </>
          )}
        </div>
      </div>
      <Footer {...props} />
    </div>
    </>
  );
};

export default ProfilePage;
