import { getLink } from "/helpers/getLink"

export default function CollectionCard(options) {
  const {
    isLoading,
    address,
    collectionInfo,
    collectionMeta,
    isSell,
  } = {
    isLoading: false,
    collectionInfo: false,
    collectionMeta: false,
    isSell: false,
    ...options
  }
  if (isLoading) {
    return (
      <>
        <div className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"
          style={{
            width: '335px',
            height: '262px',
            borderRadius: 'inherit',
          }}
        ></div>
      </>
    )
  }
  
  const info = {
    ...(collectionInfo ? collectionInfo : {}),
    ...(collectionMeta ? collectionMeta : {})
  }
  return (
    <>
      <article className="relative flex flex-col group items-center hover:scale-[1.035] group transition-all duration-150">
        <a
          className="flex flex-col group items-center"
          href={getLink('collection', `${address}${(isSell) ? '/sell' : ''}`)}
        >
          {info && info.image ? (
            <div
              className="rounded-t-[6px] rounded-b-[15px]"
              style={{
                background: '#090013',
                position: 'relative',
                width: '275px',
                height: '275px',
              }}
            >
              <div className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] rounded-t-[6px] rounded-b-[15px] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"
                style={{
                  width: '275px',
                  height: '270px',
                  borderRadius: 'inherit',
                  position: 'absolute',
                }}
              ></div>
              <img
                src={info.image}
                alt={info && info.name ? `${info.name} thumbnail` : `...`}
                className="z-10 w-[300px] h-[235px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
                style={{
                  objectFit: 'contain',
                  width: '275px',
                  height: '275px',
                  position: 'relative'
                }}
              />
            </div>
          ) : (
            <div className="z-10 w-[300px] h-[275px] object-cover rounded-t-[6px] rounded-b-[15px] group-hover:ring ring-indigo-200"
              style={{
                border: '2px solid #FFFFFF',
                background: '#090013',
                lineHeight: `275px`,
                textAlign: `center`,
                verticalAlign: `middle`
              }}
            >
              <span>
                {(info && info.symbol) ? (
                  <>{info.symbol}</>
                ) : (
                  <>{`Loading...`}</>
                )}
              </span>
            </div>
          )}
          <div className="-mt-3 border  bg-gradient-to-br from-black via-slate-900 to-black border-yellow-200 group-hover:border-moon-gold shadow shadow-moon-white w-[300px] lg:w-[350px] h-[100px] flex flex-col items-center text-center rounded-md">
            <h6 className="mt-7 tracking-widest text-indigo-100 group-hover:text-white max-w-[250px] lg:max-w-[320px] text-center truncate">
              {(info && info.name) ? (
                <>{info.name}</>
              ) : (
                <>{`...`}</>
              )}
            </h6>
            <p className="mt-[7px] text-sm flex items-center">
              {/*
              <span className="opacity-60">Floor</span>
              <span className="ml-[14px] flex items-center gap-[6px]">
                29000
              </span>
              */}
            </p>
          </div>
        </a>
      </article>
    </>
  )
}