'use client'

import React, { useState } from 'react'
import Nav from '../components/Nav'
import { useSearchParams } from 'next/navigation'
import NavUser from '../components/NavUser'
import Navbar from '../components/Navbar'

function ProductDetailsPage() {
  const searchParams = useSearchParams()
  const [showBidHistory, setShowBidHistory] = useState(false)
  
  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const image = searchParams.get('image')
  const price = searchParams.get('price')

  // Sample bid history data
  const bidHistory = [
    { id: 1, bidder: "John Doe", amount: 1500, date: "2024-01-15 14:30" },
    { id: 2, bidder: "Jane Smith", amount: 1400, date: "2024-01-15 14:25" },
    { id: 3, bidder: "Mike Brown", amount: 1300, date: "2024-01-15 14:20" },
  ]

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <span className="text-gray-600">ราคาปัจจุบัน</span>
                <span className="text-2xl font-bold text-green-600">1500 บาท</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">เวลาที่เหลือ</span>
                <span className="text-2xl font-bold text-red-500">00:10:00</span>
              </div>
            </div>

            {/* Bid History Button */}
            <div className="flex justify-end">
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={() => setShowBidHistory(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>ประวัติการประมูล</span>
              </button>
            </div>

            {/* Bid History Modal */}
            {showBidHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
                    <button 
                      onClick={() => setShowBidHistory(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="divide-y">
                    {bidHistory.map((bid) => (
                      <div key={bid.id} className="py-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{bid.bidder}</p>
                            <p className="text-sm text-gray-500">{bid.date}</p>
                          </div>
                          <p className="text-lg font-semibold">{bid.amount} บาท</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
            {/* Seller Information - Centered */}
            <div className="mt-8 flex justify-center">
              <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
                  <img
                    src="/image/profile1.jpg"
                    alt="Seller Profile"
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">ชื่อผู้ขาย</h3>
                    {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p> */}
                    <div className="flex items-center justify-center mt-1">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                    </div>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                    ติดต่อผู้ขาย
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
