import FaIcon from "/components/FaIcon"
import { useEffect, useState } from "react"
import { getAssets } from "/helpers/"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useWeb3 from '/helpers/useWeb3'
import useStorage from "/storage/"


export default function WalletModal(options) {
  const {
    onClose,
  } = {
    onClose: () => {},
    ...options
  }

  const {
    storageData,
  } = useStorage()
  
  const {
    isWalletConnecting,
    isConnected,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId,
    setChainId,
    isSwitchChain,
    switchAccount,
    isSwitchAccount,
    disconnectWallet
  } = useWeb3()
  
  useEffect(() => {
    if (storageData && storageData.marketplaceChainId) {
      console.log('>>> WalletModal setChainId', storageData.marketplaceChainId)
      setChainId(storageData.marketplaceChainId)
    }
  }, [ storageData ])
  
  const [ isCopyAddress, setIsCopyAddress ] = useState(false)
  
  const doCopyAddress = () => {
    setIsCopyAddress(true)
    setTimeout(() => { setIsCopyAddress(false) }, 3000)
  }

  return (
    <>
      <style>
        {`
          DIV.walletModal-bg {
            position: absolute;
            left: 0px;
            top: 0px;
            bottom: 0px;
            right: 0px;
            background: black;
            z-index: 10000;
            opacity: 0.1;
          }
          DIV.walletModal {
            position: absolute;
            z-index: 10001;
            right: 5.9em;
            top: 4.5em;
            padding: 1em;
            background: #161618;
            border: 1px solid #323232;
            border-radius: 0.4em;
            min-width: 300px;
          }
          @media (max-width:800px) {
            DIV.walletModal {
              left: 1em;
              top: 3em;
              right: 1em;
              min-width: auto;
            }
          }
          DIV.walletInfo {
            display: flex;
            items-align: center;
          }
          DIV.walletInfo STRONG {
            display: flex;
            width: 100%;
            align-items: center;
          }
          DIV.walletInfo STRONG SPAN {
            display: block;
            margin-left: 0.5em;
            cursor: pointer;
            color: #706f78;
          }
          DIV.walletInfo STRONG SPAN:hover {
            background: #232326;
            color: #ededef;
          }
          DIV.walletInfo STRONG SPAN.isCopyAddress {
            color: #1c951c;
          }
          DIV.walletInfo EM {
            display: block;
            width: 2em;
            margin-right: 0.5em;
          }
          DIV.walletInfo EM SVG {
            display: block;
            height: 1.5em;
          }
          DIV.walletInfo A.-exit {
            color: #a09fa6;
            cursor: pointer;
          }
          DIV.walletInfo A.-exit:hover {
            color: #e54d2e;
          }
          DIV.walletInfo A.-exit SVG {
            height: 1.5em;
          }
          DIV.walletModal BUTTON {
            all: unset;
            display: flex;
            align-items: center;
            background-color: #161618;
            box-sizing: border-box;
            width: 100%;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.3;
            color: #ededef !important;
            padding: 12px;
            border-radius: 8px;
            border-width: 1px;
            border-style: solid;
            border-color: #28282c;
            margin-top: 0.5em;
          }
          DIV.walletModal BUTTON:hover {
            transition: box-shadow 250ms ease 0s, border-color 250ms ease 0s;
            border: 1px solid #0091ff;
            box-shadow: #0091ff 0px 0px 0px 1px;
          }
          DIV.walletModal BUTTON SVG,
          DIV.walletModal BUTTON IMG {
            margin-right: 0.5em;
            height: 1em;
          }
          DIV.walletModal LABEL {
            padding-top: 2em;
            display: block;
            padding-bottom: 1em;
            font-size: 14px;
            color: #706f78;
            font-weight: 500;
            display: flex;
            align-items: center;
          }

          DIV.walletModal LABEL IMG {
            display: none;
            height: 1em;
            margin-left: 0.5em;
          }
          DIV.walletModal LABEL.isLoading IMG {
            display: block;
          }
          DIV.walletModal UL {
            border-radius: 8px;
            border: 1px solid #28282c;
          }
          DIV.walletModal UL LI {
            display: flex;
            padding: 0.5em;
            align-items: center;
            border-bottom: 1px solid #28282c;
          }
          DIV.walletModal UL LI:last-child {
            border-bottom: none;
          }
          DIV.walletModal UL LI SPAN {
            display: block;
          }
          DIV.walletModal UL LI EM {
            width: 2em;
            margin-right: 0.5em;
          }
          DIV.walletModal UL LI SPAN:nth-child(1) {
            width: 100%;
          }
          DIV.walletModal IMG.walletModalLoading {
            margin: 0 auto;
            height: 3em;
          }
        `}
      </style>
      <div className="walletModal-bg" onClick={onClose}></div>
      {!address || !storageData ? (
        <div className="walletModal">
          <img className="walletModalLoading" src={getAssets('images/loader.svg')} />
        </div>
      ) : (
        <div className="walletModal">
          <div className="walletInfo">
            <em>
              <FaIcon icon="wallet" />
            </em>
            <strong>
              {address.substr(0,6)}{`...`}{address.substr(-4,4)}
              <CopyToClipboard text={address} onCopy={doCopyAddress}>
                <span className={(isCopyAddress) ? 'isCopyAddress' : ''}>
                  <FaIcon icon={(isCopyAddress) ? 'check' : 'copy'} />
                </span>
              </CopyToClipboard>
            </strong>
            {/*
            <a className="-exit" onClick={() => { disconnectWallet() }}>
              <FaIcon icon="sign-out" />
            </a>
            */}
          </div>
          {`${activeChainId}` !== `${storageData.marketplaceChainId}` ? (
            <>
              {/*
              <label>
                <span>Balances - Wrong network</span>
              </label>
              */}
              <label>
                <span>Wrong network</span>
              </label>
              <button onClick={() => { switchChainId() }}>
                {isSwitchChain && (<img src={getAssets('images/loader.svg')} />)}
                {!isSwitchChain && (<FaIcon icon="share-alt" />)}
                <span>Switch network</span>
              </button>
            </>
          ) : (
            <>
              {/*
              <label className="isLoading">
                <span>Balances</span>
                <img src={getAssets('images/loader.svg')} />
              </label>
              <ul>
                <li>
                  <em></em>
                  <span>ETH</span>
                  <span>0.001</span>
                </li>
                <li>
                  <em></em>
                  <span>ETH</span>
                  <span>0.001</span>
                </li>
                <li>
                  <em></em>
                  <span>ETH</span>
                  <span>0.001</span>
                </li>
              </ul>
              */}
            </>
          )}
          <div style={{paddingTop: '1em'}}>
            <button onClick={() => { switchAccount() }}>
              {isSwitchAccount &&  (<img src={getAssets('images/loader.svg')} />)}
              {!isSwitchAccount && (<FaIcon icon="random" />)}
              <span>Switch account</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}