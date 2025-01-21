'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider';


function HomePage() {
  const images = [
    { src: "/image/1.jpg" },
    { src: "/image/2.jpg" },
    { src: "/image/3.jpg" },
  ]
  return (
    <div>
      <Navbar/>
        <div className='container mx-auto px-4'>
            <h3 className='text-2xl my-3'>หมวดหมู่สินค้า</h3>
            <ImageSlider images={images} />
        </div>
    </div>
  )
}

export default HomePage
