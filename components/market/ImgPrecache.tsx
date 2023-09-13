import { useEffect, useState } from 'react'
import { getAssets } from "/helpers/"


export default function ImgPrecache(options) {
  const {
    src,
    noLoader,
  } = options
  
  const [ imageCache, setImageCache ] = useState(false)
  const [ imageCached, setImageCached ] = useState(false)
  
  useEffect(() => {
    if (src) {
      const cache = new Image()
      
      cache.onload = () => {
        setImageCached(true)
      }
      cache.src = src
      setImageCache(cache)
    }
  }, [ src ])


  return (
    <>
      {imageCached ? (
        <img loading="lazy" {...options} />
      ) : (
        <>
          {!noLoader && (
            <div
              {...options}
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
          )}
        </>
      )}
    </>
  )
}