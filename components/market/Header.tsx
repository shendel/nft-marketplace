
export default function Header(props) {
  const links = [
    {
      title: 'Link 1',
      href: 'https://ya.ru',
      target: '_blank',
    },
    {
      title: 'Buy',
      href: './market'
    },
    {
      title: 'Sell',
      href: './sell'
    }
  ]
  return (
    <>
      <div className="py-4 pl-4 pr-3 relative z-50 md:bg-white md:bg-opacity-5 lg:py-5 lg:px-[30px]">
        <div></div>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-7 xl:gap-9 2xl:gap-11">
            <a className="lg:hidden" href="https://market.moondao.com/">
              <span>[LOGO]</span>
            </a>
            <a className="hidden lg:block" href="https://market.moondao.com/">
              <span>[LOGO]</span>
            </a>
          </div>
          {/* Mobile menu */}
          <div className="flex gap-4 sm:items-center md:hidden z-50">
            <div className="">
              <button className="hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.25 18.6h19.5M3.25 13.182h19.5M3.25 7.766h19.5"></path>
                </svg>
              </button>
              <ul className="hidden text-gray-200 transition-all flex border border-gray-100 border-opacity-40 shadow shadow-white flex-col items-start px-6 gap-12 py-5 duration-150 top-2 right-2 z-10 h-[250px] w-[280px] bg-slate-900 rounded-xl absolute">
                <button className="absolute right-4 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.25 18.6h19.5M3.25 13.182h19.5M3.25 7.766h19.5"></path>
                  </svg>
                </button>
                <li>
                  <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg">Link 1</a>
                </li>
                <li>
                  <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg">Link 2</a>
                </li>
                <li>
                  <button className="hover:scale-105 hover:text-orange-500 inline-block text-lg">Buy</button>
                </li>
                <li>
                  <button className="hover:scale-105 hover:text-orange-500 inline-block text-lg">Sell</button>
                </li>
                <li>
                  <button className="!px-5 !rounded-[2px] tw-connect-wallet css-1un3lp3" data-theme="dark" data-is-loading="false" type="button" _style="min-width:140px" aria-label="Connect Wallet" data-test="connect-wallet-button">Connect Wallet</button>
                </li>
              </ul>
            </div>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="flex gap-7 lg:gap-9 xl:gap-14 2xl:gap-16">
              <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150" href="https://market.moondao.com/buy">Link 1</a>
              <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150" href="https://market.moondao.com/buy">Link 2</a>
              <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150" 
                href="./market">Buy</a>
              <a className="hover:scale-105 hover:text-orange-500 inline-block text-lg lg:text-xl transition-all duration-150" href="https://market.moondao.com/sell">Sell</a>
            </div>
            <div className="ml-6 lg:ml-8 xl:ml-10 2xl:ml-12">
              <button className="connect-button tw-connect-wallet css-1un3lp3" data-theme="dark" data-is-loading="false" type="button" _style="min-width:140px" aria-label="Connect Wallet" data-test="connect-wallet-button">Connect Wallet</button>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}