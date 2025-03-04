// 'use client'; 

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useRouter } from 'next/navigation';
// import { io } from 'socket.io-client';

// const API_URL = "http://localhost:3111/api/v1";
// const socket = io("http://localhost:3111");

// function MyAuctionsPage() {
//   const [myBids, setMyBids] = useState([]);
//   const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchMyBids();
//     fetchMyCreatedAuctions();
    
//     socket.on("bid_update", (data) => {
//       setMyBids(prev => prev.map(bid => 
//         bid.auction?._id === data.auctionId 
//           ? { ...bid, auction: { ...bid.auction, currentPrice: data.highestBid } }
//           : bid
//       ));
//     });

//     return () => {
//       socket.off("bid_update");
//     };
//   }, []);

//   const fetchMyBids = async () => {
//     try {
//       const response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
//       const data = await response.json();
//       if (data.status === 'success') {
//         setMyBids(data.data || []);
//       }
//     } catch (error) {
//       setError('ไม่สามารถโหลดข้อมูลการบิดของคุณได้');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMyCreatedAuctions = async () => {
//     try {
//       const response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
//       const data = await response.json();
//       if (data.status === 'success') {
//         setMyCreatedAuctions(data.data || []);
//       }
//     } catch (error) {
//       setError('ไม่สามารถโหลดข้อมูลการประมูลของคุณได้');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-lg font-bold text-gray-600 animate-pulse">กำลังโหลด...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">ประวัติการบิดและการสร้างการประมูลของฉัน</h1>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         <h2 className="text-xl font-semibold text-gray-800 mt-8">การประมูลที่ฉันสร้าง</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//           {myCreatedAuctions.map((auction) => (
//             <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-2">{auction.name}</h2>
//                 <div className="text-gray-600 space-y-2">
//                   <p className="flex justify-between">
//                     <span>ราคาตั้งต้น</span>
//                     <span className="font-medium text-blue-500">{auction.startingPrice} บาท</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span>ราคาปัจจุบัน</span>
//                     <span className="font-medium text-blue-500">{auction.currentPrice} บาท</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span>สถานะ</span>
//                     <span className={`font-medium ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
//                       {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดแล้ว'}
//                     </span>
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => router.push(`${API_URL}/auction/${auction._id}`)}
//                   className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                 >
//                   ดูรายละเอียด
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <h2 className="text-xl font-semibold text-gray-800 mt-8">ประวัติการบิด</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//           {myBids.map((bid) => (
//             <div key={bid._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-2">{bid.auction?.name || 'ไม่พบข้อมูลสินค้า'}</h2>
//                 <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
//                 <button
//                   onClick={() => router.push(`${API_URL}/auction/${bid.auction._id}`)}
//                   className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                 >
//                   ดูรายละเอียด
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyAuctionsPage;


//VJo
// 'use client'

// import React, { useState, useEffect } from 'react'
// import NavUser from '../components/NavUser'
// import { useRouter } from 'next/navigation'

// function MyAuctionsPage() {
//   const [auctions, setAuctions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     fetchMyAuctions()
//   }, [])

//   const fetchMyAuctions = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/auction', {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: 'include'
//       })
//       const data = await response.json()
//       if (data.status === 'success') {
//         setAuctions(data.data)
//       }
//       setLoading(false)
//     } catch (error) {
//       console.error('Error fetching auctions:', error)
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <NavUser />
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">กำลังโหลด...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">สินค้าที่ฉันประมูล</h1>
//           <button
//             onClick={() => router.push('/create-auction')}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             + สร้างการประมูลใหม่
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {auctions.map((auction) => (
//             <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden">
              // <img
              //   src={auction.image}
              //   alt={auction.name}
              //   className="w-full h-48 object-cover"
              // />
//               <div className="p-4">
//                 <h2 className="text-xl font-semibold mb-2">{auction.name}</h2>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">ราคาปัจจุบัน</span>
//                     <span className="font-medium">{auction.currentPrice} บาท</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">จำนวนผู้เข้าร่วมประมูล</span>
//                     <span className="font-medium">{auction.bidCount || 0} คน</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">สถานะ</span>
//                     <span className={`font-medium ${
//                       auction.status === 'active' ? 'text-green-500' : 'text-red-500'
//                     }`}>
//                       {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดการประมูล'}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => router.push(`/auction/${auction._id}`)}
//                   className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
//                 >
//                   ดูรายละเอียด
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {auctions.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500">คุณยังไม่มีสินค้าที่ประมูล</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default MyAuctionsPage

//VPea
'use client'; 

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const API_URL = "http://localhost:3111/api/v1";
const socket = io("http://localhost:3111");

function MyAuctionsPage() {
  const [myBids, setMyBids] = useState([]);
  const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchMyBids();
    fetchMyCreatedAuctions();
    
    socket.on("bid_update", (data) => {
      setMyBids(prev => prev.map(bid => 
        bid.auction?._id === data.auctionId 
          ? { ...bid, auction: { ...bid.auction, currentPrice: data.highestBid } }
          : bid
      ));
    });

    return () => {
      socket.off("bid_update");
    };
  }, []);

  const fetchMyBids = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setMyBids(data.data || []);
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลการบิดของคุณได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCreatedAuctions = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setMyCreatedAuctions(data.data || []);
      }
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลการประมูลของคุณได้');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-bold text-gray-600 animate-pulse">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">ประวัติการบิดและการสร้างการประมูลของฉัน</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <h2 className="text-xl font-semibold text-gray-800 mt-8">การประมูลที่ฉันสร้าง</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {myCreatedAuctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <img
                src={auction.image}
                alt={auction.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{auction.name}</h2>
                <div className="text-gray-600 space-y-2">
                  <p className="flex justify-between">
                    <span>ราคาตั้งต้น</span>
                    <span className="font-medium text-blue-500">{auction.startingPrice} บาท</span>
                  </p>
                  <p className="flex justify-between">
                    <span>ราคาปัจจุบัน</span>
                    <span className="font-medium text-blue-500">{auction.currentPrice} บาท</span>
                  </p>
                  <p className="flex justify-between">
                    <span>สถานะ</span>
                    <span className={`font-medium ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดแล้ว'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => router.push(`${API_URL}/auction/${auction._id}`)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
                >
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-8">ประวัติการบิด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {myBids.map((bid) => (
            <div key={bid._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              {/* <img
                src={bid.auction?.image}
                alt={bid.auction?.name || 'ไม่พบรูปภาพ'}
                className="w-full h-48 object-cover"
              /> */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{bid.auction?.name || 'ไม่พบข้อมูลสินค้า'}</h2>
                <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
                <button
                  onClick={() => router.push(`${API_URL}/auction/${bid.auction._id}`)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
                >
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyAuctionsPage;