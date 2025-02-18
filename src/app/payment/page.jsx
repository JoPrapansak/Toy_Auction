// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'
// import { useSearchParams } from 'next/navigation'

// function PaymentPage() {
//   const searchParams = useSearchParams()
//   const [selectedSlip, setSelectedSlip] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const [paymentMethod, setPaymentMethod] = useState('qr')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [cardDetails, setCardDetails] = useState({
//     number: '',
//     name: '',
//     expiry: '',
//     cvv: ''
//   })
//   const name = searchParams.get('name')
//   const price = searchParams.get('price')
//   const quantity = searchParams.get('quantity') || 1

//   const handleSlipUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       setSelectedSlip(file)
//       // Create preview URL for the image
//       const url = URL.createObjectURL(file)
//       setPreviewUrl(url)
//     }
//   }

//   const handleSubmitPayment = async () => {
//     if (!selectedSlip) {
//       alert('กรุณาแนบสลิปการโอนเงิน')
//       return
//     }
//     // Add your payment submission logic here
//   }

//   const paymentMethods = [
//     {
//       id: 'qr',
//       name: 'QR PromptPay',
//       icon: '/images/promptpay-logo.png'
//     },
//     {
//       id: 'credit',
//       name: 'บัตรเครดิต/เดบิต',
//       icon: '/images/credit-card.png'
//     },
//     {
//       id: 'truemoney',
//       name: 'TrueMoney Wallet',
//       icon: '/images/truemoney.png'
//     }
//   ]

//   const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod)

//   const renderPaymentMethodContent = () => {
//     switch(paymentMethod) {
//       case 'credit':
//         return (
//           <div className="space-y-4 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 หมายเลขบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.number}
//                 onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
//                 placeholder="0000 0000 0000 0000"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 maxLength="19"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ชื่อบนบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.name}
//                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
//                 placeholder="JOHN DOE"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   วันหมดอายุ
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.expiry}
//                   onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
//                   placeholder="MM/YY"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="5"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.cvv}
//                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
//                   placeholder="123"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="3"
//                 />
//               </div>
//             </div>
//           </div>
//         )
      
//       case 'qr':
//       case 'truemoney':
//         return (
//           <>
//             <div className="mt-6">
//               <img 
//                 src={paymentMethod === 'qr' ? "/qr-code-example.png" : "/truemoney-qr.png"}
//                 alt="QR Code Payment"
//                 className="mx-auto w-64 h-64 border-2 border-gray-200 p-2 rounded-lg"
//               />
//             </div>

//             <div className="space-y-2 mt-4 text-left">
//               <p className="text-sm text-gray-600">
//                 1. สแกน QR Code ด้วย{paymentMethod === 'qr' ? 'แอปธนาคาร' : 'TrueMoney Wallet'}
//               </p>
//               <p className="text-sm text-gray-600">
//                 2. ตรวจสอบจำนวนเงินให้ถูกต้อง
//               </p>
//               <p className="text-sm text-gray-600">
//                 3. ยืนยันการชำระเงิน
//               </p>
//               <p className="text-sm text-gray-600">
//                 4. แนบสลิปการโอนเงินด้านล่าง
//               </p>
//             </div>
//           </>
//         )
//     }
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left Side - Product Details */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
//             <div className="space-y-4">
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">สินค้า</p>
//                 <p className="font-semibold">{name}</p>
//               </div>
              
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">จำนวน</p>
//                 <p className="font-semibold">{quantity} ชิ้น</p>
//               </div>

//               <div className="border-b pb-4">
//                 <p className="text-gray-600">ราคารวม</p>
//                 <p className="font-semibold text-xl text-blue-600">
//                   {Number(price).toLocaleString()} บาท
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Payment Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            
//             <div className="space-y-6">
//               {/* Payment Method Dropdown */}
//               <div className="relative">
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <img 
//                       src={selectedPaymentMethod.icon} 
//                       alt={selectedPaymentMethod.name}
//                       className="h-8 w-8"
//                     />
//                     <span className="font-medium">{selectedPaymentMethod.name}</span>
//                   </div>
//                   <svg 
//                     className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
//                     {paymentMethods.map((method) => (
//                       <button
//                         key={method.id}
//                         className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition"
//                         onClick={() => {
//                           setPaymentMethod(method.id)
//                           setIsDropdownOpen(false)
//                         }}
//                       >
//                         <img src={method.icon} alt={method.name} className="h-8 w-8" />
//                         <span className="font-medium">{method.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Rest of the payment section */}
//               <div className="mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {Number(price).toLocaleString()} บาท
//                   </p>
//                 </div>

//                 {renderPaymentMethodContent()}

//                 {/* Show slip upload only for QR and TrueMoney */}
//                 {(paymentMethod === 'qr' || paymentMethod === 'truemoney') && (
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       แนบสลิปการโอนเงิน
//                     </label>
//                     <div className="mt-1 flex flex-col items-center space-y-4">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleSlipUpload}
//                         className="w-full text-sm text-gray-500
//                           file:mr-4 file:py-2 file:px-4
//                           file:rounded-full file:border-0
//                           file:text-sm file:font-semibold
//                           file:bg-blue-50 file:text-blue-700
//                           hover:file:bg-blue-100"
//                       />
                      
//                       {previewUrl && (
//                         <div className="relative w-full max-w-[200px]">
//                           <img
//                             src={previewUrl}
//                             alt="Payment Slip Preview"
//                             className="rounded-lg shadow-md"
//                           />
//                           <button
//                             onClick={() => {
//                               setSelectedSlip(null)
//                               setPreviewUrl(null)
//                             }}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
//                               hover:bg-red-600 transition"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <button 
//                   className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition mt-6"
//                   onClick={handleSubmitPayment}
//                   disabled={paymentMethod === 'credit' ? 
//                     !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv :
//                     !selectedSlip}
//                 >
//                   ยืนยันการชำระเงิน
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaymentPage

'use client'

import React, { useState } from 'react'
import NavUser from '../components/NavUser'
import { useSearchParams } from 'next/navigation'

function PaymentPage() {
  const searchParams = useSearchParams()
  const [selectedSlip, setSelectedSlip] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('qr')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
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

  const paymentMethods = [
    {
      id: 'qr',
      name: 'QR PromptPay',
      icon: '/image/promptpay.png'
    },
    {
      id: 'credit',
      name: 'บัตรเครดิต/เดบิต',
      icon: '/image/iconscreditcard.png'
    },
    {
      id: 'truemoney',
      name: 'TrueMoney Wallet',
      icon: '/image/truewallet.png'
    }
  ]

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod)

  const renderPaymentMethodContent = () => {
    switch(paymentMethod) {
      case 'credit':
        return (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมายเลขบัตร
              </label>
              <input
                type="text"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                placeholder="0000 0000 0000 0000"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength="19"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อบนบัตร
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                placeholder="JOHN DOE"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันหมดอายุ
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  placeholder="123"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        )
      
      case 'qr':
      case 'truemoney':
        return (
          <>
            <div className="mt-6">
              <img 
                src={paymentMethod === 'qr' ? "/qr-code-example.png" : "/truemoney-qr.png"}
                alt="QR Code Payment"
                className="mx-auto w-64 h-64 border-2 border-gray-200 p-2 rounded-lg"
              />
            </div>

            <div className="space-y-2 mt-4 text-left">
              <p className="text-sm text-gray-600">
                1. สแกน QR Code ด้วย{paymentMethod === 'qr' ? 'แอปธนาคาร' : 'TrueMoney Wallet'}
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
          </>
        )
    }
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

              {/* Add Shipping Address Section */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">ที่อยู่จัดส่ง</h3>
                <div>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="ระบุที่อยู่จัดส่ง เช่น บ้านเลขที่ ถนน ตำบล/แขวง อำเภอ/เขต จังหวัด รหัสไปรษณีย์"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            
            <div className="space-y-6">
              {/* Payment Method Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedPaymentMethod.icon} 
                      alt={selectedPaymentMethod.name}
                      className="h-8 w-8"
                    />
                    <span className="font-medium">{selectedPaymentMethod.name}</span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition"
                        onClick={() => {
                          setPaymentMethod(method.id)
                          setIsDropdownOpen(false)
                        }}
                      >
                        <img src={method.icon} alt={method.name} className="h-8 w-8" />
                        <span className="font-medium">{method.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rest of the payment section */}
              <div className="mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Number(price).toLocaleString()} บาท
                  </p>
                </div>

                {renderPaymentMethodContent()}

                {/* Show slip upload only for QR and TrueMoney */}
                {(paymentMethod === 'qr' || paymentMethod === 'truemoney') && (
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
                )}

                <button 
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition mt-6"
                  onClick={handleSubmitPayment}
                  disabled={paymentMethod === 'credit' ? 
                    !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv :
                    !selectedSlip}
                >
                  ยืนยันการชำระเงิน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage