'use client';

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser';
import NavContact from '../components/NavContact';

const API_URL = "http://localhost:3111/api/v1";

function WinnerPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAuctions();

    // ✅ อัปเดตข้อมูลอัตโนมัติทุก 10 วินาที
    const interval = setInterval(fetchAuctions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/auction/closed-auctions`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setAuctions(data.data);
      } else {
        setError('❌ ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      setError('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
      <NavUser />
      <div className="container mx-auto px-6 py-8">
        {/* <div className="flex justify-between items-center"> */}
          <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md"style={{ fontFamily: "'Mali',sans-serif" }}>
            🏆 ประกาศผู้ชนะและผู้บิดสูงสุด 🏆
          </h1>
          {/* <button
            onClick={fetchAuctions}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            🔄 {refreshing ? "กำลังรีเฟรช..." : "รีเฟรช"}
          </button> */}
        {/* </div> */}

        {loading ? (
          <div className="text-center text-gray-600 animate-pulse text-lg mt-6">⏳ กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg mt-6">{error}</div>
        ) : auctions.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-6">❌ ไม่มีการประมูลที่สิ้นสุดในขณะนี้</div>
        ) : (
          <>
            {/* 🔴 การประมูลที่สิ้นสุดแล้ว */}
            <h2 className="text-2xl font-semibold text-red-500 mt-8">📌 การประมูลที่จบแล้ว</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {auctions.map((auction) => (
                <div key={auction._id} className="bg-white p-5 rounded-lg shadow-xl border border-red-400 hover:scale-105 transition transform duration-300">
                  <div className="relative">
                    <img 
                      src={auction.image && auction.image.length > 0 ? auction.image[0] : '/default-image.jpg'}
                      alt={auction.name}
                      className="w-full h-48 object-cover rounded-md shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-bold mt-3 text-gray-800">{auction.name}</h3>
                  <p className="text-gray-600 mt-1">
                    🎉 ผู้ชนะ: 
                    <span className={`font-bold ${auction.highestBidderName ? "text-green-600" : "text-red-500"}`}>
                      {auction.highestBidderName || "❌ ไม่มีข้อมูล"}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    💰 ราคาสุดท้าย: <span className="font-bold">{auction.winningBid || "❌ ไม่พบราคา"} บาท</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 ปิดประมูลเมื่อ: 
                    <span className="font-medium">
                      {auction.expiresAt ? new Date(auction.expiresAt).toLocaleString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "❌ ไม่พบข้อมูล"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <NavContact />
    </div>
  );
}

export default WinnerPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import NavContact from '../components/NavContact';

// const API_URL = "http://localhost:3111/api/v1";

// function WinnerPage() {
//   const [auctions, setAuctions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAuctions = async () => {
//       try {
//         const response = await fetch(`${API_URL}/auction/all`, { credentials: 'include' });
//         const data = await response.json();
//         if (data.status === 'success') {
//           setAuctions(data.data);
//         } else {
//           setError('ไม่สามารถดึงข้อมูลได้');
//         }
//       } catch (err) {
//         setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuctions();

//     // ✅ อัปเดตข้อมูลอัตโนมัติทุก 10 วินาที
//     const interval = setInterval(fetchAuctions, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // ฟังก์ชันคำนวณเวลาที่เหลือ
//   const getRemainingTime = (expiresAt) => {
//     const now = new Date();
//     const expiryDate = new Date(expiresAt);
//     const diff = expiryDate - now;

//     if (diff <= 0) return "⏳ หมดเวลาแล้ว";
//     const minutes = Math.floor(diff / 60000);
//     const seconds = Math.floor((diff % 60000) / 1000);
//     return `⏳ ปิดใน ${minutes} นาที ${seconds} วินาที`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
//       <NavUser />
//       <div className="container mx-auto px-6 py-8">
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md"style={{ fontFamily: "'Mali',sans-serif" }}>
//           🏆 ประกาศผู้ชนะและผู้บิดสูงสุด 🏆
//         </h1>

//         {loading ? (
//           <div className="text-center text-gray-600">⏳ กำลังโหลดข้อมูล...</div>
//         ) : error ? (
//           <div className="text-center text-red-500">{error}</div>
//         ) : (
//           <>
//             {/* 🔴 การประมูลที่สิ้นสุดแล้ว */}
//             {/* <h2 className="text-2xl font-semibold text-red-500 mt-8">📌 การประมูลที่จบแล้ว</h2> */}
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
//               {auctions.filter(a => a.status === "ended").map((auction) => (
//                 <div key={auction._id} className="bg-white p-4 rounded-lg shadow-lg border border-red-400 hover:scale-105 transition">
//                   <img 
//                     src={auction.image || '/default-image.jpg'}
//                     alt={auction.name}
//                     className="w-full h-40 object-cover rounded-md"
//                   />
//                   <h3 className="text-lg font-bold mt-3">{auction.name}</h3>
//                   <p className="text-gray-600">🎉 ผู้ชนะ: <span className="text-green-600 font-bold">{auction.winner?.name || "❌ ไม่มีข้อมูล"}</span></p>
//                   <p className="text-gray-600">💰 ราคาสุดท้าย: <span className="font-bold">{auction.winningBid || "❌ ไม่พบราคา"} บาท</span></p>
//                   <p className="text-gray-500 text-sm">📅 ปิดประมูลเมื่อ: {new Date(auction.expiresAt).toLocaleDateString('th-TH')}</p>
//                 </div>
//               ))}
//             </div>

//             {/* 🟢 การประมูลที่กำลังเปิดอยู่ */}
//             {/* <h2 className="text-2xl font-semibold text-green-500 mt-12">🔥 การประมูลที่กำลังดำเนินอยู่</h2>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
//               {auctions.filter(a => a.status === "active").map((auction) => (
//                 <div key={auction._id} className="bg-white p-4 rounded-lg shadow-lg border border-green-400 hover:scale-105 transition">
//                   <img 
//                     src={auction.image || '/default-image.jpg'}
//                     alt={auction.name}
//                     className="w-full h-40 object-cover rounded-md"
//                   />
//                   <h3 className="text-lg font-bold mt-3">{auction.name}</h3>
//                   <p className="text-gray-600">👑 ผู้บิดสูงสุด: <span className="text-blue-600 font-bold">{auction.highestBidder?.name || "❌ ยังไม่มีการบิด"}</span></p>
//                   <p className="text-gray-600">💰 ราคาปัจจุบัน: <span className="font-bold">{auction.currentPrice} บาท</span></p>
//                   <p className="text-gray-500 text-sm">{getRemainingTime(auction.expiresAt)}</p>
//                 </div>
//               ))}
//             </div> */}
//           </>
//         )}
//       </div>
//       <NavContact />
//     </div>
//   );
// }

// export default WinnerPage;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import NavContact from '../components/NavContact';

// function WinnerPage() {
//   const [winners, setWinners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWinners = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/auction/winners', {
//           credentials: 'include'
//         });
//         const data = await response.json();
//         if (data.status === 'success') {
//           setWinners(data.data);
//         } else {
//           setError('ไม่สามารถดึงข้อมูลได้');
//         }
//       } catch (err) {
//         setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWinners();
//   }, []);

//   return (
//     <div>
//       {/* <NavUser /> */}
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-center mb-8">ผู้ชนะการประมูล</h1>
        
//         {loading ? (
//           <div className="text-center">กำลังโหลด...</div>
//         ) : error ? (
//           <div className="text-center text-red-500">{error}</div>
//         ) : winners.length === 0 ? (
//           <div className="text-center">ยังไม่มีผู้ชนะการประมูล</div>
//         ) : (
//           <>
//             {/* Section Headers */}
//             <div className="hidden md:grid md:grid-cols-3 gap-6 mb-4 px-6">
//               <h2 className="text-lg font-semibold text-gray-700">ชื่อผู้ชนะ</h2>
//               <h2 className="text-lg font-semibold text-gray-700">สินค้าที่ประมูล</h2>
//               <h2 className="text-lg font-semibold text-gray-700">ราคาที่ประมูลได้</h2>
//             </div>

//             {/* Winner Cards */}
//             <div className="grid gap-6 md:grid-cols-1">
//               {winners.map((winner) => (
//                 <div 
//                   key={winner._id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
//                 >
//                   <div className="p-6">
//                     <div className="grid md:grid-cols-3 gap-4 items-center">
//                       {/* Winner Info */}
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={winner.userAvatar || '/image/default-avatar.png'}
//                           alt="Winner Avatar"
//                           className="w-12 h-12 rounded-full"
//                         />
//                         <div>
//                           <h3 className="font-semibold text-lg">{winner.userName}</h3>
//                           <p className="text-sm text-gray-500">ผู้ชนะการประมูล</p>
//                         </div>
//                       </div>

//                       {/* Product Info */}
//                       <div className="md:text-center">
//                         <span className="md:hidden text-gray-600 mb-1 block">สินค้า:</span>
//                         <span className="font-medium">{winner.productName}</span>
//                       </div>

//                       {/* Bid Info */}
//                       <div className="md:text-right">
//                         <span className="md:hidden text-gray-600 mb-1 block">ราคาที่ประมูลได้:</span>
//                         <span className="font-bold text-green-600">{winner.winningBid} บาท</span>
//                         <div className="text-sm text-gray-500 mt-1">
//                           {new Date(winner.winDate).toLocaleDateString('th-TH')}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//       {/* <NavContact /> */}
//     </div>
//   );
// }

// export default WinnerPage;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import NavContact from '../components/NavContact';

// function WinnerPage() {
//   const [winners, setWinners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWinners = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/auction/winners', {
//           credentials: 'include'
//         });
//         const data = await response.json();
//         if (data.status === 'success') {
//           setWinners(data.data);
//         } else {
//           setError('ไม่สามารถดึงข้อมูลได้');
//         }
//       } catch (err) {
//         setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWinners();
//   }, []);

//   return (
//     <div>
//       {/* <NavUser /> */}
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-center mb-8">ผู้ชนะการประมูล</h1>
        
//         {loading ? (
//           <div className="text-center">กำลังโหลด...</div>
//         ) : error ? (
//           <div className="text-center text-red-500">{error}</div>
//         ) : winners.length === 0 ? (
//           <div className="text-center">ยังไม่มีผู้ชนะการประมูล</div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {winners.map((winner) => (
//               <div 
//                 key={winner._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
//               >
//                 <div className="p-6">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <img
//                       src={winner.userAvatar || '/image/default-avatar.png'}
//                       alt="Winner Avatar"
//                       className="w-12 h-12 rounded-full"
//                     />
//                     <div>
//                       <h2 className="font-semibold text-lg">{winner.userName}</h2>
//                       <p className="text-sm text-gray-500">ผู้ชนะการประมูล</p>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">สินค้า:</span>
//                       <span className="font-medium">{winner.productName}</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">ราคาที่ประมูลได้:</span>
//                       <span className="font-bold text-green-600">{winner.winningBid} บาท</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600">วันที่ชนะ:</span>
//                       <span className="text-sm text-gray-500">
//                         {new Date(winner.winDate).toLocaleDateString('th-TH')}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* <NavContact /> */}
//     </div>
//   );
// }

// export default WinnerPage;
