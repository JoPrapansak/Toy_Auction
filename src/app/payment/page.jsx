'use client'

import React, { useState } from 'react'
import NavUser from '../components/NavUser'
import { useSearchParams } from 'next/navigation'

function PaymentPage() {
  const searchParams = useSearchParams()
  const [selectedSlip, setSelectedSlip] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const name = searchParams.get('name')
  const price = searchParams.get('price')
  const quantity = searchParams.get('quantity') || 1

  const handleSlipUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedSlip(file)
      // Create preview URL for the image
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmitPayment = async () => {
    if (!selectedSlip) {
      alert('กรุณาแนบสลิปการโอนเงิน')
      return
    }
    // Add your payment submission logic here
  }

  return (
    <div>
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Product Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-600">สินค้า</p>
                <p className="font-semibold">{name}</p>
              </div>
              
              <div className="border-b pb-4">
                <p className="text-gray-600">จำนวน</p>
                <p className="font-semibold">{quantity} ชิ้น</p>
              </div>

              <div className="border-b pb-4">
                <p className="text-gray-600">ราคารวม</p>
                <p className="font-semibold text-xl text-blue-600">
                  {Number(price).toLocaleString()} บาท
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - QR Code Payment */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">สแกนเพื่อชำระเงิน</h2>
            
            <div className="text-center space-y-4">
              <img 
                src="/qr-code-example.png" 
                alt="QR Code Payment"
                className="mx-auto w-64 h-64"
              />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Number(price).toLocaleString()} บาท
                </p>
              </div>

              <div className="space-y-2 text-left">
                <p className="text-sm text-gray-600">
                  1. สแกน QR Code ด้วยแอปธนาคารของท่าน
                </p>
                <p className="text-sm text-gray-600">
                  2. ตรวจสอบจำนวนเงินให้ถูกต้อง
                </p>
                <p className="text-sm text-gray-600">
                  3. ยืนยันการชำระเงิน
                </p>
                <p className="text-sm text-gray-600">
                  4. แนบสลิปการโอนเงินด้านล่าง
                </p>
              </div>

              {/* Slip Upload Section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  แนบสลิปการโอนเงิน
                </label>
                <div className="mt-1 flex flex-col items-center space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipUpload}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  
                  {previewUrl && (
                    <div className="relative w-full max-w-[200px]">
                      <img
                        src={previewUrl}
                        alt="Payment Slip Preview"
                        className="rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => {
                          setSelectedSlip(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                          hover:bg-red-600 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button 
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                onClick={handleSubmitPayment}
                disabled={!selectedSlip}
              >
                ยืนยันการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage