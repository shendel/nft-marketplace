import NftCardLoaded from "./NftCardLoaded"
import NftCardSceleton from "./NftCardSceleton"

export default function NftCard(props) {
  const {
    mediaUrl,
  } = props

  console.log('>>>mediaUrl', mediaUrl)

  return (mediaUrl !== false) // @To-Do check sceleton
    ? (<NftCardLoaded {...props} />)
    : (<NftCardSceleton {...props} />)
}