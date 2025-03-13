'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavContact from '../components/NavContact'

function ProductDetailsPage() {
  const searchParams = useSearchParams()
  const [showBidHistory, setShowBidHistory] = useState(false)
  const [bidHistory, setBidHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState("กำลังโหลด...")
  const [startingPrice, setStartingPrice] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [bidAmount, setBidAmount] = useState("")
  const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidsPerPage] = useState(5);
  const router = useRouter()

  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const image = searchParams.get('image')

  // 📌 ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:3111/api/v1/auction/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const auction = data.data
          setStartingPrice(auction.startingPrice) // ✅ เก็บราคาเริ่มต้น
          setCurrentPrice(auction.currentPrice) // ✅ เก็บราคาปัจจุบัน
          setMinimumBidIncrement(auction.minimumBidIncrement);

          // ✅ ตั้งเวลาหมดอายุ
          const endTime = new Date(auction.expiresAt).getTime()
          const interval = setInterval(() => {
            const now = new Date().getTime()
            const diff = endTime - now;
            if (diff <= 0) {
              clearInterval(interval)
              setTimeLeft("หมดเวลา")
            } else {
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
              const minutes = Math.floor((diff / (1000 * 60)) % 60)
              const seconds = Math.floor((diff / 1000) % 60)
              setTimeLeft(`${hours}:${minutes}:${seconds}`)
            }
          }, 1000)
        }
      })
  }, [id])

  // 📌 ดึงประวัติการบิดจาก API
  const fetchBidHistory = async () => {
    if (!id) return
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include'
      })
      if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้')
      const data = await response.json()
      setBidHistory(data.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBid = async () => {
    // Check if user is logged in (you'll need to implement your own auth check)
    const isLoggedIn = false // Replace with your actual auth check
  
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการประมูล")
      router.push('/login')
      return
    }
  
    // Rest of your bidding logic...
    // if (!bidAmount || bidAmount < currentPrice) {
    //   alert("กรุณาใส่ราคาที่สูงกว่าหรือเท่ากับราคาปัจจุบัน")
    //   return
    // }
    if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
      alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
        body: JSON.stringify({ amount: Number(bidAmount) }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('ประมูลสำเร็จ!');
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด!');
    }
    // ... existing bid submission code
  }

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img src={image} alt={name} className="w-full h-auto object-cover"/>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{name}</h1>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ราคาเริ่มต้น</span>
                <span className="text-2xl font-bold">{startingPrice} บาท</span> {/* ✅ ใช้ startingPrice */}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">ราคาปัจจุบัน</span>
                <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span> {/* ✅ ใช้ currentPrice */}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">เวลาที่เหลือ</span>
                <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            {/* ปุ่มดูประวัติการประมูล */}
            <div className="flex justify-end">
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={() => { setShowBidHistory(true); fetchBidHistory(); }}
              >
                <span>ประวัติการประมูล</span>
              </button>
            </div>

            {/* Bid History Modal */}
            {showBidHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
                    <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
                      ✖
                    </button>
                  </div>
                  {loading ? (
                    <div className="text-center py-4">กำลังโหลด...</div>
                  ) : error ? (
                    <div className="text-center py-4 text-red-500">{error}</div>
                  ) : bidHistory.length === 0 ? (
                    <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
                  ) : (
                    <>
                      <div className="divide-y">
                        {currentBids.map((bid) => (
                          <div key={bid._id} className="py-4 flex justify-between">
                            <div>
                              <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(bid.date).toLocaleString('th-TH')}
                              </p>
                            </div>
                            <p className="text-lg font-semibold">{bid.amount} บาท</p>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-4">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === index + 1
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bidding Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">ราคาประมูล</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  min={currentPrice + minimumBidIncrement}
                />
                <p className="text-red-500 text-sm mt-1">
                  *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
                </p>
              </div>
              {/* <div>
                <label className="block text-gray-600 mb-2">ราคาประมูล</label>
                <input 
                  type="number"
                  className="w-full p-2 border rounded"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={currentPrice}
                  placeholder="ใส่ราคาที่ต้องการประมูล"
                />
                <p className="text-red-500 text-sm mt-1">
                  *ราคาประมูลขั้นต่ำ {currentPrice} บาท*
                </p>
              </div> */}
              <button 
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2" 
                onClick={handleBid}
              >
                ประมูลสินค้า
              </button>
            </div>
          </div>
          {/* Seller Information - Centered */}
          {/* <div className="mt-8 flex justify-center">
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
                    <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
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
            </div> */}
        </div>
      </div>
      <NavContact/>
    </div>
  )
}

export default ProductDetailsPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import NavContact from '../components/NavContact'

// function ProductDetailsPage() {
//   const searchParams = useSearchParams()
//   const [showBidHistory, setShowBidHistory] = useState(false)
//   const [bidHistory, setBidHistory] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [timeLeft, setTimeLeft] = useState("กำลังโหลด...")
//   const [startingPrice, setStartingPrice] = useState(0)
//   const [currentPrice, setCurrentPrice] = useState(0)
//   const [bidAmount, setBidAmount] = useState("")
//   const router = useRouter()

//   const id = searchParams.get('id')
//   const name = searchParams.get('name')
//   const image = searchParams.get('image')

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success") {
//           const auction = data.data
//           setStartingPrice(auction.startingPrice) // ✅ เก็บราคาเริ่มต้น
//           setCurrentPrice(auction.currentPrice) // ✅ เก็บราคาปัจจุบัน

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime()
//           const interval = setInterval(() => {
//             const now = new Date().getTime()
//             const diff = endTime - now
//             if (diff <= 0) {
//               clearInterval(interval)
//               setTimeLeft("หมดเวลา")
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
//               const minutes = Math.floor((diff / (1000 * 60)) % 60)
//               const seconds = Math.floor((diff / 1000) % 60)
//               setTimeLeft(`${hours}:${minutes}:${seconds}`)
//             }
//           }, 1000)
//         }
//       })
//   }, [id])

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return
//     setLoading(true)
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/history`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: 'include'
//       })
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้')
//       const data = await response.json()
//       setBidHistory(data.data || [])
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBid = async () => {
//     // Check if user is logged in (you'll need to implement your own auth check)
//     const isLoggedIn = false // Replace with your actual auth check
  
//     if (!isLoggedIn) {
//       alert("กรุณาเข้าสู่ระบบก่อนทำการประมูล")
//       router.push('/login')
//       return
//     }
  
//     // Rest of your bidding logic...
//     if (!bidAmount || bidAmount < currentPrice) {
//       alert("กรุณาใส่ราคาที่สูงกว่าหรือเท่ากับราคาปัจจุบัน")
//       return
//     }
  
//     // ... existing bid submission code
//   }

//   return (
//     <div>
//       <Navbar/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Product Image */}
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover"/>
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>
            
//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span> {/* ✅ ใช้ startingPrice */}
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span> {/* ✅ ใช้ currentPrice */}
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//               <p className="text-gray-600">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//             </div>

//             {/* ปุ่มดูประวัติการประมูล */}
//             <div className="flex justify-end">
//               <button 
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => { setShowBidHistory(true); fetchBidHistory(); }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             {/* Bid History Modal */}
//             {showBidHistory && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//                     <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                       ✖
//                     </button>
//                   </div>
                  
//                   {loading ? (
//                     <div className="text-center py-4">กำลังโหลด...</div>
//                   ) : error ? (
//                     <div className="text-center py-4 text-red-500">{error}</div>
//                   ) : bidHistory.length === 0 ? (
//                     <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//                   ) : (
//                     <div className="divide-y">
//                       {bidHistory.map((bid) => (
//                         <div key={bid._id} className="py-4 flex justify-between">
//                           <p>{bid.user.name}</p>
//                           <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Bidding Section */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input 
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                   min={currentPrice}
//                   placeholder="ใส่ราคาที่ต้องการประมูล"
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {currentPrice} บาท*
//                 </p>
//               </div>
//               <button 
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2" 
//                 onClick={handleBid}
//               >
//                 ประมูลสินค้า
//               </button>
//             </div>
//           </div>
//           {/* Seller Information - Centered */}
//           <div className="mt-8 flex justify-center">
//               <div className="bg-white p-6 rounded-lg w-96">
//                 <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//                   <img
//                     src="/image/profile1.jpg"
//                     alt="Seller Profile"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="text-center">
//                     <h3 className="font-medium">ชื่อผู้ขาย</h3>
//                     {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p> */}
//                     <div className="flex items-center justify-center mt-1">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-sm text-gray-500 ml-1">(5.0)</span>
//                     </div>
//                   </div>
//                   <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
//                     ติดต่อผู้ขาย
//                   </button>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>
//       <NavContact/>
//     </div>
//   )
// }

// export default ProductDetailsPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'

// function ProductDetailsPage() {
//   const searchParams = useSearchParams()
//   const [showBidHistory, setShowBidHistory] = useState(false)
//   const [bidHistory, setBidHistory] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [timeLeft, setTimeLeft] = useState("กำลังโหลด...")
//   const [startingPrice, setStartingPrice] = useState(0)
//   const [currentPrice, setCurrentPrice] = useState(0)

//   const id = searchParams.get('id')
//   const name = searchParams.get('name')
//   const image = searchParams.get('image')

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success") {
//           const auction = data.data
//           setStartingPrice(auction.startingPrice) // ✅ เก็บราคาเริ่มต้น
//           setCurrentPrice(auction.currentPrice) // ✅ เก็บราคาปัจจุบัน

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime()
//           const interval = setInterval(() => {
//             const now = new Date().getTime()
//             const diff = endTime - now
//             if (diff <= 0) {
//               clearInterval(interval)
//               setTimeLeft("หมดเวลา")
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
//               const minutes = Math.floor((diff / (1000 * 60)) % 60)
//               const seconds = Math.floor((diff / 1000) % 60)
//               setTimeLeft(`${hours}:${minutes}:${seconds}`)
//             }
//           }, 1000)
//         }
//       })
//   }, [id])

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return
//     setLoading(true)
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/history`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: 'include'
//       })
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้')
//       const data = await response.json()
//       setBidHistory(data.data || [])
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <Navbar/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Product Image */}
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover"/>
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>
            
//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span> {/* ✅ ใช้ startingPrice */}
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span> {/* ✅ ใช้ currentPrice */}
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             {/* ปุ่มดูประวัติการประมูล */}
//             <div className="flex justify-end">
//               <button 
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => { setShowBidHistory(true); fetchBidHistory(); }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             {/* Bid History Modal */}
//             {showBidHistory && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//                     <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                       ✖
//                     </button>
//                   </div>
                  
//                   {loading ? (
//                     <div className="text-center py-4">กำลังโหลด...</div>
//                   ) : error ? (
//                     <div className="text-center py-4 text-red-500">{error}</div>
//                   ) : bidHistory.length === 0 ? (
//                     <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//                   ) : (
//                     <div className="divide-y">
//                       {bidHistory.map((bid) => (
//                         <div key={bid._id} className="py-4 flex justify-between">
//                           <p>{bid.user.name}</p>
//                           <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ปิดการบิด และให้ Login ก่อน */}
//             <div className="space-y-4">
//               <div className="text-center">
//                 <p className="text-gray-600">ต้องเข้าสู่ระบบก่อนจึงจะสามารถประมูลได้</p>
//                 <Link href="/login">
//                   <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2">
//                     เข้าสู่ระบบเพื่อประมูล
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductDetailsPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Nav from '../components/Nav'
// import { useSearchParams } from 'next/navigation'
// import NavUser from '../components/NavUser'
// import Navbar from '../components/Navbar'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// function ProductDetailsPage() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [showBidHistory, setShowBidHistory] = useState(false)
//   const [bidHistory, setBidHistory] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [bidAmount, setBidAmount] = useState('')
  
//   const id = searchParams.get('id')
//   const name = searchParams.get('name')
//   const image = searchParams.get('image')
//   const price = searchParams.get('price')
//   const prices = searchParams.get('prices')
//   // const bids = searchParams.get('bids')

//   // Fetch bid history when modal opens
//   useEffect(() => {
//     const fetchBidHistory = async () => {
//       if (!showBidHistory || !id) return
      
//       setLoading(true)
//       try {
//         // Fix the URL template literal syntax
//         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/history`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // "Authorization": `Bearer ${token}`
//           },
//           // credentials: 'include'
//         })

//         if (!response.ok) {
//           throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้')
//         }

//         const data = await response.json()
//         setBidHistory(data.bids || [])
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchBidHistory()
//   }, [id, showBidHistory])

//   // Replace the static bid history modal content with dynamic data
//   const renderBidHistoryContent = () => {
//     if (loading) {
//       return <div className="text-center py-4">กำลังโหลด...</div>
//     }

//     if (error) {
//       return <div className="text-center py-4 text-red-500">{error}</div>
//     }

//     if (bidHistory.length === 0) {
//       return <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//     }

//     return (
//       <div className="divide-y">
//         {bidHistory.map((bids) => (
//           <div key={bids.data} className="py-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-medium">{bids.user}</p>
//                 <p className="text-sm text-gray-500">
//                   {new Date(bids.date).toLocaleString('th-TH')}
//                 </p>
//               </div>
//               <p className="text-lg font-semibold">{bids.amount} บาท</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   // Update the bid history modal section
//   const bidHistoryModal = showBidHistory && (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//           <button 
//             onClick={() => setShowBidHistory(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         {renderBidHistoryContent()}
//       </div>
//     </div>
//   )

//   const handleBid = () => {
//     if (status !== 'authenticated') {
//       alert('กรุณาเข้าสู่ระบบก่อนทำการประมูล')  // Add alert message
//       router.push('/login')
//       return
//     }

//     // Proceed with bidding logic if authenticated
//     // Add your bidding logic here
//   }

//   // Update your return statement to use the new bidHistoryModal
//   return (
//     <div>
//       <Navbar/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Product Image */}
//           <div className="rounded-lg overflow-hidden">
//             <img 
//               src={image} 
//               alt={name} 
//               className="w-full h-auto object-cover"
//             />
//           </div>

//           {/* Product Details */}
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>
            
//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{prices} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{price} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">00:10:00</span>
//               </div>
//             </div>

//             {/* Bid History Button */}
//             <div className="flex justify-end">
//               <button 
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => setShowBidHistory(true)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//                 </svg>
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             {/* Product Description */}
//             <div>
//               <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//               <p className="text-gray-600">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//                 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//               </p>
//             </div>


//             {/* Bidding Section */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input 
//                   type="number"
//                   className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
//                   placeholder="ใส่ราคาที่ต้องการประมูล"
//                   min={price}
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                 />
//               </div>
//               <button 
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//                 onClick={handleBid}
//               >
//                 ประมูลสินค้า
//               </button>
//             </div>
//           </div>
//             {/* Seller Information - Centered */}
//             <div className="mt-8 flex justify-center">
//               <div className="bg-white p-6 rounded-lg w-96">
//                 <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//                   <img
//                     src="/image/profile1.jpg"
//                     alt="Seller Profile"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="text-center">
//                     <h3 className="font-medium">ชื่อผู้ขาย</h3>
//                     {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p> */}
//                     <div className="flex items-center justify-center mt-1">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-sm text-gray-500 ml-1">(5.0)</span>
//                     </div>
//                   </div>
//                   <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
//                     ติดต่อผู้ขาย
//                   </button>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>
//       {bidHistoryModal}
//     </div>
//   )
// }

// export default ProductDetailsPage