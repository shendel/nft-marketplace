export default function AddressBlock(props) {
  const {
    address,
    label,
  } = props
  
  const sellerAddress = (address) ? `${address.substr(0,8)}...${address.substr(-4,4)}` : `...`
  const sellerColorOne = (address) ? address.substr(2,6) : `D194B9`
  const sellerColorTwo = (address) ? address.substr(-6,6) : `52D29D`

  return (
    <div className="flex items-center mb-2 mt-6 gap-2 transition-opacity duration-200 ease-in-out mx-4">
      <div 
        className="mt-4 w-[48px] h-[48px] rounded-[50%] opacity-90 border-2 border-white border-opacity-20"
        style={{
          background: `linear-gradient(45deg, #${sellerColorOne}, #${sellerColorTwo})`,
        }}
      ></div>
      <div className="m-0 p-0 ml-[6px] flex flex-col h-full mt-4">
        <div>
          <p className="text-white opacity-60 mt-1 p-[2px]">{label}</p>
          <p className="font-semibold m-0 text-white text-opacity-90">
            {sellerAddress}
          </p>
        </div>
      </div>
    </div>
  )
}