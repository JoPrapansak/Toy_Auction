'use client'

import React, { useState, useEffect } from 'react'
import NavUser from '../components/NavUser'
import { useRouter } from 'next/navigation'

function MyAuctionsPage() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMyAuctions()
  }, [])

  const fetchMyAuctions = async () => {
    try {
      const response = await fetch('http://localhost:3111/api/v1/my-auctions', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.status === 'success') {
        setAuctions(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching auctions:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavUser />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">กำลังโหลด...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">สินค้าที่ฉันประมูล</h1>
          <button
            onClick={() => router.push('/create-auction')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + สร้างการประมูลใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={auction.image}
                alt={auction.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{auction.name}</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ราคาปัจจุบัน</span>
                    <span className="font-medium">{auction.currentPrice} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">จำนวนผู้เข้าร่วมประมูล</span>
                    <span className="font-medium">{auction.bidCount || 0} คน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">สถานะ</span>
                    <span className={`font-medium ${
                      auction.status === 'active' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดการประมูล'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/auction/${auction._id}`)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                >
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>

        {auctions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">คุณยังไม่มีสินค้าที่ประมูล</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAuctionsPage