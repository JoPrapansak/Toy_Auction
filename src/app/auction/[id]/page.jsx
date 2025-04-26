'use client'

import React, { useState, useEffect } from 'react'
import NavUser from '../../components/NavUser'
import { useParams } from 'next/navigation'

const API_URL = "http://localhost:3111/api/v1"
const socket = io("http://localhost:3111");

function AuctionDetailPage() {
  const [auction, setAuction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()

  useEffect(() => {
    fetchAuctionDetail()
  }, [])

  const fetchAuctionDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/${params.id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.status === 'success') {
        setAuction(data.data)
      } else {
        throw new Error(data.message || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-bold text-gray-600 animate-pulse">กำลังโหลด...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavUser />
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={auction.image}
            alt={auction.name}
            className="w-full h-96 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{auction.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-gray-600">{auction.description}</p>
                <div className="border-t pt-4 space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">ราคาเริ่มต้น</span>
                    <span className="font-medium">{auction.startingPrice} บาท</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">ราคาปัจจุบัน</span>
                    <span className="font-medium text-blue-500">{auction.currentPrice} บาท</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">สถานะ</span>
                    <span className={`font-medium ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดแล้ว'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="border-l pl-6">
                <h2 className="text-xl font-semibold mb-4">ประวัติการบิด</h2>
                <div className="space-y-2">
                  {auction.bids?.map((bid) => (
                    <div key={bid._id} className="flex justify-between items-center">
                      <span className="text-gray-600">{bid.bidder.username}</span>
                      <span className="font-medium">{bid.amount} บาท</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetailPage