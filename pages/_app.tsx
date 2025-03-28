import type { AppProps } from "next/app"
import Head from 'next/head'
//import "../styles/globals.css"
import globalStyles from "/styles/globals.js"
//import "/styles/market-index.css"
import styles from "../styles/Home.module.css"
import { getStorageText, getLink } from "../helpers"
import { getStorageDesign } from "../helpers/getDesign"
import useStorage from "../storage/"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { getUnixTimestamp } from "../helpers/getUnixTimestamp"

import NotifyHolder from "../components/NotifyHolder"
import StorageStyles from "../components/StorageStyles"
import { useRef } from "react"

import { getAssets } from "/helpers/"


const fontGoodTimes = getAssets('fonts/goodtimes.otf', 'fontGoodTimes')
const fontRobotoMono = getAssets('fonts/RobotoMono.ttf', 'fontRobotoMono')

let confirmWindowOnConfirm = () => {}
let confirmWindowOnCancel = () => {}
const defaultConfirmWindowLabels = {
  title: `Message`,
  message: `Confirm`,
  ok: `Ok`,
  cancel: `Cancel`,
} 

function MyApp({ Component, pageProps }: AppProps) {
  const {
    storageData,
    storageIsLoading,
    isOwner,
    setDoReloadStorage,
    storageTexts,
    storageDesign,
    storageMenu,
    storageFooterMenu,
  } = useStorage()
  //const storageDesign = storageData?.exdata?.design || {}
  //const storageTexts = storageData?.exdata?.texts || {}
  const router = useRouter()
console.log(storageData)
  const urlExt = (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') ? `` : `.html`


  const routerBaseName = router.asPath.split('/').reverse()[0].split('?')[0];

  const iframeHideMenu = router.asPath.indexOf('isSettingsFrame=true') !== -1

  const isSettingsPage = (routerBaseName === `settings${urlExt}`)
  const isMarketPage = (routerBaseName === `marketplace${urlExt}`)
  const isMintPage = (routerBaseName === `mint${urlExt}`)
  const isMintOwnPage = (routerBaseName === `mintown${urlExt}`)
  const isHomePage = (routerBaseName === `index${urlExt}`) || (routerBaseName === ``)


  /* Confirm window */
  const [ isConfirmWindowOpened, setIsConfirmWindowOpened ] = useState(false)
  const [ confirmWindowLabels, setConfirmWindowLabels ] = useState(defaultConfirmWindowLabels)
  const [ isConfirmWindowOk, setIsConfirmWindowOk ] = useState(false)


  const onConfirmWindowConfirm = () => {
    setIsConfirmWindowOpened(false)
    confirmWindowOnConfirm()
  }
  const onConfirmWindowCancel = () => {
    setIsConfirmWindowOpened(false)
    confirmWindowOnCancel()
  }
  const openConfirmWindow = (options = {}) => {
    const {
      onConfirm,
      onCancel,
    } = options

    console.log(options)
    confirmWindowOnConfirm = (onConfirm) ? onConfirm : () => {}
    confirmWindowOnCancel = (onCancel) ? onCancel : () => {}
    setIsConfirmWindowOk(options.isOk)
    setConfirmWindowLabels({
      title: options.title || defaultConfirmWindowLabels.title,
      message: options.message || defaultConfirmWindowLabels.message,
      ok: options.okLabel || defaultConfirmWindowLabels.ok,
      cancel: options.cancelLabel || defaultConfirmWindowLabels.cancel,
    })
    setIsConfirmWindowOpened(true)
  
  }
  /* -------------- */
  const notifyHolder = new NotifyHolder({})
  const addNotify = (msg, style = `info`) => {
    notifyHolder.addItem({
      msg,
      style,
      time: getUnixTimestamp(),
      utx: getUnixTimestamp(),
    })
  }

  
  let _lsPreviewTextsMode = false
  
  const [ usedTexts, setUsedText ] = useState(storageTexts)
  const [ previewTextsUtx, setPreviewTextsUtx ] = useState(0)
  useEffect(() => {
    const _lsPreviewTextsMode = localStorage.getItem(`-nft-stake-preview-text-mode`)
    const _lsPreviewTexts = localStorage.getItem(`-nft-stake-preview-texts`)
    const _lsPreviewUtx = localStorage.getItem(`-nft-stake-preview-texts-utx`)
    setPreviewTextsUtx(_lsPreviewUtx || 0)
    if (_lsPreviewTextsMode) {
      try {
        const parsedTexts = JSON.parse(_lsPreviewTexts)
        setUsedText({
          ...storageTexts,
          ...parsedTexts
        })
      } catch (e) {}
    } else {
      setUsedText(storageTexts)
    }
  }, [ storageTexts, previewTextsUtx ])

  const getText = getStorageText(usedTexts)

  const [ usedDesign , setUsedDesign ] = useState(storageDesign)
  const [ previewDesignUtx, setPreviewDesignUtx ] = useState(0)

  useEffect(() => {
    const _updateTimer = window.setInterval(() => {
      const _lsPreviewUtx = localStorage.getItem(`-nft-stake-preview-texts-utx`)
      setPreviewTextsUtx(_lsPreviewUtx || 0)
    }, 3000)
    
    return () => {
      window.clearInterval(_updateTimer)
    }
  }, [])
  
  useEffect(() => {
    const _lsPreviewMode = localStorage.getItem(`-nft-stake-preview-mode`)
    const _lsPreviewDesign = localStorage.getItem(`-nft-stake-preview-design`)
    const _lsPreviewUtx = localStorage.getItem(`-nft-stake-preview-utx`)
    setPreviewDesignUtx(_lsPreviewUtx || 0)
    if (_lsPreviewMode) {
      try {
        const parsedDesign = JSON.parse(_lsPreviewDesign)
        setUsedDesign({
          ...storageDesign,
          ...parsedDesign
        })
      } catch (e) {}
    } else {
      setUsedDesign(storageDesign)
    }
  }, [ storageDesign, previewDesignUtx ])
  
  useEffect(() => {
    const _updateTimer = window.setInterval(() => {
      const _lsPreviewUtx = localStorage.getItem(`-nft-stake-preview-utx`)
      setPreviewDesignUtx(_lsPreviewUtx || 0)
    }, 3000)
    
    return () => {
      window.clearInterval(_updateTimer)
    }
  }, [])

  let showNeedConfig = false
  
  if (storageData && !storageData.isBaseConfigReady && storageData.isInstalled && !isSettingsPage) showNeedConfig = true
  if (storageData && !storageData.isBaseConfigReady && storageData.isNFTConfigReady && storageData.isInstalled
    && (isMarketPage || isMintPage || isHomePage || isMintOwnPage)
  ) showNeedConfig = false
  
  const getDesign = getStorageDesign(usedDesign)

  return (
    <div>
      <Head>
        <title>{getText(`App_Title`, `NFTs Marketplace`)}</title>
        <meta name="description" content={getText(`App_Description`, `NFTs Marketplace`)} />
        <meta name="keywords" content={getText(`App_Keywords`, `NFTs Marketplace`)} />
        <style global>
          {`
            .svg-inline--fa {
              display: var(inline-block);
              height: 1em;
              overflow: visible;
              vertical-align: -0.125em;
            }
            svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
              overflow: visible;
              box-sizing: content-box;
            }

            .someOwnClass {
              background: red;
            }
            @font-face {
              font-family: Good Times;
              src: url(${fontGoodTimes}) format("opentype")
            }

            @font-face {
              font-family: Roboto Mono;
              src: url(${fontRobotoMono})
            }

          `}
        </style>
      </Head>
      {(storageIsLoading || (storageData === null)) ? (
        <>
          <style jsx>
            {`
              .loader {
                position: absolute;
                left: 0px;
                top: 0px;
                bottom: 0px;
                right: 0px;
                background: #090013;
              }
              .loader IMG {
                display: block;
                width: 6em;
                position: absolute;
                left: 50%;
                top: 50%;
                margin-top: -3em;
                margin-left: -3em;
              }
            `}
          </style>
          <div className="loader">
            <img src={getAssets('images/loader.svg', 'loader')} />
          </div>
        </>
      ) : (
        <>
          {!storageIsLoading && storageData && !storageData.isInstalled && !isSettingsPage ? (
            <div className={styles.container}>
              <h2>NFTs Marketplace need install on this domain</h2>
              <a href={getLink(`settings`)} className={`${styles.mainButton} ${styles.autoWidth} primaryButton`}>
                Go to Install
              </a>
            </div>
          ) : (
            <>
              {showNeedConfig ? (
                <div className={styles.container}>
                  <h2>NFTs Marketplace need base setup</h2>
                  <a href={getLink(`settings`)} className={`${styles.mainButton} ${styles.autoWidth} primaryButton`}>
                    Go to setup
                  </a>
                </div>
              ) : (
                <>
                  {isSettingsPage && (
                    <style jsx>
                      {globalStyles}
                    </style>
                  )}
                  {/*
                  {!isSettingsPage && (
                    <StorageStyles getDesign={getDesign} />
                  )}
                  */}
                  <Component
                    {...pageProps }
                    storageData={storageData}
                    storageIsLoading={storageIsLoading}
                    openConfirmWindow={openConfirmWindow}
                    isOwner={isOwner}
                    addNotify={addNotify}
                    setDoReloadStorage={setDoReloadStorage}
                    storageTexts={storageTexts}
                    storageDesign={storageDesign}
                    storageMenu={storageMenu}
                    storageFooterMenu={storageFooterMenu}
                    getText={getText}
                    getDesign={getDesign}
                    isInstalled={storageData?.isInstalled}
                    iframeHideMenu={iframeHideMenu}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
      {isSettingsPage && (
        <>
          {notifyHolder.render()}
          {/* ---- Confirm block ---- */}
          {isConfirmWindowOpened && (
            <div className={styles.confirmWindow}>
              <div>
                <h3>{confirmWindowLabels.title}</h3>
                <span>{confirmWindowLabels.message}</span>
                <div>
                  <button className={`${styles.mainButton} primaryButton`} onClick={onConfirmWindowConfirm}>
                    {confirmWindowLabels.ok}
                  </button>
                  {!isConfirmWindowOk && (
                    <button className={`${styles.mainButton} primaryButton`} onClick={onConfirmWindowCancel}>
                      {confirmWindowLabels.cancel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyApp;
