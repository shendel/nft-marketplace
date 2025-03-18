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


import Web3 from 'web3'
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import fetchNftContent from '/helpers/fetchNftContent'
import fetchManyNftContent from '/helpers/fetchManyNftContent'
import fetchNFTManyCollectionMeta from "/helpers/fetchNFTManyCollectionMeta"
import Web3ObjectToArray from '/helpers/Web3ObjectToArray'

import useWeb3 from "/helpers/useWeb3"

const SellPage: NextPage = (props) => {
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
        setMarketInfoFetched(true)
      }).catch((err) => {
        console.log('>>> fail fetch market info', err)
      })
    }
  }, [ chainId, marketplaceContract, connectedAddress ])
  
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
        chainId: marketInfo.chainId,
        forAddress: connectedAddress
      }).then((answer) => {
        setCollectionsInfo({
          ...collectionsInfo,
          ...answer
        })
      }).catch((err) => {
        console.log('>> err', err)
      })
    }
  }, [ marketInfo, connectedAddress])

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
            Sell NFTs
          </h2>
          {!connectedAddress && (
            <>
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
                          isSell={true}
                          notListedCount={collectionsInfo[nftAddress]?.balance || false}
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

export default SellPage;
