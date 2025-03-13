'use client';

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const API_URL = "http://localhost:3111/api/v1";
const socket = io("http://localhost:3111");

function MyAuctionsPage() {
  const [activeTab, setActiveTab] = useState("winningBids");
  const [myBids, setMyBids] = useState([]);
  const [myWinningBids, setMyWinningBids] = useState([]);
  const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchData(activeTab);

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
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      let response;
      if (tab === "winningBids") {
        response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
      } else if (tab === "bidHistory") {
        response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
      } else if (tab === "createdAuctions") {
        response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
      }
      const data = await response.json();
      if (data.status === 'success') {
        if (tab === "winningBids") setMyWinningBids(data.data || []);
        if (tab === "bidHistory") setMyBids(data.data || []);
        if (tab === "createdAuctions") setMyCreatedAuctions(data.data || []);
      }
    } catch (error) {
      setError('โหลดข้อมูลล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  // const fetchData = async (tab) => {
  //   setLoading(true);
  //   try {
  //     let response;
  //     if (tab === "winningBids") {
  //       response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
  //     } else if (tab === "bidHistory") {
  //       response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
  //     } else if (tab === "createdAuctions") {
  //       response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
  //     }
  //     const data = await response.json();
  //     if (data.status === 'success') {
  //       if (tab === "winningBids") setMyWinningBids(data.data || []);
  //       if (tab === "bidHistory") setMyBids(data.data || []);
  //       if (tab === "createdAuctions") setMyCreatedAuctions(data.data || []);
  //     }
  //   } catch (error) {
  //     setError('โหลดข้อมูลล้มเหลว');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatBidTime = (time) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(time));
  };

  // ✅ ฟังก์ชันไปหน้าสร้าง QR Code (สำหรับผู้ขาย)
  const handleCreateQR = (auctionId) => {
    router.push(`/upload-qr?auctionId=${auctionId}`);
  };

  // ✅ ฟังก์ชันไปหน้าชำระเงิน (สำหรับผู้ชนะการประมูล)
  const handlePayment = (auctionId, qrCode, paymentId) => {
    router.push(`/payment?auctionId=${auctionId}&qrCode=${encodeURIComponent(qrCode)}&paymentId=${paymentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
      <NavUser />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md"style={{ fontFamily: "'Mali',sans-serif" }}>
          🎨 ประวัติการประมูลของฉัน 🎨
        </h1>

        {/* Tabs Menu */}
        <div className="flex justify-center space-x-4 mb-6">
          {["winningBids", "bidHistory", "createdAuctions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full transition font-semibold text-lg drop-shadow-md ${
                activeTab === tab 
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-300/50 scale-105" 
                  : "bg-pink-300 text-gray-800 hover:bg-pink-400 hover:text-white"
              }`}
              style={{ fontFamily: "'Mali',sans-serif" }}
            >
              {tab === "winningBids" && "🏆 บิดที่คุณชนะ"}
              {tab === "bidHistory" && "📜 ประวัติการบิด"}
              {tab === "createdAuctions" && "🎨 ประวัติการสร้างประมูล"}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center text-gray-600">
            ⏳ กำลังโหลด...
          </div>
        )}

        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* 🏆 บิดที่ชนะ */}
        {activeTab === "winningBids" && (
          <div className="space-y-4">
            {myWinningBids.map((bid) => (
              <div key={bid._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border border-pink-400 hover:scale-105 transition-all ease-in-out">
                  <img 
                    src={bid.auction?.image?.length > 0 ? bid.auction.image[0] : '/default-image.jpg'} 
                    alt={bid.auction?.name || "Auction Image"} 
                    className="w-16 h-16 rounded-full object-cover border-4 border-pink-400 drop-shadow-md"
                  />
                <div className="flex-grow">
                  <h2 className="text-xl font-bold">{bid.auction?.name || 'ไม่มีข้อมูล'}</h2>
                  <p className="text-gray-600">ราคาสุดท้าย: {bid.amount} บาท</p>
                  <p className="text-gray-500">ปิดการประมูลเมื่อ: {formatBidTime(bid.auction?.expiresAt)}</p>
                </div>
                 {/* ✅ แสดงปุ่มไปหน้าชำระเงิน */}
                 <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={() => handlePayment(bid.auction?._id, bid.qrCode, bid.paymentId)}
                >
                  💳 ชำระเงิน
                </button>                
              </div>
            ))}
          </div>
        )}

           {/* 📜 ประวัติการบิด */}
           {activeTab === "bidHistory" && (
          <div className="space-y-4">
            {myBids.map((bid) => (
              <div key={bid._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border border-yellow-400 hover:scale-105 transition-all ease-in-out">
                  <img 
                    src={bid.auction?.image?.length > 0 ? bid.auction.image[0] : '/default-image.jpg'} 
                    alt={bid.auction?.name || "Auction Image"} 
                    className="w-16 h-16 rounded-full object-cover border-4 border-pink-400 drop-shadow-md"
                  />
                <div className="flex-grow">
                  <h2 className="text-xl font-bold">{bid.auction?.name || 'ไม่มีข้อมูล'}</h2>
                  <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
                  <p className="text-gray-500">บิดเมื่อ: {formatBidTime(bid.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🎨 ประวัติการสร้างประมูล */}
        {activeTab === "createdAuctions" && (
          <div>
            {/* Add Create Auction Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => router.push('/create-auction')}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-pink-300/50"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                สร้างการประมูลใหม่
              </button>
            </div>

            {/* Existing Auctions List */}
            <div className="space-y-4">
              {myCreatedAuctions.map((auction) => (
                <div key={auction._id} className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-md border border-pink-500">
                  <img 
                    src={auction.image?.[0] ?? '/default-image.jpg'} 
                    alt={auction.name ?? "Auction Image"} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{auction.name}</h2>
                    <p className="text-gray-600">ราคาปัจจุบัน: {auction.currentPrice} บาท</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAuctionsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useRouter } from 'next/navigation';
// import { io } from 'socket.io-client';

// const API_URL = "http://localhost:3111/api/v1";
// const socket = io("http://localhost:3111");

// function MyAuctionsPage() {
//   const [activeTab, setActiveTab] = useState("winningBids");
//   const [myBids, setMyBids] = useState([]);
//   const [myWinningBids, setMyWinningBids] = useState([]);
//   const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchData(activeTab);

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
//   }, [activeTab]);

//   // const fetchData = async (tab) => {
//   //   setLoading(true);
//   //   try {
//   //     let response;
//   //     if (tab === "winningBids") {
//   //       response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
//   //     } else if (tab === "createdAuctions") {
//   //       response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
//   //     }
//   //     const data = await response.json();
//   //     if (data.status === 'success') {
//   //       if (tab === "winningBids") setMyWinningBids(data.data || []);
//   //       if (tab === "createdAuctions") setMyCreatedAuctions(data.data || []);
//   //     }
//   //   } catch (error) {
//   //     setError('โหลดข้อมูลล้มเหลว');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchData = async (tab) => {
//     setLoading(true);
//     try {
//       let response;
//       if (tab === "winningBids") {
//         response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
//       } else if (tab === "bidHistory") {
//         response = await fetch(`${API_URL}/auction/my-bids`, { credentials: 'include' });
//       } else if (tab === "createdAuctions") {
//         response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
//       }
//       const data = await response.json();
//       if (data.status === 'success') {
//         if (tab === "winningBids") setMyWinningBids(data.data || []);
//         if (tab === "bidHistory") setMyBids(data.data || []);
//         if (tab === "createdAuctions") setMyCreatedAuctions(data.data || []);
//       }
//     } catch (error) {
//       setError('โหลดข้อมูลล้มเหลว');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatBidTime = (time) => {
//     return new Intl.DateTimeFormat('th-TH', {
//       year: 'numeric', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit'
//     }).format(new Date(time));
//   };

//   // ✅ ฟังก์ชันไปหน้าสร้าง QR Code (สำหรับผู้ขาย)
//   const handleCreateQR = (auctionId) => {
//     router.push(`/upload-qr?auctionId=${auctionId}`);
//   };

//   // ✅ ฟังก์ชันไปหน้าชำระเงิน (สำหรับผู้ชนะการประมูล)
//   const handlePayment = (auctionId, qrCode, paymentId) => {
//     router.push(`/payment?auctionId=${auctionId}&qrCode=${encodeURIComponent(qrCode)}&paymentId=${paymentId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
//       <NavUser />
//       <div className="container mx-auto px-6 py-8">
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md"style={{ fontFamily: "'Mali',sans-serif" }}>
//           🎨 ประวัติการประมูลของฉัน 🎨
//         </h1>

//         {/* Tabs Menu */}
//         <div className="flex justify-center space-x-4 mb-6">
//           {["winningBids", "bidHistory", "createdAuctions"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-2 rounded-full transition font-semibold text-lg drop-shadow-md ${
//                 activeTab === tab 
//                   ? "bg-pink-500 text-white shadow-lg shadow-pink-300/50 scale-105" 
//                   : "bg-pink-300 text-gray-800 hover:bg-pink-400 hover:text-white"
//               }`}
//               style={{ fontFamily: "'Mali',sans-serif" }}
//             >
//               {tab === "winningBids" && "🏆 บิดที่คุณชนะ"}
//               {tab === "bidHistory" && "📜 ประวัติการบิด"}
//               {tab === "createdAuctions" && "🎨 ประวัติการสร้างประมูล"}
//             </button>
//           ))}
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center items-center text-gray-600">
//             ⏳ กำลังโหลด...
//           </div>
//         )}

//         {error && <p className="text-red-400 text-center">{error}</p>}

//         {/* 🏆 บิดที่ชนะ */}
//         {activeTab === "winningBids" && (
//           <div className="space-y-4">
//             {myWinningBids.map((bid) => (
//               <div key={bid._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border border-pink-400 hover:scale-105 transition-all ease-in-out">
//                 <img 
//                   src={bid.auction?.image || '/default-image.jpg'} 
//                   alt="Auction"
//                   className="w-16 h-16 rounded-full object-cover border-4 border-pink-400 drop-shadow-md"
//                 />
//                 <div className="flex-grow">
//                   <h2 className="text-xl font-bold">{bid.auction?.name || 'ไม่มีข้อมูล'}</h2>
//                   <p className="text-gray-600">ราคาสุดท้าย: {bid.amount} บาท</p>
//                   <p className="text-gray-500">ปิดการประมูลเมื่อ: {formatBidTime(bid.auction?.expiresAt)}</p>
//                 </div>
//                  {/* ✅ แสดงปุ่มไปหน้าชำระเงิน */}
//                  <button 
//                   className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                   onClick={() => handlePayment(bid.auction?._id, bid.qrCode, bid.paymentId)}
//                 >
//                   💳 ชำระเงิน
//                 </button>                
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 📜 ประวัติการบิด */}
//         {activeTab === "bidHistory" && (
//           <div className="space-y-4">
//             {myBids.map((bid) => (
//               <div key={bid._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border border-yellow-400 hover:scale-105 transition-all ease-in-out">
//                 <img 
//                   src={bid.auction?.image || '/default-image.jpg'} 
//                   alt="Auction"
//                   className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400 drop-shadow-md"
//                 />
//                 <div className="flex-grow">
//                   <h2 className="text-xl font-bold">{bid.auction?.name || 'ไม่มีข้อมูล'}</h2>
//                   <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
//                   <p className="text-gray-500">บิดเมื่อ: {formatBidTime(bid.createdAt)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 🎨 ประวัติการสร้างประมูล */}
//         {activeTab === "createdAuctions" && (
//           <div>
//             {/* Add Create Auction Button */}
//             <div className="flex justify-end mb-4">
//               <button
//                 onClick={() => router.push('/create-auction')}
//                 className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-pink-300/50"
//               >
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   strokeWidth={2} 
//                   stroke="currentColor" 
//                   className="w-5 h-5"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//                 สร้างการประมูลใหม่
//               </button>
//             </div>

//             {/* Existing Auctions List */}
//             <div className="space-y-4">
//               {myCreatedAuctions.map((auction) => (
//                 <div key={auction._id} className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-md border border-pink-500">
//                   <img 
//                     src={auction.image || '/default-image.jpg'} 
//                     alt="Auction"
//                     className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
//                   />
//                   <div className="flex-grow">
//                     <h2 className="text-lg font-semibold">{auction.name}</h2>
//                     <p className="text-gray-600">ราคาปัจจุบัน: {auction.currentPrice} บาท</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default MyAuctionsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useRouter } from 'next/navigation';

// const API_URL = "http://localhost:3111/api/v1";

// function MyAuctionsPage() {
//   const [activeTab, setActiveTab] = useState("winningBids");
//   const [myWinningBids, setMyWinningBids] = useState([]);
//   const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     fetchData(activeTab);
//   }, [activeTab]);

//   const fetchData = async (tab) => {
//     setLoading(true);
//     try {
//       let response;
//       if (tab === "winningBids") {
//         response = await fetch(`${API_URL}/auction/my-winning-bids`, { credentials: 'include' });
//       } else if (tab === "createdAuctions") {
//         response = await fetch(`${API_URL}/auction/my-auctions`, { credentials: 'include' });
//       }
//       const data = await response.json();
//       if (data.status === 'success') {
//         if (tab === "winningBids") setMyWinningBids(data.data || []);
//         if (tab === "createdAuctions") setMyCreatedAuctions(data.data || []);
//       }
//     } catch (error) {
//       setError('โหลดข้อมูลล้มเหลว');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ ฟังก์ชันไปหน้าสร้าง QR Code (สำหรับผู้ขาย)
//   const handleCreateQR = (auctionId) => {
//     router.push(`/upload-qr?auctionId=${auctionId}`);
//   };

//   // ✅ ฟังก์ชันไปหน้าชำระเงิน (สำหรับผู้ชนะการประมูล)
//   const handlePayment = (auctionId, qrCode, paymentId) => {
//     router.push(`/payment?auctionId=${auctionId}&qrCode=${encodeURIComponent(qrCode)}&paymentId=${paymentId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800">
//       <NavUser />
//       <div className="container mx-auto px-6 py-8">
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600 drop-shadow-md">
//           🎨 ประวัติการประมูลของฉัน 🎨
//         </h1>

//         {/* Tabs Menu */}
//         <div className="flex justify-center space-x-4 mb-6">
//           {["winningBids", "createdAuctions"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-2 rounded-full transition font-semibold text-lg drop-shadow-md ${
//                 activeTab === tab 
//                   ? "bg-blue-500 text-white shadow-lg scale-105" 
//                   : "bg-blue-300 text-gray-800 hover:bg-blue-400 hover:text-white"
//               }`}
//             >
//               {tab === "winningBids" && "🏆 บิดที่คุณชนะ"}
//               {tab === "createdAuctions" && "📦 ประวัติการสร้างประมูล"}
//             </button>
//           ))}
//         </div>

//         {loading && <div className="flex justify-center items-center text-gray-600">⏳ กำลังโหลด...</div>}
//         {error && <p className="text-red-400 text-center">{error}</p>}

//         {/* 🏆 บิดที่ชนะ (แสดง QR Code) */}
//         {activeTab === "winningBids" && (
//           <div className="space-y-4">
//             {myWinningBids.map((bid) => (
//               <div key={bid._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border border-blue-400">
//                 <div className="flex-grow">
//                   <h2 className="text-xl font-bold">{bid.auction?.name || 'ไม่มีข้อมูล'}</h2>
//                   <p className="text-gray-600">💰 ราคาสุดท้าย: {bid.amount} บาท</p>
//                 </div>

//                 {/* ✅ แสดงปุ่มไปหน้าชำระเงิน */}
//                 <button 
//                   className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                   onClick={() => handlePayment(bid.auction?._id, bid.qrCode, bid.paymentId)}
//                 >
//                   💳 ชำระเงิน
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* 📦 ประวัติการสร้างประมูล (แสดงเฉพาะสถานะการชำระเงิน) */}
//         {activeTab === "createdAuctions" && (
//           <div className="space-y-4">
//             {myCreatedAuctions.map((auction) => (
//               <div key={auction._id} className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-md border border-green-500">
//                 <div className="flex-grow">
//                   <h2 className="text-lg font-semibold">{auction.name}</h2>
//                   <p className="text-gray-600">💰 ราคาปัจจุบัน: {auction.currentPrice} บาท</p>
//                   {/* <p className={`font-bold ${auction.qrCode ? "text-green-600" : "text-red-600"}`}>
//                     {auction.qrCode ? "✅ พร้อมชำระเงิน" : "⏳ รอสร้าง QR Code"}
//                   </p> */}
//                 </div>

//                 {/* ✅ ถ้ายังไม่มี QR Code ให้กดสร้าง
//                 {!auction.qrCode && (
//                   <button 
//                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                     onClick={() => handleCreateQR(auction._id)}
//                   >
//                     ➕ สร้าง QR Code
//                   </button>
//                 )} */}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default MyAuctionsPage;

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
//   const [activeSection, setActiveSection] = useState('created'); // เพิ่ม state สำหรับการสลับหน้า
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
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">ประวัติการประมูลของฉัน</h1>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {/* ปุ่มสลับการแสดงผล */}
//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={() => setActiveSection('created')}
//             className={`px-4 py-2 rounded-lg transition-all ${
//               activeSection === 'created'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             การประมูลที่ฉันสร้าง
//           </button>
//           <button
//             onClick={() => setActiveSection('bids')}
//             className={`px-4 py-2 rounded-lg transition-all ${
//               activeSection === 'bids'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ประวัติการบิด
//           </button>
//         </div>

//         {/* แสดงเฉพาะส่วนที่เลือก */}
//         {activeSection === 'created' && (
//           <>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-gray-800">รายการประมูลของฉัน</h2>
//               <button
//                 onClick={() => router.push('/create-auction')}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
//               >
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   strokeWidth={1.5} 
//                   stroke="currentColor" 
//                   className="w-5 h-5"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                 </svg>
//                 สร้างการประมูลใหม่
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {myCreatedAuctions.map((auction) => (
//                 <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//                   <img
//                     src={auction.image}
//                     alt={auction.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-2">{auction.name}</h2>
//                     <div className="text-gray-600 space-y-2">
//                       <p className="flex justify-between">
//                         <span>ราคาตั้งต้น</span>
//                         <span className="font-medium text-blue-500">{auction.startingPrice} บาท</span>
//                       </p>
//                       <p className="flex justify-between">
//                         <span>ราคาปัจจุบัน</span>
//                         <span className="font-medium text-blue-500">{auction.currentPrice} บาท</span>
//                       </p>
//                       <p className="flex justify-between">
//                         <span>สถานะ</span>
//                         <span className={`font-medium ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
//                           {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดแล้ว'}
//                         </span>
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => router.push(`${API_URL}/auction/${auction._id}`)}
//                       className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                     >
//                       ดูรายละเอียด
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {activeSection === 'bids' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {myBids.map((bid) => (
//               <div key={bid._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//                 {/* <img
//                   src={bid.auction?.image}
//                   alt={bid.auction?.name || 'ไม่พบรูปภาพ'}
//                   className="w-full h-48 object-cover"
//                 /> */}
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold text-gray-800 mb-2">{bid.auction?.name || 'ไม่พบข้อมูลสินค้า'}</h2>
//                   <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
//                   <button
//                     onClick={() => router.push(`${API_URL}/auction/${bid.auction._id}`)}
//                     className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                   >
//                     ดูรายละเอียด
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyAuctionsPage;

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
//   const [activeSection, setActiveSection] = useState('created'); // เพิ่ม state สำหรับการสลับหน้า
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
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">ประวัติการประมูลของฉัน</h1>

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {/* ปุ่มสลับการแสดงผล */}
//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={() => setActiveSection('created')}
//             className={`px-4 py-2 rounded-lg transition-all ${
//               activeSection === 'created'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             การประมูลที่ฉันสร้าง
//           </button>
//           <button
//             onClick={() => setActiveSection('bids')}
//             className={`px-4 py-2 rounded-lg transition-all ${
//               activeSection === 'bids'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             ประวัติการบิด
//           </button>
//         </div>

//         {/* แสดงเฉพาะส่วนที่เลือก */}
//         {activeSection === 'created' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {myCreatedAuctions.map((auction) => (
//               <div key={auction._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//                 <img
//                   src={auction.image}
//                   alt={auction.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold text-gray-800 mb-2">{auction.name}</h2>
//                   <div className="text-gray-600 space-y-2">
//                     <p className="flex justify-between">
//                       <span>ราคาตั้งต้น</span>
//                       <span className="font-medium text-blue-500">{auction.startingPrice} บาท</span>
//                     </p>
//                     <p className="flex justify-between">
//                       <span>ราคาปัจจุบัน</span>
//                       <span className="font-medium text-blue-500">{auction.currentPrice} บาท</span>
//                     </p>
//                     <p className="flex justify-between">
//                       <span>สถานะ</span>
//                       <span className={`font-medium ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
//                         {auction.status === 'active' ? 'กำลังประมูล' : 'สิ้นสุดแล้ว'}
//                       </span>
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => router.push(`${API_URL}/auction/${auction._id}`)}
//                     className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                   >
//                     ดูรายละเอียด
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {activeSection === 'bids' && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//             {myBids.map((bid) => (
//               <div key={bid._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
//                 {/* <img
//                   src={bid.auction?.image}
//                   alt={bid.auction?.name || 'ไม่พบรูปภาพ'}
//                   className="w-full h-48 object-cover"
//                 /> */}
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold text-gray-800 mb-2">{bid.auction?.name || 'ไม่พบข้อมูลสินค้า'}</h2>
//                   <p className="text-gray-600">ราคาที่บิด: {bid.amount} บาท</p>
//                   <button
//                     onClick={() => router.push(`${API_URL}/auction/${bid.auction._id}`)}
//                     className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
//                   >
//                     ดูรายละเอียด
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyAuctionsPage;

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
//               <img
//                 src={auction.image}
//                 alt={auction.name}
//                 className="w-full h-48 object-cover"
//               />
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
//               {/* <img
//                 src={bid.auction?.image}
//                 alt={bid.auction?.name || 'ไม่พบรูปภาพ'}
//                 className="w-full h-48 object-cover"
//               /> */}
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