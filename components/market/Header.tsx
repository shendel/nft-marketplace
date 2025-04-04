import useWeb3 from "/helpers/useWeb3"
import { useEffect, useState } from "react"
import FaIcon from "/components/FaIcon"
import { getLink } from "/helpers/getLink"
import { getAssets } from "/helpers/getAssets"
import { defMenus, sysMenus } from "/appconfig/menu"
import WalletModal from "./WalletModal"
import useStorage from "/storage/"

export default function Header(props) {

  
  const {
    isOwner,
    storageMenu,
    storageData,
    isInstalled,
    getDesign,
  } = props
  
  const menuItems = (storageMenu && storageMenu.length ? storageMenu : defMenus)



  const [ isMenuOpened, setIsMenuOpened ] = useState(false)
  
  const onCloseMenu = () => {
    setIsMenuOpened(false)
  }
  
  const {
    isWalletConnecting,
    isConnected,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId,
    isSwitchChain,
    setChainId,
    chainId,
    isSwitchAccount,
    switchAccount,
    disconnectWallet
  } = useWeb3()
  
  useEffect(() => {
    if (!address) {
      setIsMenuOpened(false)
    }
  }, [ address ])
  
  const [ isMobileMenuOpened, setIsMobileMenuOpened ] = useState(false)
  
  return (
    <>
      <style jsx>
        {`
           .css-1un3lp3 {
              all: unset;
              display: -webkit-inline-box;
              display: -webkit-inline-flex;
              display: -ms-inline-flexbox;
              display: inline-flex;
              -webkit-align-items: center;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              -webkit-justify-content: center;
              justify-content: center;
              border-radius: 8px;
              padding: 12px 12px;
              font-size: 16px;
              font-weight: 500;
              box-sizing: border-box;
              -webkit-tap-highlight-color: transparent;
              line-height: 1;
              -webkit-flex-shrink: 0;
              -ms-flex-negative: 0;
              flex-shrink: 0;
              box-shadow: none;
              background: hsl(256, 6.0%, 93.2%);
              color: #FFFFFF;
              cursor: pointer;
              -webkit-animation: animation-plwpox 300ms ease;
              animation: animation-plwpox 300ms ease;
          }

          .css-1un3lp3:focus {
              box-shadow: 0 0 0 3px hsl(245, 4.9%, 25.4%);
          }

          .css-1un3lp3:active {
              -webkit-transform: translateY(1px);
              -moz-transform: translateY(1px);
              -ms-transform: translateY(1px);
              transform: translateY(1px);
          }

          .css-1un3lp3[disabled] {
              cursor: not-allowed;
          }
          .css-16br1f7 {
            all: unset;
            cursor: pointer;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            line-height: 1;
            animation-timeline: auto;
            animation-range-start: normal;
            animation-range-end: normal;
            background: rgb(22, 22, 24);
            border-width: 1px;
            border-style: solid;
            border-color: rgb(35, 35, 38);
            border-image: initial;
            padding: 12px;
            border-radius: 12px;
            gap: 16px;
            animation: 300ms ease 0s 1 normal none running animation-plwpox;
            margin-top: -8px;
            margin-left: -10px;
        }
        .logo {
          max-height: 3em;
        }
        `}
      </style>
      <div className="py-4 pl-4 pr-3 relative z-50 md:bg-white md:bg-opacity-5 lg:py-5 lg:px-[30px]">
        <div></div>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-7 xl:gap-9 2xl:gap-11">
            <a className="lg:hidden" href={getLink(`index`)}>
              <img
                className="logo"
                src={getDesign('logoUriMobile', `uri`, getAssets(`images/logo.png`, 'logoUriMobile'))}
              />
            </a>
            <a className="hidden lg:block" href={getLink(`index`)}>
              <img
                className="logo"
                src={getDesign('logoUriDesktop', `uri`, getAssets(`images/logo.png`, 'logoUriDesktop'))}
              />
            </a>
          </div>
          {/* Mobile menu */}
          <div className="flex gap-4 sm:items-center md:hidden z-50">
            <div className="">
              <button onClick={() => { setIsMobileMenuOpened(true) }}  className="hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.25 18.6h19.5M3.25 13.182h19.5M3.25 7.766h19.5"></path>
                </svg>
              </button>
              {address && (
                <div className="useProfileMobile">
                  <a href={getLink('profile')}>
                    <img className="hover:scale-105 transition-all duration-150" 
                      alt="Profile" 
                      src={getAssets(`images/user-icon.png`, 'userIcon')}
                      style={{
                        objectFit: 'contain',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  </a>
                </div>
              )}
              <ul className={`${(!isMobileMenuOpened) ? 'hidden' : ''} text-gray-200 transition-all flex border border-gray-100 border-opacity-40 shadow shadow-white flex-col items-start px-6 gap-2 py-5 duration-150 top-2 right-2 z-10 w-[280px] bg-slate-900 rounded-xl absolute`}>
                <button onClick={() => { setIsMobileMenuOpened(false) }} className="absolute right-4 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.25 18.6h19.5M3.25 13.182h19.5M3.25 7.766h19.5"></path>
                  </svg>
                </button>
                <li>
                  {(address) ? (
                    <button
                      type="button"
                      className="tw-connected-wallet !px-5 !rounded-[2px] css-16br1f7"
                      onClick={() => { setIsMenuOpened(true) }}
                    >
                      <FaIcon icon="wallet" />
                      {address.substr(0,6)}{`...`}{address.substr(-4,4)}
                    </button>
                  ) : (
                    <button
                      onClick={() => { connectWeb3() }}
                      className="!px-5 !rounded-[2px] tw-connect-wallet css-1un3lp3" 
                      type="button" 
                      style={{ minWidth: '140px' }}
                      aria-label="Connect Wallet"
                    >
                      Connect Wallet
                    </button>
                  )}
                </li>
                {menuItems.map((menuItem, itemKey) => {
                  const href = (menuItem.target !== ``) ? getLink(sysMenus[menuItem.target]) : menuItem.link
                  
                  return (
                    <li key={itemKey}>
                      <a 
                        className="hover:scale-105 hover:text-orange-500 inline-block text-lg"
                        href={href}
                        {...(menuItem.blank ? { target: '_blank' } : {})}
                      >
                        {menuItem.title}
                      </a>
                    </li>
                  )
                })}
                {(isOwner || !isInstalled) && (
                  <li>
                    <a 
                      className="hover:scale-105 hover:text-orange-500 inline-block text-lg"
                      href={getLink(`settings`)}
                    >
                      Settings
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="flex gap-7 lg:gap-9 xl:gap-14 2xl:gap-16">
              {menuItems.map((menuItem, itemKey) => {
                const href = (menuItem.target !== ``) ? getLink(sysMenus[menuItem.target]) : menuItem.link
                
                return (
                  <a 
                    key={itemKey}
                    className="hover:scale-105 hover:text-orange-500 inline-block text-lg"
                    href={href}
                    {...(menuItem.blank ? { target: '_blank' } : {})}
                  >
                    {menuItem.title}
                  </a>
                )
              })}
              {(isOwner || !isInstalled) && (
                <a 
                  className="hover:scale-105 hover:text-orange-500 inline-block text-lg"
                  href={getLink(`settings`)}
                >
                  Settings
                </a>
              )}
            </div>
            <div className="ml-6 lg:ml-8 xl:ml-10 2xl:ml-12">
              {address && (
                <button
                  className="connect-button tw-connect-wallet css-1un3lp3"
                  type="button" 
                  style={{
                    minWidth: '140px',
                  }}
                  onClick={() => { setIsMenuOpened(true) }}
                >
                  <span style={{ paddingRight: '10px' }}>
                    <FaIcon icon="wallet" />
                  </span>
                  {address.substr(0,6)}{`...`}{address.substr(-4,4)}
                </button>
              )}
              {!address && (
                <button 
                  onClick={() => { connectWeb3() } }
                  className="connect-button tw-connect-wallet css-1un3lp3"
                  data-theme="dark"
                  data-is-loading="false"
                  type="button" 
                  style={{
                    minWidth: '140px',
                  }}
                  aria-label="Connect Wallet"
                  data-test="connect-wallet-button"
                >
                  Connect Wallet
                </button>
              )}
            </div>
            {address && (
              <div className="ml-4 lg:ml-6">
                <a href={getLink('profile')}>
                  <img className="hover:scale-105 transition-all duration-150" 
                    alt="Profile" 
                    src={getAssets(`images/user-icon.png`, 'userIcon')}
                    style={{
                      objectFit: 'contain',
                      width: '40px',
                      height: '40px',
                    }}
                  />
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
      {address && isMenuOpened && (
        <WalletModal
          onClose={onCloseMenu}
          address={address}
          activeChainId={activeChainId}
          marketplaceChainId={storageData?.marketplaceChainId}
          marketplaceContract={storageData?.marketplaceContract}
          isSwitchAccount={isSwitchAccount}
          switchAccount={switchAccount}
          isSwitchChain={isSwitchChain}
          switchChainId={switchChainId}
          disconnectWallet={disconnectWallet}
          />
      )}
    </>
  )
}