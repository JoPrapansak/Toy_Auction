'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

function ProductPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/auction')
        const data = await response.json()

        if (data.status === 'success') {
          setProducts(data.data)

          // คำนวณเวลาที่เหลือเริ่มต้น
          const initialTimeLeft = {}
          data.data.forEach(product => {
            initialTimeLeft[product._id] = calculateTimeLeft(product.expiresAt)
          })
          setTimeLeft(initialTimeLeft)

          // ตั้ง `setInterval` ให้นับเวลาถอยหลังทุกวินาที
          const interval = setInterval(() => {
            const updatedTimeLeft = {}
            data.data.forEach(product => {
              updatedTimeLeft[product._id] = calculateTimeLeft(product.expiresAt)
            })
            setTimeLeft(updatedTimeLeft)
          }, 1000)

          return () => clearInterval(interval) // เคลียร์เมื่อ Component Unmount
        } else {
          throw new Error('ไม่สามารถโหลดสินค้าประมูลได้')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 📌 ฟังก์ชันคำนวณเวลาที่เหลือ
  const calculateTimeLeft = (expiresAt) => {
    const endTime = new Date(expiresAt).getTime()
    const now = new Date().getTime()
    const diff = endTime - now

    if (diff <= 0) return "หมดเวลา"

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-2xl my-3">ประมูลสินค้า</h3>

      {loading ? (
        <p className="text-center">กำลังโหลด...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 shadow-md rounded-md">
              <Link
                href={{
                  pathname: '/productdetail',
                  query: {
                    id: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.currentPrice,
                    startingPrice: product.startingPrice, // ✅ ส่งไปด้วยเพื่อแสดงหน้า Detail
                  }
                }}
                legacyBehavior
              >
                <a>
                  <img src={product.image} alt={product.name} className="w-full h-auto mb-4 rounded-lg cursor-pointer"/>
                </a>
              </Link>
              <div className="mb-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
              </div>
              <div className="flex flex-col gap-1 justify-between">
                {/* <p className="text-sm text-gray-600">ราคาเริ่มต้น: <span className="font-semibold">{product.startingPrice} บาท</span></p> */}
                <p className="text-sm text-gray-600">ราคา: <span className="font-semibold">{product.currentPrice} บาท</span></p>
              </div>
              <div className="flex justify-between mt-2">
                <h3 className="text-lg font-semibold text-red-500">
                  {timeLeft[product._id] || "กำลังโหลด..."}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Nav from './Nav'
// import Navbar from './Navbar'
// import Link from 'next/link'

// function ProductPage() {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:3111/api/v1/auction", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
//         }

//         const data = await response.json();

//         // ✅ กรองเฉพาะรายการที่ยังเปิดอยู่ (status: "active")
//         const activeProducts = data.data.filter(product => product.status === "active");

//         setProducts(activeProducts);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts()
//   }, [])

//   if (loading) return (
//     <div className="container mx-auto px-4">
//       <div className="text-center py-8">กำลังโหลด...</div>
//     </div>
//   )
  
//   if (error) return (
//     <div className="container mx-auto px-4">
//       <div className="text-center py-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>
//     </div>
//   )

//   return (
//     <div>
//       <div className='container mx-auto px-4'>
//         <h3 className='text-2xl my-3'>ประมูลสินค้า</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
//           {products.map((product) => (
//             <div key={product._id} className="bg-white p-4 shadow-md rounded-md">
//               <Link href={{
//                 pathname: '/productdetail',
//                 query: { 
//                   id: product._id,
//                   name: product.name,
//                   image: product.image,
//                   price: product.currentPrice,
//                   prices: product.startingPrice,
//                   Date: product.Date,
//                   bids: product.bids,
//                 }
//               }} legacyBehavior>
//                 <a>
//                   <img src={product.image} alt={product.name} className="w-full h-auto mb-4 rounded-lg cursor-pointer"/>
//                 </a>
//               </Link>
//               <div className="mb-2">
//                 <h2 className="text-lg font-semibold">{product.name}</h2>
//               </div>
//               <div className="flex justify-between">
//                 <h3 className="text-lg font-semibold">{product.currentPrice} บาท</h3>
//                 <h3 className="text-lg font-semibold text-red-500">00:10:00</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductPage
