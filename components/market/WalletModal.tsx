import FaIcon from "/components/FaIcon"
import { useEffect, useState } from "react"

export default function WalletModal(options) {

  const [ isCopyAddress, setIsCopyAddress ] = useState(false)
  
  const doCopyAddress = () => {
    setIsCopyAddress(true)
    setTimeout(() => { setIsCopyAddress(false) }, 3000)
  }
  
  
  
  return (
    <>
      <style jsx>
        {`
          .css-1309xma {
            z-index: 10000;
            background-color: rgb(22, 22, 24);
            border-radius: 20px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100vw - 40px);
            box-sizing: border-box;
            overflow-y: auto;
            padding: 24px 24px 32px;
            animation: 200ms ease 0s 1 normal none running animation-1ykkuzb;
            box-shadow: rgba(0, 0, 0, 0.07) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
            line-height: 1;
          }
          .css-vb2nuw {
            all: unset;
            cursor: pointer;
            display: inline-flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
            margin-right: -6px;
            margin-left: auto;
            color: rgb(160, 159, 166);
            border-radius: 6px;
            padding: 2px;
            transition: background 0.2s ease 0s, color 0.2s ease 0s;
          }
          .css-11zvfy3 {
            font-size: 14px;
            color: rgb(112, 111, 120);
            font-weight: 500;
          }
          .isCopyAddress {
            color: #036b03;
          }
        `}
      </style>
      <div role="dialog" id="radix-:rg:" aria-describedby="radix-:ri:" aria-labelledby="radix-:rh:" data-state="open" tabindex="-1" className="css-1309xma" 
        style={{
          pointerEvents: 'auto',
        }}
      >
        <div style={{
          minHeight: '200px',
        }}>
          <div>
            <div style={{
              display: 'flex',
              gap: '16px',
            }}>
              <svg aria-hidden="true" 
                focusable="false" className="svg-inline--fa fa-wallet " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                style={{
                  height: '32px',
                  marginTop: '8px'
                }}
              >
                <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 336c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
              <div style={{
                flexGrow: '1'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div data-test="connected-wallet-address" data-address="0x2A8D166495c7f854c5f2510fBD250fDab8ce58d7" 
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}
                  >
                    <span className="css-talq14"> 0x2A8D...58d7</span>
                    <button data-test="copy-address" className={`${(isCopyAddress) ? 'isCopyAddress' : ''} css-6kpg9l`} style={{ padding: '3px' }}
                      onClick={doCopyAddress}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {isCopyAddress ? (
                          <FaIcon icon="check" />
                        ) : (
                          <FaIcon icon="copy" />
                        )}
                      </div>
                    </button>
                  </div>
                  <button type="button" data-state="closed" className="css-vb2nuw">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M10.79 16.29C11.18 16.68 11.81 16.68 12.2 16.29L15.79 12.7C15.8827 12.6075 15.9563 12.4976 16.0064 12.3766C16.0566 12.2557 16.0824 12.126 16.0824 11.995C16.0824 11.864 16.0566 11.7343 16.0064 11.6134C15.9563 11.4924 15.8827 11.3825 15.79 11.29L12.2 7.7C12.013 7.51302 11.7594 7.40798 11.495 7.40798C11.2306 7.40798 10.977 7.51302 10.79 7.7C10.603 7.88698 10.498 8.14057 10.498 8.405C10.498 8.66943 10.603 8.92302 10.79 9.11L12.67 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13H12.67L10.79 14.88C10.4 15.27 10.41 15.91 10.79 16.29ZM19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8C3 8.55 3.45 9 4 9C4.55 9 5 8.55 5 8V6C5 5.45 5.45 5 6 5H18C18.55 5 19 5.45 19 6V18C19 18.55 18.55 19 18 19H6C5.45 19 5 18.55 5 18V16C5 15.45 4.55 15 4 15C3.45 15 3 15.45 3 16V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"></path>
                    </svg>
                  </button>
                </div>
                <span className="css-11zvfy3"> 3.385 ETH </span>
              </div>
            </div>
            <div style={{ height: '24px' }}></div>
            <div>
              <label className="css-11zvfy3">Current Network</label>
              <div style={{ height: '8px' }}></div>
              <button type="button" data-state="closed" className="css-p70ul1">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'relative', 
                    display: 'flex',
                    flexShrink: '0',
                    alignItems: 'center',
                  }}>
                    <img src="https://01d934bd1c9d4888e328724d5bd08d16.ipfscdn.io/ipfs/bafybeigzgztdmt3qdt52wuhyrrvpqp5qt4t2uja23wmfhsccqt332ek7da/ethereum/512.png" alt="" width="32" height="32"
                      style={{
                        objectFit: 'contain',
                        width: '32px', 
                        height: '32px',
                      }}
                    />
                    <div className="css-10pqiv5"></div>
                  </div>
                </div>
                Goerli 
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}