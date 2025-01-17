'use client'

import React from 'react'
import Navbar from '../components/Navbar'

function HomePage() {
  return (
    <div>
      <Navbar/>
        <div className='container mx-auto px-4'>
            <h3 className='text-2xl my-3'>หมวดหมู่สินค้า</h3>
        </div>
    </div>
  )
}

export default HomePage
