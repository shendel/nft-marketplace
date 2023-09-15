import styles from "/styles/Home.module.css"
import { useEffect, useState } from "react"
import {
  useStateUint,
  useStateAddress
} from "/helpers/useState"

import isEvmAddress from "/helpers/isEvmAddress"
import SwitchNetworkAndCall from "../SwitchNetworkAndCall"
import FaIcon from "../FaIcon"
import adminFormRow from "/components/adminFormRow"
import AdminInfoRow from "/components/AdminInfoRow"
import List from "../List"
import AddressList from "../AddressList"
import ListView from "../ListView"
import BlockScanLink from "../BlockScanLink"

import {
  AVAILABLE_NETWORKS_INFO,
  CHAIN_INFO,
  CHAINS_LIST,
  CHAIN_EXPLORER_LINK
} from "/helpers/constants"
import deployMarketplace from "/helpers/deployMarketplace"
import fetchMarketInfo from '/helpers/fetchMarketInfo'
import Web3ObjectToArray from '/helpers/Web3ObjectToArray'
import callMPMethod from "/helpers/callMPMethod"

export default function TabMarketplace(options) {
  const {
    openConfirmWindow,
    addNotify,
    saveStorageConfig,
    saveExStorageConfig,
    storageData,
    getActiveChain,
    chainId,
    activeAccount,
  } = options
  

  const [ marketplaceContract, setMarketplaceContract ] = useState(``)

  const [ marketChainId, setMarketChainId ] = useState(chainId)
  const [ isDeployOpened, setIsDeployOpened ] = useState( false )
  const [ nftCollection, setNftCollection, nftCollectionError ] = useStateAddress('')
  const [ nftCollections, setNftCollections ] = useState([])
  const [ tradeFee, setTradeFee ] = useStateUint(10)
  const [ feeReceiver, setFeeReceiver ] = useStateAddress(activeAccount) 
  const [ allowedERC20, setAllowedERC20 ] = useState([])
  const [ isDeploying, setIsDeploying ] = useState(false)
  
  const showAlert = (title, message) => {
    openConfirmWindow({
      title: title,
      message: message,
      onConfirm: () => {},
      isOk: true
    })
  }

  const doDeployMarketplace = () => {
    if (!marketChainId) return showAlert(`Fill settings first`, `Specify chain id`)
    const hasNftCollectionsError = nftCollections.filter((address) => { return !isEvmAddress(address) })
    if (hasNftCollectionsError.length) return showAlert(`Address not correct`, `You are specify not correct nft collection address`)
    if (nftCollections.length == 0) return showAlert(`Fill settings first`, `Specify NFT collection address`)
    if (!feeReceiver) return showAlert(`Fill settings first`, `Specify fee receiver address`)
    const hasERC20Error = allowedERC20.filter((address) => { return !isEvmAddress(address) })
    if (hasERC20Error.length) return showAlert(`Address not correct`, `You are specify not correct ERC20 address`)

    const marketChainInfo = CHAIN_INFO(marketChainId)

    openConfirmWindow({
      title: `Deploying new MarketPlace contract`,
      message: `Do you want deploy new MarketPlace contract atn ${marketChainInfo.chainName} (${marketChainId})?`,
      onConfirm: () => {
        setIsDeploying(true)
        const {
          activeWeb3,
        } = getActiveChain()
        deployMarketplace({
          activeWeb3,
          nftCollections,
          tradeFee,
          feeReceiver,
          allowedERC20,
          onTrx: (hash) => {
            addNotify(`MarketPlace collection deploy TX ${hash}...`, `success`)
          },
          onSuccess: (newContractAddress) => {
            try {
              addNotify(`MarketPlace collection deployed. Now save settings`, `success`)
              setIsDeploying(false)
              setMarketplaceContract(newContractAddress)
              setExistsMPContract(newContractAddress)
              setExistsMPChainId(marketChainId)
              setExistsMPReload(true)
              setConfigureExistOpened(true)
              setIsDeployOpened(false)
              openConfirmWindow({
                title: `Save MarketPlace contract to config`,
                message: `Save deployed MarketPlace ${newContractAddress} to config?`,
                onConfirm: () => {
                  saveStorageConfig({
                    newData: {
                      marketplaceContract: newContractAddress,
                      marketplaceChainId: marketChainId,
                    },
                    onBegin: () => {
                      addNotify(`Confirm transaction for save main config`)
                      setIsSaveMainSettings(true)
                    },
                    onReady: () => {
                      addNotify(`Main config successfull saved`, `success`)
                      setDeployedMPContract(newContractAddress)
                      setDeployedMPChainId(marketChainId)
                      setConfigureExistOpened(false)
                      setIsSaveMainSettings(false)
                    },
                    onError: (err) => {
                      addNotify(`Fail save main config`, `error`)
                      setIsSaveMainSettings(false)
                    }
                  })
                }
              })
            } catch (err) {
              console.log('>>> onSuccess error', err)
            }
          },
          onError: (err) => {
            addNotify(`Fail deploy MarketPlace. ${(err.message ? err.message : '')}`, `error`)
            setIsDeploying(false)
            console.log(err)
          }
        }).catch((err) => {
          setIsDeploying(false)
          addNotify(`Fail deploy MarketPlace. ${err.message ? err.message : ''}`, `error`)
        })
      }
    })
  }

  const doCloseDeploy = () => {
    setIsDeployOpened(false)
  }
  

  window.cleanUpMP = () => {
    saveStorageConfig({
      newData: {
        marketplaceContract: '',
        marketplaceChainId: '',
      },
      onBegin: () => {
        addNotify(`Confirm transaction for save main config`)
      },
      onReady: () => {
        addNotify(`Main config successfull saved`, `success`)
      },
      onError: (err) => {
        addNotify(`Fail save main config`, `error`)
      }
    })
  }
  

  const [ deployedMPContract, setDeployedMPContract ] = useState(storageData.marketplaceContract)
  const [ deployedMPChainId, setDeployedMPChainId ] = useState(storageData.marketplaceChainId)
  const [ deployedMPInfo, setDeployedMPInfo ] = useState(false)
  const [ needReloadContract, setNeedReloadContract ] = useState(false)
  /* Edit MarketPlace */
  const [ isEditFeeReciever, setIsEditFeeReciever ] = useState(false)
  const [ newNftCollections, setNewNftCollections ] = useState(Web3ObjectToArray(deployedMPInfo?.nftCollections))
  const [ newFeeReciever, setNewFeeReciever ] = useStateAddress(deployedMPInfo?.feeReceiver)
  const [ newTradeFee, setNewTradeFee ] = useStateUint(deployedMPChainInfo?.tradeFee)
  const [ newAllowedERC20, setNewAllowedERC20 ] = useState(Web3ObjectToArray(deployedMPInfo?.allowedERC20))

  const [ isSaveMainSettings, setIsSaveMainSettings ] = useState(false)
  useEffect(() => {
    if (deployedMPChainId && deployedMPContract) {
      setNeedReloadContract(false)
      fetchMarketInfo({
        address: deployedMPContract,
        chainId: deployedMPChainId,
      }).then((info) => {
        setDeployedMPInfo(info)
      })
    }
  }, [ deployedMPContract, deployedMPChainId, needReloadContract])

  const saveMPSetting = (method, args) => {
    return new Promise((resolve, reject) => {
      openConfirmWindow({
        title: `Saving MarketPlace settings`,
        message: `Save changes to MarketPlace contract?`,
        onConfirm: () => {
          const {
              activeChainId,
              activeWeb3
          } = getActiveChain()

          if (activeChainId === deployedMPChainId) {
            addNotify(`Saving changes to contract. Confirm transaction`)
            callMPMethod({
              activeWeb3,
              contractAddress: deployedMPContract,
              method,
              args,
              onTrx: (txHash) => {
                addNotify(`Saving changes TX ${txHash}`, `success`)
              },
              onSuccess: (receipt) => {},
              onError: (err) => {
                resolve(false)
                addNotify(`Fail save changes. ${err.message ? err.message : ''}`, `error`)
              },
              onFinally: (answer) => {
                addNotify(`Changes successfully saved`, `success`)
                resolve(true)
                setNeedReloadContract(true)
              }
            })
          } else {
            resolve(false)
            const marketChainInfo = CHAIN_INFO(deployedMPChainId)
            openConfirmWindow({
              title: `Fail save MarketPlace settings`,
              message: `Change your network to ${marketChainInfo.chainName} (${deployedMPChainId})`,
              isOk: true,
            })
          }
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
  }
  // Configure exists contract
  const [ configureExistOpened, setConfigureExistOpened ] = useState(false)
  const [ existsMPChainId, setExistsMPChainId ] = useStateUint(0)
  const [ existsMPContract, setExistsMPContract ] = useStateAddress('')
  const [ isExistsMPReload, setExistsMPReload ] = useState(false)
  const [ isExistsMPFetched, setIsExistsMPFetched ] = useState(false)
  const [ isExistsMPFetching, setIsExistsMPFetching ] = useState(false)
  const [ existsMPInfo, setExistMPInfo ] = useState(false)
  const [ isExistsMPSaving, setIsExistsMPSaving ] = useState(false)

  useEffect(() => {
    if (isExistsMPReload) {
      setExistsMPReload(false)
      _doFetchExistsInfo()
    }
  }, [ isExistsMPReload ])
  useEffect(() => {
    setIsExistsMPFetched(false)
  }, [ existsMPChainId, existsMPContract ])
  
  const _doFetchExistsInfo = () => {
    setIsExistsMPFetched(false)
    setIsExistsMPFetching(true)
    fetchMarketInfo({
      address: existsMPContract,
      chainId: existsMPChainId,
      onlyInfo: true,
    }).then((info) => {
      if (info && info.isMPContract) {
        setIsExistsMPFetched(true)
        setExistMPInfo(info)
      } else {
        showAlert(`Fail fetch info`, `Specified contract is not MarketPlace`)
      }
      setIsExistsMPFetching(false)
    }).catch((err) => {
      showAlert(`Fail fetch info`, `Fail fetch info. May be contract is not MarketPlace`)
      setIsExistsMPFetching(false)
    })
  }
  const doFetchExistsInfo = () => {
    if (!existsMPChainId) return showAlert(`Error`, `Specify Chain Id`)
    if (!existsMPContract) return showAlert(`Error`, `Specify contract address`)
    if (!isEvmAddress(existsMPContract)) return showAlert(`Error`, `Specify correct contract address`)
    _doFetchExistsInfo()
  }
  const doExistsSave = () => {
    openConfirmWindow({
      title: `Save MarketPlace contract to config`,
      message: `Save deployed MarketPlace ${existsMPContract} to config?`,
      onConfirm: () => {
        saveStorageConfig({
          newData: {
            marketplaceContract: existsMPContract,
            marketplaceChainId: existsMPChainId,
          },
          onBegin: () => {
            addNotify(`Confirm transaction for save main config`)
            setIsSaveMainSettings(true)
          },
          onReady: () => {
            addNotify(`Main config successfull saved`, `success`)
            setDeployedMPContract(existsMPContract)
            setDeployedMPChainId(existsMPChainId)
            setConfigureExistOpened(false)
            setIsSaveMainSettings(false)
          },
          onError: (err) => {
            addNotify(`Fail save main config`, `error`)
            setIsSaveMainSettings(false)
          }
        })
      }
    })
  }
  const doCancelExistsSave = () => {
    setConfigureExistOpened(false)
  }
  
  const {
      activeChainId,
  } = getActiveChain()
  const activeChainInfo = CHAIN_INFO(activeChainId)


  const deployedMPChainInfo = CHAIN_INFO(deployedMPChainId)
  return {
    updateState: (newState) => {
      const {
        activeAccount,
        activeChainId
      } = newState
      setFeeReceiver(activeAccount)
      setMarketChainId(activeChainId)
    },
    setMarketChainId,
    render: () => {
      return (
        <>
          {!isDeployOpened && !configureExistOpened && !deployedMPContract && !deployedMPChainId && (
            <div className={styles.adminForm}>
              <div className={styles.adminInfoError}>
                <span>MarketPlace contract not configured.</span>
                <span>Specify exist contract or deploy new</span>
              </div>
            </div>
          )}
          {configureExistOpened && (
            <div className={styles.adminForm}>
              <div className={styles.subFormInfo}>
                <h3>Setup exists MarketPlace contract</h3>
                {adminFormRow({
                  label: `Chain ID`,
                  type: `list`,
                  values: CHAINS_LIST,
                  value: existsMPChainId,
                  onChange: setExistsMPChainId,
                  subForm: true
                })}
                <div className={styles.infoRow}>
                  <label>MarketPlace contract:</label>
                  <div>
                    <div>
                      <input type="text" value={existsMPContract} onChange={(e) => { setExistsMPContract(e) }} />
                    </div>
                  </div>
                </div>
                {isExistsMPFetched && existsMPInfo && (
                  <>
                    <AdminInfoRow label={`Owner`} value={(
                      <BlockScanLink address={existsMPInfo.owner} chainId={existsMPInfo.chainId} />
                    )} />
                    <AdminInfoRow label={`NFT Collections`} value={(
                      <ListView items={Web3ObjectToArray(existsMPInfo.nftCollections)} chainId={existsMPInfo.chainId} isAddressList={true} />
                    )} />
                    <AdminInfoRow label={`Trade fee`} value={existsMPInfo.tradeFee} />
                    <AdminInfoRow label={`Fee receiver`} value={(
                        <BlockScanLink address={existsMPInfo.feeReceiver} chainId={existsMPInfo.chainId} />
                    )} />
                    <AdminInfoRow label={`Allowed ERC20`} value={
                        (<ListView items={Web3ObjectToArray(existsMPInfo.allowedERC20)} chainId={existsMPInfo.chainId} isAddressList={true} />)
                      }
                    />
                  </>
                )}
                <div className={styles.actionsRow}>
                  {!isExistsMPFetched && (
                    <button disabled={isExistsMPFetching || isSaveMainSettings} className={styles.adminButton} onClick={doFetchExistsInfo}>
                      Fetch info about contract before save
                    </button>
                  )}
                  {isExistsMPFetched && existsMPInfo && existsMPInfo.isMPContract && (
                    <SwitchNetworkAndCall
                      chainId={`STORAGE`}
                      className={styles.adminButton}
                      disabled={isExistsMPSaving || isSaveMainSettings}
                      onClick={doExistsSave}
                      action={`Save contract info`}
                    >
                      Save contract info
                    </SwitchNetworkAndCall>
                  )}
                  <button disabled={isExistsMPSaving || isExistsMPFetching || isSaveMainSettings} className={styles.adminButton} onClick={doCancelExistsSave}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {deployedMPContract && deployedMPChainId && !isDeployOpened && !configureExistOpened && (
            <div className={styles.adminForm}>
              <div className={styles.subFormInfo}>
                <h3>Deployed MarketPlace info</h3>
                <AdminInfoRow label={`MarketPlace Chain Id`} value={(<>{deployedMPChainInfo.chainName} ({deployedMPChainId})</>)} />
                <AdminInfoRow label={`MarketPlace address`} value={(
                  <BlockScanLink address={deployedMPContract} chainId={deployedMPChainId} />
                )} />
                {deployedMPInfo && (
                  <>
                    <AdminInfoRow label={`Owner`} value={(
                      <BlockScanLink address={deployedMPInfo.owner} chainId={deployedMPChainId} />
                    )} />
                    <AdminInfoRow {...{
                      label: `NFT collections`,
                      value: (
                        <ListView items={Web3ObjectToArray(deployedMPInfo.nftCollections)} isAddressList={true} chainId={deployedMPChainId} />
                      ),
                      canEdit: true,
                      injectedButtons: true,
                      editView: (buttons) => {
                        return (
                          <AddressList items={newNftCollections} onChange={(v) => { setNewNftCollections(v) }} buttons={buttons} chainId={deployedMPChainId} />
                        )
                      },
                      onEdit: () => { setNewNftCollections(Web3ObjectToArray(deployedMPInfo.nftCollections)) },
                      onSave: () => {
                        const hasError = newNftCollections.filter((address) => { return !isEvmAddress(address) })
                        if (hasError.length) {
                          showAlert(`Error`, `Specify correct NFT collection address`)
                          return false
                        }
                        if (!newNftCollections.length) {
                          showAlert(`Error`, `Specify NFT collection address`)
                          return false
                        }
                        return saveMPSetting('setAllowedCollections', [newNftCollections])
                      }
                    }} />
                    <AdminInfoRow {...{
                      label: `Trade fee %`,
                      value: deployedMPInfo.tradeFee,
                      canEdit: true,
                      editView: () => {
                        return (
                          <input type="text" value={newTradeFee} onChange={(e) => { setNewTradeFee(e) }} />
                        )
                      },
                      onEdit: () => { setNewTradeFee(deployedMPInfo.tradeFee) },
                      onSave: () => {
                        return saveMPSetting(`setTradeFee`, [newTradeFee])
                      }
                    }} />
                    <AdminInfoRow {...{
                      label: `Fee receiver`,
                      value: (
                        <BlockScanLink address={deployedMPInfo.feeReceiver} chainId={deployedMPChainId} />
                      ),
                      canEdit: true,
                      editView: () => {
                        return (
                          <input type="text" value={newFeeReciever} onChange={(e) => { setNewFeeReciever(e) }} />
                        )
                      },
                      onEdit: () => { setNewFeeReciever(deployedMPInfo.feeReceiver) },
                      onSave: () => {
                        if (isEvmAddress(newFeeReciever)) {
                          return saveMPSetting(`setFeeReceiver`, [newFeeReciever])
                        } else {
                          showAlert(`Error`, `Specify correct fee receiver address`)
                          return false
                        }
                      }
                    }} />
                    <AdminInfoRow {...{
                      label: `Allowed ERC20`,
                      value: (
                        <ListView items={Web3ObjectToArray(deployedMPInfo.allowedERC20)} isAddressList={true} chainId={deployedMPChainId} />
                      ),
                      canEdit: true,
                      injectedButtons: true,
                      editView: (buttons) => {
                        return (
                          <AddressList items={newAllowedERC20} onChange={(v) => { setNewAllowedERC20(v) }} buttons={buttons} chainId={deployedMPChainId} />
                        )
                      },
                      onEdit: () => { setNewAllowedERC20(Web3ObjectToArray(deployedMPInfo.allowedERC20)) },
                      onSave: () => {
                        const hasError = newAllowedERC20.filter((address) => { return !isEvmAddress(address) })
                        if (hasError.length) {
                          showAlert(`Error`, `Specify correct ERC20 address`)
                          return false
                        }
                        return saveMPSetting(`setAllowedERC20`, [newAllowedERC20])
                      }
                    }} />
                  </>
                )}
              </div>
            </div>
          )}
          {isDeployOpened && (
            <div className={styles.adminForm}>
              <div className={styles.subFormInfo}>
                <h3>Deploy new MarketPlace</h3>
                {adminFormRow({
                  label: `Chain ID`,
                  type: `list`,
                  values: CHAINS_LIST,
                  value: marketChainId,
                  onChange: setMarketChainId,
                  subForm: true
                })}
                {marketChainId && (
                  <>
                    <div className={styles.infoRow}>
                      <label>NFT Collections:</label>
                      <div>
                        <div>
                          <strong className={styles.inputInfo}>
                            {`List of NFT contracts that can be allowed for trading`}
                          </strong>
                        </div>
                        <div>
                          <AddressList chainId={marketChainId} items={nftCollections} onChange={(v) => { setNftCollections(v) }} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <label>Trade fee:</label>
                      <div>
                        <div>
                          <input type="number" min="0" max="30" value={tradeFee} onChange={(e) => { setTradeFee(e) }} />
                          <strong>%</strong>
                        </div>
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <label>Fee receiver:</label>
                      <div>
                        <input type="text" value={feeReceiver} onChange={(e) => { setFeeReceiver(e) }} />
                      </div>
                    </div>
                    <div className={styles.infoRow}>
                      <label>Allowed ERC20 for trade:</label>
                      <div>
                        <div>
                          <strong className={styles.inputInfo}>List of token contracts that can be used for trading on par with native currency</strong>
                        </div>
                        <div>
                          <AddressList chainId={marketChainId} items={allowedERC20} onChange={(v) => { setAllowedERC20(v) }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className={styles.actionsRow}>
                  <SwitchNetworkAndCall
                    chainId={marketChainId}
                    className={styles.adminButton}
                    disabled={isDeploying}
                    onClick={doDeployMarketplace}
                    action={`Deploy`}
                  >
                    Deploy
                  </SwitchNetworkAndCall>
                  <button disabled={isDeploying} className={styles.adminButton} onClick={doCloseDeploy}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {!isDeployOpened && !configureExistOpened && (
            <>
              <div className={styles.adminFormBottom}>
                <button className={styles.adminButton} onClick={() => { setConfigureExistOpened(true) }}>
                  Configure exist MarketPlace contract
                </button>
              </div>
              <div className={styles.adminFormBottom}>
                <button className={styles.adminButton} onClick={() => { setIsDeployOpened(true) }}>
                  Deploy new MarketPlace contract
                </button>
              </div>
            </>
          )}
        </>
      )
    }
  }
}