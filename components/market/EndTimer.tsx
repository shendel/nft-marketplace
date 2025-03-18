import { useEffect, useState } from "react"

const secondsToDhms = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

  return [dDisplay, hDisplay, mDisplay, sDisplay].join(` `)
}

export default function EndTimer(props) {
  const {
    title,
    finishTitle,
    utxNow,
    utxEnd
  } = {
    title: `Time left: `,
    finishTitle: `Time is out`,
    ...props
  }
  
  const [ utxTimer, setUtxTimer ] = useState(Number(utxNow))
  useEffect(() => {
    const timer = setInterval(() => {
      setUtxTimer(utxTimer + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  })
  
  const secondsLeft = (utxEnd - utxTimer)

  return (
    <div>
      {(secondsLeft > 0) ? (
        <>
          <div className="flex justify-evenly items-center">
            <strong>{title}</strong>
          </div>
          <div className="flex justify-evenly items-center">
            <strong>{secondsToDhms(secondsLeft)}</strong>
          </div>
        </>
      ) : (
        <div className="flex justify-evenly items-center">
          <strong>{finishTitle}</strong>
        </div>
      )}
    </div>
  )
}