import { useEffect, useState } from 'react'
import { getAssets } from "/helpers/"


export default function ImgPrecache(options) {
  const {
    src,
    noLoader,
  } = options
  
  const [ imageCache, setImageCache ] = useState(false)
  const [ imageCached, setImageCached ] = useState(false)
  
  const [ progressStarted, setProgressStarted ] = useState(false)
  const [ progressLoad, setProgressLoad ] = useState(0)
  
  const bgLoadImage = (src) => {
    const xmlHTTP = new XMLHttpRequest()
    xmlHTTP.open('GET',  src, true)
    xmlHTTP.responseType = 'arraybuffer'
    xmlHTTP.onprogress = function(e) {
      setProgressLoad(Math.round((e.loaded / e.total) * 100))
    }
    xmlHTTP.send()
    setProgressStarted(true)
  }
  
  useEffect(() => {
    if (src) {
      bgLoadImage(src)
      const cache = new Image()
      cache.onloadprogress = function(e) { console.log('>>> ImgPrecache',  e.loaded / e.total ) };
      cache.onload = () => {
        setImageCached(true)
      }
      cache.src = src
      setImageCache(cache)
    }
  }, [ src ])

  const _cleanOptions = {}
  Object.keys(options).forEach((key) => {
    if (
      (key != 'noLoader')
      && (key != 'loadClass')
      && (key != 'loadStyle')
    ) _cleanOptions[key] = options[key]
  })

  return (
    <>
      {(imageCached) ? (
        <img loading="lazy" {..._cleanOptions} />
      ) : (
        <>
          {!noLoader && (
            <div className={(options.loadClass) ? options.loadName : ''} 
              style={{
                ...((options.loadStyle) ? options.loadStyle : {}),
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center'
              }}
            >
              <strong style={{
                  width: '100%',
                  display: 'block'
                }}
              >
                {progressLoad}{`%`}
              </strong>
            </div>
          )}
        </>
      )}
    </>
  )
}