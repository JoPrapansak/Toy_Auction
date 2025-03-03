'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import NavContact from '../components/NavContact'
import { useSession } from 'next-auth/react'

function HomePage() {
  const { data: session } = useSession()

  return (
    <div>
      <Navbar session={session}/>
      <div className='container mx-auto px-4'>
        {/* <h3 className='text-2xl my-3'>หมวดหมู่สินค้า {session?.user?.name}</h3> */}
        <ImageSlider />
      </div>
      <div className='container mx-auto px-4 mb-16'>
        <Product/>
      </div>
      <NavContact/>
    </div>
  )
}

export default HomePage
