import type { NextPage } from "next"
import styles from "../styles/Home.module.css"
import navBlock from "../components/navBlock"

import TabDesign from "../components/settings/TabDesign"
import TabTexts from "../components/settings/TabTexts"
import TabMenu from "../components/settings/TabMenu"
import TabFooterMenu from "../components/settings/TabFooterMenu"
import TabMarketplace from "../components/settings/TabMarketplace"

import useStorage from "../storage/"
import { useEffect, useState } from "react"
import {
  setupWeb3,
  switchOrAddChain,
  doConnectWithMetamask,
  isMetamaskConnected,
  getCurrentChainId,
  getActiveChainId,
  onBlockchainChanged,
} from "../helpers/setupWeb3"
import { calcSendArgWithFee } from "../helpers/calcSendArgWithFee"

import { getStorageInfo } from "../storage"
import saveExStorageData from "../storage/saveExStorageData"

import STORAGE_JSON from "../contracts/Storage.json"
import { getCurrentDomain } from "../helpers/getCurrentDomain"
import { getUnixTimestamp } from "../helpers/getUnixTimestamp"
import delay from "../helpers/delay"
import { toWei, fromWei } from "../helpers/wei"
import openInTab from "../components/openInTab"
import SwitchNetworkAndCall from "../components/SwitchNetworkAndCall"


import {
  AVAILABLE_NETWORKS_INFO,
  CHAIN_INFO,
  CHAIN_EXPLORER_LINK
} from "../helpers/constants"

/*
const storageChainId = 5
const storageAddress = '0xafb8f27df1f629432a47214b4e1674cbcbdb02df'
*/
const settingsTabs = {
  marketplace: `Marketplace`,
  mainmenu: `Menu Items`,
  footermenu: 'Footer menu',
  texts: `Edit texts`,
  design: `Design`,
}

const debugLog = (msg) => { console.log(msg) }

const CHAINS_LIST = (() => {
  const ret = Object.keys(AVAILABLE_NETWORKS_INFO).map((k) => {
    return {
      id: AVAILABLE_NETWORKS_INFO[k].networkVersion,
      title: AVAILABLE_NETWORKS_INFO[k].chainName,
    }
  })
  ret.unshift({
    id: 0,
    title: `Select Blockchain`,
  })
  return ret
})()

const Settings: NextPage = (props) => {
  const {
    storageChainId,
    storageAddress
  } = getStorageInfo()

  const {
    storageData,
    storageIsLoading,
    isOwner,
    openConfirmWindow,
    addNotify,
    setDoReloadStorage,
    storageTexts,
    storageDesign,
    storageMenu,
    storageFooterMenu,
    iframeHideMenu,
  } = props

  const [activeChainId, setActiveChainId] = useState(false)
  const [activeWeb3, setActiveWeb3] = useState(false)
  const [address, setAddress] = useState(false)
  const [isWalletConecting, setIsWalletConnecting] = useState(false)

  const processError = (error, error_namespace) => {
    let metamaskError = false
    try {
      metamaskError = error.message.replace(`Internal JSON-RPC error.`,``)
      metamaskError = JSON.parse(metamaskError)
    } catch (e) {}
    const errMsg = (metamaskError && metamaskError.message) ? metamaskError.message : error.message
    
    switch (errMsg) {
      case `execution reverted: You don't own this token!`:
        console.log(`You dont own this token`)
        break;
      case `MetaMask Tx Signature: User denied transaction signature.`:
        console.log('Transaction denied')
        break;
      case `execution reverted: ERC721: invalid token ID`:
        console.log('Invalid token ID')
        break;
      default:
        console.log('Unkrnown error', error.message)
        break;
    }
  }

  const onNetworkChanged = (newActiveChainId) => {
    console.log('>>> newActiveChainId', newActiveChainId)
    setActiveChainId(newActiveChainId)
  }

  const initOnWeb3Ready = async () => {
    if (activeWeb3 && (`${activeChainId}` == `${storageChainId}`)) {
      activeWeb3.eth.getAccounts().then((accounts) => {
        setAddress(accounts[0])
        const _storageContract = new activeWeb3.eth.Contract(STORAGE_JSON.abi, storageAddress)
        console.log('>>> storageContract', _storageContract)
        setStorageContract(_storageContract)
      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
        processError(err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      if (_isConnected) {
        connectWithMetamask()
      }
    }
  }

  useEffect(() => {
    debugLog('on useEffect activeWeb3 initOnWeb3Ready')
    initOnWeb3Ready()
  }, [activeWeb3])


  const connectWithMetamask = async () => {
    doConnectWithMetamask({
      onBeforeConnect: () => { setIsWalletConnecting(true) },
      onSetActiveChain: setActiveChainId,
      onConnected: (cId, web3) => {
        setActiveWeb3(web3)
        onBlockchainChanged(onNetworkChanged)
        setIsWalletConnecting(false)
      },
      onError: (err) => {
        console.log(">>>> connectWithMetamask", err)
        processError(err)
        setIsWalletConnecting(false)
      },
      needChainId: storageChainId,
    })
  }
  /* ---------------------------- END WEB3 CONNECT --------- */

  const [storageContract, setStorageContract] = useState(false)
  const [isStorageSave, setIsStorageSave] = useState(false)

  const saveExStorageConfig = async (options) => {
    const {
      onBegin,
      onReady,
      onError,
      key,
      data,
    } = {
      onBegin: () => {},
      onReady: () => {},
      onError: () => {},
      ...options,
    }

    if (isStorageSave) {
      addNotify(`Storage already saving...`, `error`)
      return
    }
    setIsStorageSave(true)
    saveExStorageData({
      activeWeb3,
      key,
      data,
      onBegin: () => {
        onBegin()
      },
      onReady: () => {
        setIsStorageSave(false)
        onReady()
      },
      onError: () => {
        setIsStorageSave(false)
        onError()
      }
    })
  }
  
  const saveStorageConfig = async (options) => {
    const {
      onBegin,
      onReady,
      onError,
      newData,
    } = options

    if (isStorageSave) {
      addNotify(`Storage already saving...`, `error`)
      return
    }
    const _newStorageData = {
      ...storageData,
      ...newData,
    }
    console.log('>> save data', _newStorageData)
    const _doSave = async () => {
      if (address && storageContract) {
        addNotify(`Saving config to storage. Confirm transaction`)
        setIsStorageSave(true)
        if (onBegin) onBegin()

        const saveData = _newStorageData

        try {
          const setupTxData = await calcSendArgWithFee(
            address,
            storageContract,
            "setKeyData",
            [
              getCurrentDomain(),
              {
                owner: address,
                info: JSON.stringify(saveData)
              }
            ]
          )
          
          storageContract.methods.setKeyData(
            getCurrentDomain(),
            {
              owner: address,
              info: JSON.stringify(saveData)
            }
          ).send(setupTxData).then(() => {
            setIsStorageSave(false)
            if (onReady) onReady()
          }).catch((e) => {
            console.log('>>> error', e)
            setIsStorageSave(false)
            if (onError) onError(e)
          })
        } catch (e) {
          console.log('>>> error', e)
          setIsStorageSave(false)
          if (onError) onError(e)
        }
      } else {
        addNotify(`Fail save storage. No active wallet or contract not ready yet`, `error`)
      }
    }
    _doSave()
  }

  const getActiveChain = () => {
    return {
      activeChainId,
      activeWeb3,
    }
  }
  
  let showInstallBox = (storageData && !storageData.isInstalled)

  const [isInstalledOnDomain, setIsInstalledOnDomain] = useState(!showInstallBox)
  const [isSettingUpOnDomain, setIsSettingUpOnDomain] = useState(false)
  
  const doSetupOnDomain = () => {
    saveStorageConfig({
      onBegin: () => {
        setIsSettingUpOnDomain(true)
        addNotify(`Confirm transaction for setup NFTs Marketplace on this domain`)
      },
      onReady: async () => {
        setIsSettingUpOnDomain(false)
        setIsInstalledOnDomain(true)
        addNotify(`NFTs Marketplace successfull installed on this domain. Now you can configure farm`, `success`)
        setDoReloadStorage(true)
      },
      onError: (err) => {
        setIsSettingUpOnDomain(false)
        addNotify(`Fail setup NFTs Marketplace on domain`, `error`)
      },
      newData: {
        isInstalled: true,
      }
    })
  }

  const [activeTab, setActiveTab] = useState(`marketplace`)

  const _tabOptions = {
    setDoReloadStorage,
    saveStorageConfig,
    saveExStorageConfig,
    openConfirmWindow,
    addNotify,
    getActiveChain,
    storageDesign,
    storageTexts,
    storageData,
    activeAccount: address,
    storageMenu,
    storageFooterMenu
  }
  
  const tabDesign = new TabDesign(_tabOptions)
  const tabTexts = new TabTexts(_tabOptions)
  const tabMenu = new TabMenu(_tabOptions)
  const tabFooterMenu = new TabFooterMenu(_tabOptions)
  const tabMarketplace = new TabMarketplace(_tabOptions)

  /* ------------------------------------------- */
  const renderActiveChainInfo = () => {
    const chainInfo = CHAIN_INFO(activeChainId)
    const storageChainInfo = CHAIN_INFO(storageChainId)

    return (
      <div className={styles.adminActiveChainInfo}>
        <span>
          Current active network is <b>{chainInfo?.chainName || `Unknown`} ({activeChainId})</b>
        </span>
        <span>
          Main config storage network is <b>{storageChainInfo?.chainName || `Unknown`} ({storageChainId})</b>
        </span>
      </div>
    )
  }
  /* -------------------------------------------- */
  //console.log('>>> storageData', storageData, showInstallBox, (storageData && !storageData.isInstalled), !isInstalledOnDomain)


  
  if (isInstalledOnDomain) showInstallBox = false
  return (
    <div className={styles.container}>
      {navBlock(`settings`, storageMenu, true)}
      <h1 className={styles.h1}>Settings</h1>
      {storageData !== null && (
        <>
          {(showInstallBox) ? (
            <>
              <h2>NFTs Marketplace need setup on this domain</h2>
              {!address ? (
                <button disabled={isWalletConecting} className={`${styles.mainButton} primaryButton`} onClick={connectWithMetamask}>
                  {isWalletConecting ? `Connecting` : `Connect Wallet`}
                </button>
              ) : (
                <>
                  {renderActiveChainInfo()}
                  <button disabled={isSettingUpOnDomain} className={`${styles.mainButton} ${styles.autoWidth} primaryButton`} onClick={doSetupOnDomain}>
                    {isSettingUpOnDomain ? `Setup on domain...` : `Setup NFTs Marketplace on this domain`}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {!address ? (
                <button disabled={isWalletConecting} className={`${styles.mainButton} primaryButton`} onClick={connectWithMetamask}>
                  {isWalletConecting ? `Connecting` : `Connect Wallet`}
                </button>
              ) : (
                <>
                  {isOwner ? (
                    <>
                      {renderActiveChainInfo()}
                      <ul className={styles.settingsTabsNav}>
                        {Object.keys(settingsTabs).map((tabKey) => {
                          return (
                            <li onClick={() => { setActiveTab(tabKey) }} key={tabKey} className={(tabKey === activeTab) ? styles.activeTab : ``}>
                              {settingsTabs[tabKey]}
                            </li>
                          )
                        })}
                      </ul>
                      <hr className={`${styles.divider} ${styles.spacerTop}`} />
                      {/* -------------------------------------------------*/ }
                      {activeTab === `mainmenu` && tabMenu.render()}
                      {activeTab === `footermenu` && tabFooterMenu.render()}
                      {activeTab === `marketplace` && tabMarketplace.render()}
                      {activeTab === `texts` && tabTexts.render()}
                      {activeTab === `design` && tabDesign.render()}
                      {/* -------------------------------------------------*/ }
                    </>
                  ) : (
                    <h2>Access denied</h2>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Settings;
