import { useEffect, useState } from 'react'
import  fetch from "node-fetch"
import { ipfsUrl } from "/helpers/ipfsUrl"
import { mediaCacheAdd, mediaCacheGet } from "/helpers/mediaCache"
import { getAssets } from "/helpers/"


export default function NftMediaImage(options) {
  const {
    url,
  } = options

  const [ isFetched, setIsFetched ] = useState(false)
  const [ isFetching, setIsFetching ] = useState(true)
  const [ isImageUrl, setIsImageUrl ] = useState(false)
  const [ isError, setIsError ] = useState(false)
  const [ jsonData, setJsonData ] = useState({})
  
  const [ jsonUrl, setJsonUrl ] = useState(false)
  
  const [ imageCache, setImageCache ] = useState(false)
  const [ imageCached, setImageCached ] = useState(false)
  
  const [ progressStarted, setProgressStarted ] = useState(false)
  const [ loadProgress, setLoadProgress ] = useState(0)
  const bgLoadImage = (src) => {
    const xmlHTTP = new XMLHttpRequest()
    xmlHTTP.open('GET',  src, true)
    xmlHTTP.responseType = 'arraybuffer'
    xmlHTTP.onload = (e) => {}
    xmlHTTP.onprogress = function(e) {
      setLoadProgress(Math.round((e.loaded / e.total) * 100))
    }
    xmlHTTP.send()
    setProgressStarted(true)
  }
  
  useEffect(() => {
    if (jsonUrl) {
      const cache = new Image()
      bgLoadImage(jsonUrl)
      cache.onload = () => {
        setImageCached(true)
      }
      cache.src = jsonUrl
      setImageCache(cache)
    }
  }, [ jsonUrl ])

  useState(() => {
    if (url) {
      fetch(ipfsUrl(url))
        .then((res) => {
          
          const contentType = res.headers.get('content-type')
          if (contentType.startsWith(`image/`)) {
            return `IMAGE`
          }
          return res.text()
        })
        .then((text) => {
          if (text == `IMAGE`) return `IMAGE`
          try {
            // UTF-8 BOM
            return JSON.parse(text.slice(1))
          } catch (e) {
            try {
              return JSON.parse(text)
            } catch (e) {
              return `FAIL_PARSE`
            }
          }
        })
        .then((json) => {
          setIsFetched(true)
          setIsFetching(false)
          if (json !== `FAIL_PARSE` && json !== `IMAGE`) {
         
            setJsonData(json)
          } else {
            if (json === `IMAGE`) {
              setIsImageUrl(true)
            } else {
              setIsError(true)
            }
          }
        })
        .catch((err) => {
          console.log('fail fetch', err)
        })
    }
  }, [url])

  useEffect(() => {
    if (jsonData && jsonData.image) {
      setJsonUrl(ipfsUrl(jsonData.image))
    }
  }, [ jsonData ])
  const [ isLoadedMedia, setIsLoadedMedia ] = useState(false)
  const onLoaded = () => {
    setIsLoadedMedia(true)
  }

  return (
    <>
      {isFetched && jsonData && jsonData.image && jsonUrl && imageCached ? (
        <img src={jsonUrl} onLoad={onLoaded} loading="lazy" {...options} />
      ) : (
        <div
          {...options}
          style={{
            background: '#000000',
            position: 'relative',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
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
          {progressStarted && (
            <strong
              style={{
                width: '100%'
              }}
            >
              {loadProgress}{`%`}
            </strong>
          )}
        </div>
      )}
    </>
  )
}