import React from 'react'
import Image from 'next/image'

function Logo() {
  return (
    <div className="absolute -top-5 -left-2 lg:-top-10 lg:-left-5">
      <Image 
        src="/image/Finvera-logo.png" 
        alt="Finvera Logo" 
        width={455} 
        height={80}
        className="h-28 sm:h-36 lg:h-52 w-auto object-contain"
        priority
      />
    </div>
  )
}

export default Logo
