

export default function Button(options) {
  const {
    children,
    isLoading,
    onClick,
  } = {
    isLoading: false,
    onClick: () => {},
    ...options
  }

  return (
    <>
      <style jsx>
        {`
          .css-1tu9cnm {
            -webkit-animation: animation-103nb1t 2s linear infinite;
            animation: animation-103nb1t 2s linear infinite;
            width: 1em;
            height: 1em;
            margin: 0 auto;
          }

          @-webkit-keyframes animation-103nb1t {
            100% {
              -webkit-transform: rotate(360deg);
              -moz-transform: rotate(360deg);
              -ms-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }

          @keyframes animation-103nb1t {
            100% {
              -webkit-transform: rotate(360deg);
              -moz-transform: rotate(360deg);
              -ms-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
          .css-axmsrp {
            stroke-linecap: round;
            -webkit-animation: animation-1en1lui 1.5s ease-in-out infinite;
            animation: animation-1en1lui 1.5s ease-in-out infinite;
          }

          @-webkit-keyframes animation-1en1lui {
            0% {
              stroke-dasharray: 1,150;
              stroke-dashoffset: 0;
            }

            50% {
              stroke-dasharray: 90,150;
              stroke-dashoffset: -35;
            }

            100% {
              stroke-dasharray: 90,150;
              stroke-dashoffset: -124;
            }
          }

          @keyframes animation-1en1lui {
            0% {
              stroke-dasharray: 1,150;
              stroke-dashoffset: 0;
            }

            50% {
              stroke-dasharray: 90,150;
              stroke-dashoffset: -35;
            }

            100% {
              stroke-dasharray: 90,150;
              stroke-dashoffset: -124;
            }
          }
          .-button {
            height: 52px;
          }
        `}
      </style>
      <button 
        className="-button connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3" 
        type="button" 
        disabled={isLoading}
        style={{minWidth: '140px'}}
        onClick={(isLoading) ? () => {} : onClick}
      >
        {isLoading ? (
          <svg viewBox="0 0 50 50" 
            className="css-1tu9cnm" 
            style={{
              width: '16px',
              height: '16px',
            }}
          >
            <circle cx="25" cy="25" r="20" fill="none" stroke="hsl(246, 6.0%, 9.0%)" strokeWidth="4" className="css-axmsrp"></circle>
          </svg>
        ) : (
          <>{children}</>
        )}
      </button>
    </>
  )
}