

export default function Button(options) {
  const {
    children,
    isLoading,
    href,
    onClick,
    disabled,
    width,
  } = {
    href: false,
    isLoading: false,
    disabled: false,
    width: false,
    onClick: () => {},
    ...options
  }

  const props = {}
  if (href) props.href = href
  
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
            margin-top: 4px;
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
            cursor: pointer;
            text-align: center;
          }
          .-button.-disabled {
            cursor: not-allowed;
          }
          .-button.-locked {
            cursor: not-allowed;
            background: #4d4d4d !important
          }
        `}
      </style>
      <a
        {...props}
        className={`-button ${(isLoading) ? '-disabled' : ''} ${(disabled) ? '-locked' : ''} connect-button tw-web3button--connect-wallet tw-connect-wallet css-1un3lp3`}
        type="button" 
        style={{
          minWidth: '140px',
          ...(width
            ? {
              width: width,
              marginLeft: '10px',
              marginRight: '10px'
            } : {}
          ),
        }}
        onClick={(isLoading || disabled) ? () => {} : onClick}
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
      </a>
    </>
  )
}