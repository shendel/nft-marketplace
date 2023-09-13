import { useEffect, useState } from "react"

export default function IndexGallery() {
  const items = [
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/9.png',
      title: 'item 1'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/10.png',
      title: 'item 2'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/11.png',
      title: 'item 3'
    },
    {
      href: '#',
      url: 'https://ipfs.io/ipfs/QmNQiyvtfvHV4oKQuwZfRhFjX9yoE64wuPWimckt3cvCWH/12.png',
      title: 'item 4'
    },
  ]
  
  const [ activeItemIndex, setActiveItemIndex ] = useState(0)
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newIndex = activeItemIndex+1
      setActiveItemIndex((newIndex < items.length) ? newIndex : 0)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [activeItemIndex])
  
  return (
    <div className="flex flex-col items-center relative md:-mt-32 xl:-mt-16 2xl:-mt-0">
      <a href={items[activeItemIndex].href}>
        <img 
          className="w-[290px] hover:ring xl:hover:ring-4 ring-moon-orange transition-all duration-300 h-[362px] lg:h-[443.38px] xl:h-[499.58px] 2xl:h-[564px]  object-cover lg:w-[355px] xl:w-[400px] 2xl:w-[536px]  rounded-tl-[99px] rounded-br-[99px]"
          src={items[activeItemIndex].url}
          alt="Hero Image"
          width="290"
          height="362"
        />
      </a>
      <div className="mt-8 flex gap-5 lg:ml-12 lg:mt-6">
        {items.map((item, index) => {
          return (
            <button className={`${(index == activeItemIndex) ? 'bg-moon-secondary' : 'bg-white bg-opacity-20'} transition-all duration-150 w-11 lg:w-8 2xl:w-11 h-1 xl:h-[6px] rounded`}></button>
          )
        })}
      </div>
    </div>
  )
}