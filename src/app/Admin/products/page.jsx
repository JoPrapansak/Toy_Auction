'use client'

import React, { useEffect, useState } from 'react'
import NavAdmin from '../../components/NavAdmin'

const API_URL = "http://localhost:3111/api/v1/admin"

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // ✅ ติดตามภาพปัจจุบันแต่ละสินค้า
  const [auctions, setAuctions] = useState([])
  
  useEffect(() => {
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    try {
      const response = await fetch(`${API_URL}/auctions`)
      const data = await response.json()
      setAuctions(data.auctions)
    } catch (error) {
      console.error("Error fetching auctions:", error)
    }
  }
    

  const handleDelete = async (id) => {
    const confirmed = confirm("คุณต้องการลบสินค้านี้หรือไม่?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/auctions/${id}`,{
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      setAuctions(auctions.filter((auction) => auction._id !== id));
      alert("✅ ลบสินค้าสำเร็จ");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ ลบสินค้าสำเร็จ");
    }
  }


  // const mockProducts = [
  //   {
  //     id: 1,
  //     image: 'https://via.placeholder.com/50',
  //     name: 'Product A',
  //     price: '100 ฿',
  //     status: 'In Stock',
  //   },
  //   {
  //     id: 2,
  //     image: 'https://via.placeholder.com/50',
  //     name: 'Product B',
  //     price: '200 ฿',
  //     status: 'Out of Stock',
  //   },
  //   {
  //     id: 3,
  //     image: 'https://via.placeholder.com/50',
  //     name: 'Product C',
  //     price: '150 ฿',
  //     status: 'In Stock',
  //   },
  // ]

  return (
    <div>
      {/* <NavAdmin /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">จัดการสินค้า</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 flex justify-between items-center">
            <input
              type="search"
              placeholder="ค้นหาสินค้า..."
              className="p-2 border rounded-lg w-64"
            />
            {/* <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              เพิ่มสินค้าใหม่
            </button> */}
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รูปภาพ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อสินค้า
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่จบประมูล
                  </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคาเปิด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคาปิด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auctions.map((auction, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <img src={auction.image?.[0] ?? '/default-image.jpg'} alt={auction.name} className="w-12 h-12" />
                  </td>
                  <td className="px-6 py-4">{auction.name}</td>
                  {/* <td className="px-6 py-4">{auction.currentPrice}</td> */}
                  <td className="px-6 py-4">{auction.startingPrice}</td>
                  <td className="px-6 py-4">{auction.currentPrice}</td>
                  <td className="px-6 py-4">{auction.status}</td>
                  {/* <td className="px-6 py-4">{auction.currentPrice}</td> */}
                  <td className="px-6 py-4">
                    {/* <button className="text-blue-500 border border-blue-500 px-2 py-1 rounded ml-4">
                      Edit
                    </button> */}
                    <button 
                      onClick={() => handleDelete(auction._id)}
                      className="text-red-500 border border-red-500 px-2 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState, useEffect } from 'react'

// const API_URL = "http://localhost:3111/api/v1/admin"

// export default function AuctionsPage() {
//   const [auctions, setAuctions] = useState([])

//   useEffect(() => {
//     fetchAuctions()
//   }, [])

//   const fetchAuctions = async () => {
//     try {
//       const response = await fetch(`${API_URL}/auctions`)
//       const data = await response.json()
//       setAuctions(data.auctions)
//     } catch (error) {
//       console.error("Error fetching auctions:", error)
//     }
//   }

//   const handleDeleteAuction = async (id) => {
//     const confirmed = confirm("คุณต้องการลบการประมูลนี้หรือไม่?");
//     if (!confirmed) return;

//     try {
//       const response = await fetch(`${API_URL}/auctions/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete auction");
//       }

//       setAuctions(auctions.filter((auction) => auction._id !== id));
//       alert("✅ ลบการประมูลสำเร็จ");
//     } catch (err) {
//       console.error("Error deleting auction:", err);
//       alert("❌ ลบการประมูลไม่สำเร็จ");
//     }
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">จัดการการประมูล</h1>
//       <div className="bg-white rounded-lg shadow">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อ</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคาเริ่มต้น</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคาสุดท้าย</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {auctions.map((auction, idx) => (
//               <tr key={idx}>
//                 <td className="px-6 py-4">{auction.name}</td>
//                 <td className="px-6 py-4">{auction.startingPrice}</td>
//                 <td className="px-6 py-4">{auction.finalPrice}</td>
//                 <td className="px-6 py-4">{auction.status}</td>
//                 <td className="px-6 py-4">
//                   <button
//                     onClick={() => handleDeleteAuction(auction._id)}
//                     className="text-red-500 border border-red-500 px-2 py-1 rounded"
//                   >
//                     ลบ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {auctions.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="text-center text-gray-400 py-4">
//                   ไม่มีรายการประมูล
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }



// 'use client'

// import React, { useState } from 'react'
// import NavAdmin from '../../components/NavAdmin'

// export default function ProductsPage() {
//   return (
//     <div>
//       {/* <NavAdmin /> */}
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">จัดการสินค้า</h1>
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-4 flex justify-between items-center">
//             <input
//               type="search"
//               placeholder="ค้นหาสินค้า..."
//               className="p-2 border rounded-lg w-64"
//             />
//             {/* <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
//               เพิ่มสินค้าใหม่
//             </button> */}
//           </div>
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   รูปภาพ
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ชื่อสินค้า
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ราคา
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   สถานะ
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   จัดการ
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {/* Add product rows here */}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }
