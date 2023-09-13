import { useEffect, useState } from 'react'
import  fetch from "node-fetch"
import { ipfsUrl } from "/helpers/ipfsUrl"
import { mediaCacheAdd, mediaCacheGet } from "/helpers/mediaCache"

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
      {isFetched && jsonData && jsonData.image && jsonUrl && (
        <img src={jsonUrl} onLoad={onLoaded} loading="lazy" {...options} />
      )}
    </>
  )
}