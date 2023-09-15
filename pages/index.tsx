import type { NextPage } from "next"
import { useRouter } from "next/router"

import styles from "/styles/market.js"
import Header from "/components/market/Header"
import Footer from "/components/market/Footer"

import useStorage from "../storage/"
import { getLink } from "/helpers/getLink"
import { useEffect, useState } from "react"
import fetchNFTCollectionAllTokens from "/helpers/fetchNFTCollectionAllTokens"

import IndexGallery from "/components/market/IndexGallery"


const Home: NextPage = (props) => {
  const {
    storageData,
    storageData: {
      isBaseConfigReady,
    },
    isOwner,
    getText
  } = props
  const router = useRouter()
  
  const [ chainId, setChainId ] = useState(storageData?.marketplaceChainId)
  const [ marketplaceContract, setMarketplaceContract ] = useState(storageData?.marketplaceContract)

  

  return (
    <>
      <style jsx>
        {styles}
      </style>
      <div>
        <Header {...props} />
        <main className="flex flex-col items-center px-6 md:px-10">
          <div 
            className="mt-10 flex flex-col items-center pb-12 md:flex-row-reverse md:py-10 lg:pt-12 md:gap-12 xl:gap-28 2xl:gap-40"
          >
            <IndexGallery chainId={chainId} marketplaceContract={marketplaceContract} />
            <div className="md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[700px] relative mt-16 text-center z-10 md:text-left flex flex-col items-center md:mt-2 md:items-start lg:mt-10">
              <div className="absolute overflow-hidden hidden lg:block -z-50 lg:left-[calc(-90%-30rem)] xl:left-[calc(-40%-30rem)] lg:top-[calc(50%-30rem)] 2xl:left-[calc(-5%-30rem)] 2xl:top-[calc(50%-30rem)] transform-gpu blur-[85px] " aria-hidden="true">
                <div 
                  className="relative aspect-[1400/678] rotate-[30deg] bg-gradient-to-tr from-moon-secondary to-orange-600 opacity-[0.15] w-[82.1875rem]"
                  style={{
                    clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                ></div>
              </div>
              <h1 className="text-white font-GoodTimes text-[34px] md:text-4xl md:tracking-wide md:leading-relaxed lg:text-5xl xl:text-6xl 2xl:text-7xl">
                {getText('MainPage_Title', 'Title')}
              </h1>
              <p className="mt-8 md:mt-6 2xl:mt-[26px] lg:mt-7 text-sm leading-6 px-3 md:px-0 text-moon-orange text-md md:text-left lg:text-base xl:text-lg max-w-sm lg:max-w-md xl:max-w-[600px] 2xl:max-w-[658px]">
                {getText('MainPage_Desc', 'Marketplace description')}
              </p>
              <a href={getLink(`buy`)}>
                <button className="mt-12 lg:mt-10 2xl:mt-[50px] font-mono flex text-gray-100 hover:bg-gradient-to-b from-yellow-600  to-moon-secondary hover:text-white duration-150 items-center gap-2 border-[0.6px] hover:border-yellow-600 rounded border-white border-opacity-50 py-3 pl-6 pr-6 font-bold">
                  Explore assets
                </button>
              </a>
              <a href={getLink('buy', 'collections')}>
                <button className="mt-12 lg:mt-10 2xl:mt-[50px] font-mono flex text-gray-100 hover:bg-gradient-to-b from-yellow-600  to-moon-secondary hover:text-white duration-150 items-center gap-2 border-[0.6px] hover:border-yellow-600 rounded border-white border-opacity-50 py-3 pl-6 pr-6 font-bold">
                  Explore collections
                </button>
              </a>
              {/*
              <div className="w-1/2 py-4 mt-8">
                <div>
                  <button className="bridge-button">Polygon Mainnet Bridge</button>
                  <h1 className="text-center md:text-left text-[80%] opacity-70 leading-6 pr-2 pt-3">The marketplace uses L2 MOONEY, use the bridge to transfer L1 MOONEY (Mainnet) to L2 (Polygon Mainnet) <a className="ml-2 font-bold text-moon-gold" href="https://market.moondao.com/bridge">Learn more →</a>
                  </h1>
                </div>
              </div>
              */}
            </div>
          </div>
        </main>
        <Footer {...props} />
      </div>
    </>
  );
};

export default Home;
