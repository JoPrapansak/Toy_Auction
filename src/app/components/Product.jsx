'use client'

import React from 'react'
import Nav from './Nav'
// import
import Navbar from './Navbar'
import Link from 'next/link'

const products = [
  { id: 1, name: 'Bandai กันพลา กันดั้ม RG 1/144 GUNDAM EXIA', image: '/image/Product1.png', price: 1200},
  { id: 2, name: 'โมเดลฟิเกอร์ PVC ONE PUNCH-MAN Bald Saitama', image: '/image/Product2.jpg', price: 950},
  { id: 3, name: 'ตุ๊กตาคาปิบาร่า ขี้เซา', image: '/image/Product3.jpg', price: 450},
  { id: 4, name: 'Joker นั่ง Mafex Action Figure ทีมฆ่าตัวตาย Joker Supervillain', image: '/image/Product4.jpg', price: 800},
]

function ProductPage() {
  return (
    <div>
      <div className='container mx-auto px-4'>
        <h3 className='text-2xl my-3'>ประมูลสินค้า</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow-md rounded-md">
              <Link href={{
                pathname: '/productdetail',
                query: { 
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                }
              }} legacyBehavior>
                <a>
                  <img src={product.image} alt={product.name} className="w-full h-auto mb-4 rounded-lg cursor-pointer"/>
                </a>
              </Link>
              <div className="mb-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
              </div>
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{product.price} บาท</h3>
                <h3 className="text-lg font-semibold text-red-500">00:10:00</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
