'use client'

import React from 'react'
import Nav from '../components/Nav'
import { useSearchParams } from 'next/navigation'
import NavUser from '../components/์NavUser'

function ProductDetailsPage() {
  const searchParams = useSearchParams()
  
  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const image = searchParams.get('image')
  const price = searchParams.get('price')

  return (
    <div>
      <NavUser/>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{name}</h1>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ราคาเริ่มต้น</span>
                <span className="text-2xl font-bold">{price} บาท</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">เวลาที่เหลือ</span>
                <span className="text-2xl font-bold text-red-500">00:10:00</span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Bidding Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">ราคาประมูล</label>
                <input 
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  placeholder="ใส่ราคาที่ต้องการประมูล"
                  min={price}
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                ประมูลสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
