import NftMedia from "./NftMedia"
import { useEffect, useState } from 'react'
import  fetch from "node-fetch"
import { ipfsUrl } from "/helpers/ipfsUrl"

export default function NftCardSceleton(props) {
  const {
    tokenInfo,
    price,
  } = props
  
  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#333] via-[#555] to-[#333] bg-cover animate-pulse max-h-full min-h-[12px] p-[2px] m-[2px]"
        style={{
          width: '335px',
          height: '437px',
          borderRadius: 'inherit',
        }}
      ></div>
    </>
  )
}