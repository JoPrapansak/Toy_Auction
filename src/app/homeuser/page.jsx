'use client'

import React from 'react'
import Navbar from '../components/Navbar';
import NavUser from '../components/์NavUser';
import ImageSlider from '../components/ImageSlider';
import Product from '../product/page';
import { useSession } from 'next-auth/react';

function HomeUserpage() {
    const {data: session} = useSession()
    console.log(session);

const images = [
    { src: "/image/1.jpg" },
    { src: "/image/2.jpg" },
    { src: "/image/3.jpg" },
  ]
  return (
    <div>
      <NavUser session={session}/>
        <div className='container mx-auto px-4'>
            <h3 className='text-2xl my-3'>หมวดหมู่สินค้า {session?.user?.name}</h3>
            <ImageSlider images={images} />
        </div>
        <div className='container mx-auto px-4'>
            <Product/>
        </div>

    </div>
  )
}

export default HomeUserpage
