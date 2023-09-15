import { defFooterMenus, sysMenus } from "/appconfig/menu"
import { getLink } from "/helpers/getLink"
import { getAssets } from "/helpers/getAssets"

export default function Footer(props) {
  
  const {
    isOwner,
    storageFooterMenu,
    isInstalled,
    getText
  } = props

  const menuItems = (storageFooterMenu && storageFooterMenu.length ? storageFooterMenu : defFooterMenus)
  
  return (
    <>
      <footer className="px-5 mt-20 w-full flex flex-col items-center pb-12 lg:h-[374px] md:justify-center">
        <div className="mt-8 flex flex-col md:flex-row items-center gap-8 md:gap-[34px]">
          {menuItems.map((menuItem, itemKey) => {
            const href = (menuItem.target !== ``) ? getLink(sysMenus[menuItem.target]) : menuItem.link
            
            return (
              <a 
                key={itemKey}
                className="font-bold text-moon-white tracking-wide hover:scale-105"
                href={href}
                {...(menuItem.blank ? { target: '_blank' } : {})}
              >
                {menuItem.title}
              </a>
            )
          })}
        </div>
        <p className="mt-11 text-center font-light text-moon-white opacity-50 text-sm tracking-wider">
          {getText('App_Footer', 'Copyright (c)')}
        </p>
      </footer>
    </>
  )
}