'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

function Bidpage() {
    const searchParams = useSearchParams()
    // const [product, serProduct] = useState(null)
    // const [showCard, setShowCard] = useState(false)

    useEffect(() => {
        const id = searchParams.get('id')
        const name = searchParams.get('name')
        const image = searchParams.get('image')
        const price = searchParams.get('price')

        if(id && name && image && price ){ searchParams({id, name, image, price})
        }
        }, [searchParams])
    
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img src={product?.image} alt={product?.name} className="w-full h-auto"/>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{product?.name}</h1>
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ราคาเริ่มต้น</span>
                <span className="text-xl font-semibold">{product?.price} บาท</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">เวลาที่เหลือ</span>
                <span className="text-xl font-semibold text-red-500">00:10:00</span>
              </div>
            </div>

            {/* Bidding Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">ราคาประมูล</label>
                <input 
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  placeholder="ใส่ราคาที่ต้องการประมูล"
                  min={product?.price}
                />
              </div>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
                ประมูล
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bidpage
