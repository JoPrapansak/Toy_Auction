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
        const response = await fetch("http://localhost:3111/api/v1/auction", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
    
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้")
        }
    
        const data = await response.json()

        // ✅ กรองเฉพาะสินค้าที่กำลังเปิดประมูล
        const activeProducts = data.data.filter(product => product.status === "active")
        setProducts(activeProducts)

        // ✅ เริ่มต้นคำนวณเวลาคงเหลือ
        const initialTimeLeft = {}
        activeProducts.forEach(product => {
          initialTimeLeft[product._id] = calculateTimeLeft(product.expiresAt)
        })
        setTimeLeft(initialTimeLeft)

        // ✅ ใช้ `setInterval` ให้นับเวลาถอยหลังทุกวินาที
        const interval = setInterval(() => {
          const updatedTimeLeft = {}
          activeProducts.forEach(product => {
            updatedTimeLeft[product._id] = calculateTimeLeft(product.expiresAt)
          })
          setTimeLeft(updatedTimeLeft)
        }, 1000)

        return () => clearInterval(interval) // เคลียร์ `setInterval` เมื่อ Component Unmount
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 📌 ฟังก์ชันคำนวณเวลาคงเหลือ
  const calculateTimeLeft = (expiresAt) => {
    const endTime = new Date(expiresAt).getTime()
    const now = new Date().getTime()
    const diff = endTime - now

    if (diff <= 0) return "หมดเวลา"

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0')
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  if (loading) return <div className="text-center py-8">กำลังโหลด...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-2xl my-3"style={{ fontFamily: "'Mali',sans-serif"}}>ประมูลสินค้า</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 shadow-md rounded-md">
            <Link
              href={{
                pathname: '/productdetails',
                query: { 
                  id: product._id,
                  name: product.name,
                  image: product.image,
                  price: product.currentPrice,
                  prices: product.startingPrice,
                  Date: product.expiresAt,
                  bids: product.bids.length,
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
            <div className="flex justify-between">
              {/* <p className="text-md text-black">ราคาเริ่มต้น: <span className="font-semibold">{product.startingPrice} บาท</span></p> */}
              <p className="text-md text-black">ราคา: <span className="font-semibold">{product.currentPrice} บาท</span></p>
              <p className="text-md text-red-500 font-semibold">{timeLeft[product._id] || "กำลังโหลด..."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Nav from '../components/Nav'
// import Navbar from '../components/Navbar'
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

//   if (loading) {
//     return (
//       <div className="text-center">
//         <div className='p-4'>Loading...</div>
//         <img 
//           alt="Loading" 
//           src='https://i.pinimg.com/originals/f2/9f/02/f29f025c9ff5297e8083c52b01f1a709.gif'
//           className="mx-auto w-24 h-24" // Added for better sizing and centering
//         />
//       </div>
//     )
//   }
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <div className='container mx-auto px-4'>
//         <h3 className='text-2xl my-3'>ประมูลสินค้า</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
//           {products.map((product) => (
//             <div key={product._id} className="bg-white p-4 shadow-md rounded-md">
//               <Link href={{
//                 pathname: '/productdetails',
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

// // ✅ ฟังก์ชันดึง Token จากคุกกี้
// // const getCookie = (name) => {
// //   const cookies = document.cookie.split("; ");
// //   const cookie = cookies.find(row => row.startsWith(name + "="));
// //   return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
// // };

// export default ProductPage;
