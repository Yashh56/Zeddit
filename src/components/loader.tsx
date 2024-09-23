import Image from 'next/image'
import React from 'react'

function Loader() {
    return (
        <div className="h-[100vh] mt-10 flex items-center justify-center">
            <Image src='https://i.gifer.com/ZKZg.gif' className='h-12 w-12' height={12} width={12} alt='' />
        </div>
    )
}

export default Loader


