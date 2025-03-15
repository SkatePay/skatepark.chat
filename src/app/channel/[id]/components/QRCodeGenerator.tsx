import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeGenerator() {
  const [currentURL, setCurrentURL] = useState('')

  useEffect(() => {
    setCurrentURL(window.location.href)
  }, [])

  return (
    <div className="flex flex-col items-center p-4">
      <QRCodeSVG
        value={currentURL}
        title={'Title for my QR Code'}
        size={128}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        level={'L'}
      />

      <p className="mt-2 text-gray-500">Scan this QR code to visit the domain.</p>
    </div>
  )
}
