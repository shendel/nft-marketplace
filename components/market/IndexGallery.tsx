import { useEffect, useState } from "react"
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import Web3ObjectToArray from "/helpers/Web3ObjectToArray"
import fetchManyNftContent from "/helpers/fetchManyNftContent"
import { getAssets } from "/helpers/"
import NftMediaImage from "/components/market/NftMediaImage"

export default function IndexGallery(options) {
  const {
    chainId,
    marketplaceContract,
  } = options
  
  const [ marketTokens, setMarketTokens ] = useState([])
  
  useEffect(() => {
    if (chainId && marketplaceContract) {
      fetchMarketInfo({
        address: marketplaceContract,
        chainId,
        onlyTokens: true,
      }).then((info) => {
        setMarketTokens(Web3ObjectToArray(info.tokensAtSale).slice(0,4))
      })
    }
  }, [chainId, marketplaceContract])
  
  const [ tokensUrls, setTokensUrls ] = useState({})
  useEffect(() => {
    if (marketTokens && marketTokens.length) {
      const fetchArgs = {
        chainId,
        tokensInfo: marketTokens.map((tokenInfo) => {
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
  }, [ marketTokens ])
  const items = [
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/9.png',
      title: 'item 1'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/10.png',
      title: 'item 2'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/11.png',
      title: 'item 3'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/12.png',
      title: 'item 4'
    },
  ]
  
  const [ activeItemIndex, setActiveItemIndex ] = useState(0)
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newIndex = activeItemIndex+1
      setActiveItemIndex((newIndex < items.length) ? newIndex : 0)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [activeItemIndex])
  
  const doSetIndex = (index) => {
    setActiveItemIndex(index)
  }
  
  return (
    <div className="flex flex-col items-center relative md:-mt-32 xl:-mt-16 2xl:-mt-0">
      {marketTokens && marketTokens.length > 0 && (
        <>
          {marketTokens.map((tokenInfo, index) => {
            return (
              <div key={index} style={{
                display: (index == activeItemIndex) ? 'block' : 'none'
              }}>
                {(tokensUrls[marketTokens[index].collection] && tokensUrls[marketTokens[index].collection][marketTokens[index].tokenId]) ? (
                  <a href={items[index].href}>
                    <NftMediaImage
                      url={tokensUrls[marketTokens[index].collection][marketTokens[index].tokenId]}
                      className="w-[290px] hover:ring xl:hover:ring-4 ring-moon-orange transition-all duration-300 h-[362px] lg:h-[443.38px] xl:h-[499.58px] 2xl:h-[564px]  object-cover lg:w-[355px] xl:w-[400px] 2xl:w-[536px]  rounded-tl-[99px] rounded-br-[99px]"
                      width="290"
                      height="362"
                    />
                  </a>
                ) : (
                  <a href={items[index].href}>
                    <div className="w-[290px] hover:ring xl:hover:ring-4 ring-moon-orange transition-all duration-300 h-[362px] lg:h-[443.38px] xl:h-[499.58px] 2xl:h-[564px]  object-cover lg:w-[355px] xl:w-[400px] 2xl:w-[536px]  rounded-tl-[99px] rounded-br-[99px]"
                      style={{
                        background: '#000000',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={getAssets('images/index-gallery-loader.svg', 'IndexGalleryLoader')} 
                        style={{
                          width: '50%',
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          marginTop: '-25%',
                          marginLeft: '-25%',
                        }}
                      />
                    </div>
                  </a>
                )}
              </div>
            )
          })}
          <div className="mt-8 flex gap-5 lg:ml-12 lg:mt-6">
            {items.map((item, index) => {
              return (
                <button key={index} className={`${(index == activeItemIndex) ? 'bg-moon-secondary' : 'bg-white bg-opacity-20'} transition-all duration-150 w-11 lg:w-8 2xl:w-11 h-1 xl:h-[6px] rounded`}
                  onClick={() => { doSetIndex(index) }}
                ></button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}