'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavUser from '../../components/NavUser';
import NavContact from '../../components/NavContact';

const API_URL = "http://localhost:3111/api/v1";

function ProductDetailsPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);// เก็บรูปภาพสินค้าแบบ array
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
  const [bidAmount, setBidAmount] = useState('');

  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [startingPrice, setStartingPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidsPerPage] = useState(5);
  const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

  const [selectedImage, setSelectedImage] = useState(null);
  const [bidStatus, setBidStatus] = useState('');
  const [showConfirmBid, setShowConfirmBid] = useState(false);
  const [isBidding, setIsBidding] = useState(false);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!id) return;
  
    let countdownInterval;
    let refreshInterval;
  
    const loadAuction = async () => {
      try {
        const res = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
        const data = await res.json();
        if (data.status === 'success') {
          const auction = data.data;
          setStartingPrice(auction.startingPrice);
          setCurrentPrice(auction.currentPrice);
          setMinimumBidIncrement(auction.minimumBidIncrement);
          setImages(auction.image || []);
          setAuction(auction);
          setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า');
          setCategory(auction.category || 'ไม่ระบุหมวดหมู่');
  
          // เริ่มนับเวลาถอยหลัง
          const endTime = new Date(auction.expiresAt).getTime();
          countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const diff = endTime - now;
            if (diff <= 0) {
              clearInterval(countdownInterval);
              setTimeLeft('หมดเวลา');
            } else {
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);
              setTimeLeft(`${hours}:${minutes}:${seconds}`);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', err);
      }
    };
  
    // โหลดข้อมูลครั้งแรก
    loadAuction();
  
    refreshInterval = setInterval(() => {
      fetch(`http://localhost:3111/api/v1/auction/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const auctionData = data.data;
            setAuction(auctionData);
            setCurrentPrice(auctionData.currentPrice);
            setMinimumBidIncrement(auctionData.minimumBidIncrement);
          }
        })
        .catch(err => console.error('⚠️ ดึงราคาล่าสุดล้มเหลว', err));
    }, 3000);
    
    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, [id]);

  const fetchBidHistory = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`);
      if (!response.ok) throw new Error('ไม่มีผู้ประมูลสินค้าชิ้นนี้');
      const data = await response.json();
      setBidHistory(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📌 ฟังก์ชันดึงข้อมูลการประมูล
const fetchAuctionData = async () => {
  try {
    const response = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
    const data = await response.json();
    if (data.status === 'success') {
      // อัปเดตข้อมูลการประมูลใน state
      setAuction(data.data);
      setCurrentPrice(data.data.currentPrice);
    } else {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการประมูล');
    }
  } catch (err) {
    console.error("❌ Error fetching auction data:", err);
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการประมูล');
  }
};



const handleBid = async () => {
  if (!auction) return;

  // คำนวณราคาบิดขั้นต่ำ
  const minBid = auction.currentPrice + auction.minimumBidIncrement;

  if (!bidAmount || isNaN(bidAmount) || bidAmount < minBid) {
    alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
    return;
  }

  // แสดงป๊อบอัพยืนยันการประมูล
  setShowConfirmBid(true);
};

const confirmBid = async () => {
  setIsBidding(true);
  try {
    const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ amount: Number(bidAmount) }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      setBidStatus('🎉 ประมูลสำเร็จ!');
      fetchAuctionData();
    } else if (data.message === 'คุณไม่สามารถบิดต่อกันเองได้') {
      setBidStatus('คุณไม่สามารถบิดต่อกันเองได้ กรุณารอให้มีผู้ใช้คนอื่นบิดก่อน');
    } else {
      setBidStatus(`⚠️ ${data.message}`);
    }
  } catch (err) {
    setBidStatus('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
    console.error("❌ Error in placing bid:", err);
  } finally {
    setIsBidding(false);
    setShowConfirmBid(false);
  }
};  

// const confirmBid = async () => {
//   setIsBidding(true);
//   try {
//     const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ amount: Number(bidAmount) }), // ส่งราคาบิดที่ผู้ใช้ตั้ง
//     });

//     const data = await response.json();
//     if (data.status === 'success') {
//       setBidStatus('🎉 ประมูลสำเร็จ!'); // เปลี่ยนข้อความเมื่อประมูลสำเร็จ
//       // อัปเดตค่าใน Frontend และรีเฟรชข้อมูลการประมูล
//       fetchAuctionData();
//     } else {
//       setBidStatus(`⚠️ ${data.message}`);
//     }
//   } catch (err) {
//     setBidStatus('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//     console.error("❌ Error in placing bid:", err);
//   } finally {
//     setIsBidding(false);
//     setShowConfirmBid(false); // ปิดป๊อบอัพเมื่อเสร็จ
//   }
// };

  

  const handleBidHistoryClick = () => {
    setShowBidHistory(true);
    fetchBidHistory();
  };

  if (!auction) return <div>⏳ กำลังโหลดข้อมูลสินค้า...</div>;

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
        <NavUser />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Image Section */}
             <div className="space-y-4">
               <div className="relative">
                 <img
                  src={images[currentImageIndex]}
                  alt={name}
                  className="w-full h-[400px] object-contain"
                />
                
                {/* Navigation Arrows with improved styling */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      ◀
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>
  
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(img);
                        setCurrentImageIndex(index);
                      }}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img 
                          ? 'border-pink-500 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="aspect-square">
                        <img
                          src={img}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* <div className="rounded-lg overflow-hidden">
              <img src={image} alt={name} className="w-full h-auto object-cover" />
            </div> */}
  
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{auction?.name}</h1>
  
              <div className="border-t border-b py-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ราคาเริ่มต้น</span>
                  <span className="text-2xl font-bold">{startingPrice} บาท</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">ราคาปัจจุบัน</span>
                  <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
                </div>
                {/* <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">ราคาขั้นต่ำ</span>
                  <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
                </div> */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">เวลาที่เหลือ</span>
                  <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
                </div>
  
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">หมวดหมู่สินค้า</span>
                  <span className="text-xl font-bold text-red-500">{category}</span>
                </div>
  
              </div>
  
              <div className="flex justify-end">
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  onClick={() => {
                    setShowBidHistory(true);
                    fetchBidHistory();
                  }}
                >
                  <span>ประวัติการประมูล</span>
                </button>
              </div>
  
              <div>
                 <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
                 <p className="text-gray-600">{description}</p>
              </div>
  
              <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="block text-gray-600 mb-2">ราคาประมูล</label>
                <div className="flex gap-4 ml-4">
                <button
                  className="w-12 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
                  onClick={() => setBidAmount(prevBid => {
                    const newBid = parseInt(prevBid) || currentPrice;
                    const newAmount = newBid - minimumBidIncrement;
                    return newAmount >= currentPrice ? newAmount : currentPrice;
                  })}
                >
                  -
                </button>

                <input
                type="number"
                className="w-full p-2 border rounded"
                value={bidAmount}
                readOnly // ป้องกันไม่ให้ผู้ใช้กรอกข้อมูลเอง
              />
                <button
                  className="w-12 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                  onClick={() => setBidAmount(prevBid => {
                    const newBid = parseInt(prevBid) || currentPrice; // เริ่มต้นด้วยราคาปัจจุบัน
                    return newBid + minimumBidIncrement; // เพิ่มราคาประมูลขั้นต่ำ
                  })}
                >
                  +
                </button>
                </div>
              </div>
  
              <p className="text-red-500 text-sm mt-1">
                *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
              </p>
  
              {/* ปุ่มประมูล */}
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2"
                onClick={handleBid} // ฟังก์ชันประมูล
              >
                ประมูลสินค้า
              </button>
            </div>
      
            </div>
            {/* Seller Information - Centered */}
            <div className="mt-8 flex justify-center">
                {/* <div className="bg-white p-6 rounded-lg w-96"> */}
                <div className="p-6 rounded-lg w-96">
                  <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
                    <img
                      src={auction.seller?.profileImage || "/default-profile.png"}
                      alt="Seller Profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="text-center">
                      <h3 className="font-medium">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
                      {/* <p className="text-sm text-gray-500">{auction.seller?.email || 'ไม่มีข้อมูลอีเมล'}</p> */}
                      <p className="text-sm text-gray-500">{auction.seller?.phone || 'ไม่มีเบอร์โทร'}</p>
                      {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                      </div> */}
                    </div>
                    {/* <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                      ติดต่อผู้ขาย
                    </button> */}
                  </div>
                </div>
              </div>
          </div>
        </div>
  
        {showBidHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
              <button 
                onClick={() => setShowBidHistory(false)} 
                className="text-gray-500 hover:text-gray-700">
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
                  {currentBids.map(bid => (
                    <div key={bid._id} className="py-4 flex justify-between">
                      <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
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
                        }`}>
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

      {bidStatus && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-lg shadow-lg z-50 ${
            bidStatus === 'การประมูลสิ้นสุดแล้ว ไม่สามารถบิดได้' ||
            bidStatus === 'คุณไม่สามารถบิดต่อกันเองได้ กรุณารอให้มีผู้ใช้คนอื่นบิดก่อน'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {bidStatus}
        </div>
      )}

      {showConfirmBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ยืนยันการประมูล</h2>
              <button
                onClick={() => setShowConfirmBid(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <p className="text-center mb-4">คุณต้องการประมูลสินค้านี้ด้วยราคาบิด {bidAmount} บาทใช่หรือไม่?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmBid}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setShowConfirmBid(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
  
      <div className="mt-auto">
        <NavContact/>
      </div>
      </div>
    );
}

export default ProductDetailsPage;
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import NavUser from '../../components/NavUser';
// import NavContact from '../../components/NavContact';

// const API_URL = "http://localhost:3111/api/v1";

// function ProductDetailsPage() {
//   const { id } = useParams();
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [images, setImages] = useState([]);// เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [bidAmount, setBidAmount] = useState('');

//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

//   const [selectedImage, setSelectedImage] = useState(null);

//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//     useEffect(() => {
//       if (!id) return;
  
//       fetch(`http://localhost:3111/api/v1/auction/${id}`)
//         .then(res => res.json())
//         .then(data => {
//           if (data.status === 'success') {
//             const auction = data.data;
//             const auctionData = data.data;
//             setStartingPrice(auction.startingPrice);
//             setCurrentPrice(auction.currentPrice);
//             setMinimumBidIncrement(auction.minimumBidIncrement);
//             setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ
//             setAuction(auctionData);
//             setLoading(false);
//             setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า'); // ✅ เพิ่ม description
//             setCategory(auction.category || 'ไม่ระบุหมวดหมู่'); // ✅ เพิ่ม category
  
//             // Handle both single image and array of images
//             const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//             setImages(auctionImages);
//             setSelectedImage(auctionImages[0]); // Set first image as selected
  
//             // ✅ ตั้งเวลาหมดอายุ
//             const endTime = new Date(auction.expiresAt).getTime();
//             const interval = setInterval(() => {
//               const now = new Date().getTime();
//               const diff = endTime - now;
//               if (diff <= 0) {
//                 clearInterval(interval);
//                 setTimeLeft('หมดเวลา');
//               } else {
//                 const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//                 const minutes = Math.floor((diff / (1000 * 60)) % 60);
//                 const seconds = Math.floor((diff / 1000) % 60);
//                 setTimeLeft(`${hours}:${minutes}:${seconds}`);
//               }
//             }, 1000);
//           }
//         });
//     }, [id]);
  
//     // 📌 ดึงประวัติการบิดจาก API
//     const fetchBidHistory = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//         });
//         if (!response.ok) throw new Error('ไม่มีผู้ประมูลสินค้าชิ้นนี้');
//         const data = await response.json();
//         setBidHistory(data.data || []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//       // 📌 ฟังก์ชันสำหรับการประมูล
//       const handleBid = async () => {
//         if (!auction) return;
    
//         const minBid = auction.currentPrice + auction.minimumBidIncrement;
//         if (!bidAmount || bidAmount < minBid) {
//           alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//           return;
//         }
    
//         try {
//           const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify({ amount: Number(bidAmount) }),
//           });
//           const data = await response.json();
//           if (data.status === 'success') {
//             alert('🎉 ประมูลสำเร็จ!');
//             window.location.reload();
//           } else {
//             alert(`⚠️ ${data.message}`);
//           }
//         } catch (err) {
//           alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//         }
//       };
    
//       if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//       if (error) return <p className="text-center text-red-500">{error}</p>;
//       if (!auction) return <p className="text-center text-red-500"></p>;
//       // if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;
  
//     // // 📌 ฟังก์ชันสำหรับการประมูล
//     // const handleBid = async () => {
//     //   if (!auction) return;
  
//     //   const minBid = auction.currentPrice + auction.minimumBidIncrement;
//     //   if (!bidAmount || bidAmount < minBid) {
//     //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//     //     return;
//     //   }
//     // // const handleBid = async () => {
//     // //   if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//     // //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//     // //     return;
//     // //   }
  
//     //   try {
//     //     const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//     //       method: 'POST',
//     //       headers: { 'Content-Type': 'application/json' },
//     //       credentials: 'include',
//     //       body: JSON.stringify({ amount: Number(bidAmount) }),
//     //     });
//     //     const data = await response.json();
//     //     if (data.status === 'success') {
//     //       alert('ประมูลสำเร็จ!');
//     //       window.location.reload();
//     //     } else {
//     //       alert(data.message);
//     //     }
//     //   } catch (err) {
//     //     alert('เกิดข้อผิดพลาด!');
//     //   }
//     // };
    
//     // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
//     const nextImage = () => {
//       const newIndex = (currentImageIndex + 1) % images.length;
//       setCurrentImageIndex(newIndex);
//       setSelectedImage(images[newIndex]); // Update selected image
//     };
  
//     const prevImage = () => {
//       const newIndex = (currentImageIndex - 1 + images.length) % images.length;
//       setCurrentImageIndex(newIndex);
//       setSelectedImage(images[newIndex]); // Update selected image
//     };
  
//     const indexOfLastBid = currentPage * bidsPerPage;
//     const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//     const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//     const totalPages = Math.ceil(bidHistory.length / bidsPerPage);
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

//         {/* 📌 รูปภาพสินค้า */}
//         <div className="relative">
//           <img
//             src={images[currentImageIndex] || "/default-image.jpg"}
//             alt={auction.name}
//             className="w-full h-[450px] object-contain rounded-lg border"
//           />
//           {images.length > 1 && (
//             <>
//               <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 text-white p-2 rounded-full">
//                 ◀
//               </button>
//               <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 text-white p-2 rounded-full">
//                 ▶
//               </button>
//             </>
//           )}
//           {/* 📌 Thumbnail Images */}
//           <div className="flex gap-2 justify-center mt-2">
//             {images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Thumbnail ${index}`}
//                 className={`w-20 h-20 object-cover rounded border cursor-pointer ${index === currentImageIndex ? 'border-pink-500' : 'border-gray-300'}`}
//                 onClick={() => setCurrentImageIndex(index)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* 📌 รายละเอียดสินค้า */}
//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold">{auction.name}</h1>

//           <div className="border-t border-b py-4">
//             <div className="flex justify-between items-center">
//               <span className="text-2xl font-bold"><strong>ราคาเริ่มต้น:</strong> </span>
//               <span className="text-2xl font-bold">{auction.startingPrice} บาท</span>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <span className="text-2xl font-bold"><strong>ราคาปัจจุบัน:</strong> </span>
//               <span className="text-2xl font-bold text-green-600">{auction.currentPrice} บาท</span>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <span className="text-2xl font-bold"><strong>เวลาที่เหลือ:</strong> </span>
//               <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//             </div>
//           </div>
//              <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
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
//                     <>
//                       <div className="divide-y">
//                         {currentBids.map((bid) => (
//                           <div key={bid._id} className="py-4 flex justify-between">
//                             <div>
//                               <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(bid.date).toLocaleString('th-TH')}
//                               </p>
//                             </div>
//                             <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                           </div>
//                         ))}
//                       </div>
//                       {totalPages > 1 && (
//                         <div className="flex justify-end items-center gap-2 mt-4">
//                           {[...Array(totalPages)].map((_, index) => (
//                             <button
//                               key={index + 1}
//                               onClick={() => setCurrentPage(index + 1)}
//                               className={`px-3 py-1 rounded ${
//                                 currentPage === index + 1
//                                   ? 'bg-blue-500 text-white'
//                                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                               }`}
//                             >
//                               {index + 1}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}      
//              <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//                <p className="text-gray-600">{auction.description}</p>
//              </div>

//           {/* 📌 ปุ่มประมูล */}
//           <div className="space-y-4">
//             <label className="block text-xl font-bold mb-2">ราคาประมูล</label>
//             <input type="number" className="w-full p-2 border rounded" value={bidAmount} onChange={e => setBidAmount(e.target.value)} />
//             <p className="font-bold text-red-500 text-sm">* ราคาประมูลขั้นต่ำ {auction.minimumBidIncrement} บาท *</p>
//             <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2" onClick={handleBid}>
//               ประมูลสินค้า
//             </button>
//           </div>
//         </div>

//         {/* Seller Information - Centered */}
//         <div className="mt-8 flex justify-center">
//           {/* <div className="bg-white p-6 rounded-lg w-96"> */}
//             <div className="p-6 rounded-lg w-96">
//               <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//                   <img
//                     src={auction.seller?.profileImage || "/default-profile.png"}
//                     alt="Seller Profile"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="text-center">
//                     <h3 className="font-medium">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//                     {/* <p className="text-sm text-gray-500">{auction.seller?.email || 'ไม่มีข้อมูลอีเมล'}</p> */}
//                     <p className="text-sm text-gray-500">{auction.seller?.phone || 'ไม่มีเบอร์โทร'}</p>
//                     {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
//                     <div className="flex items-center justify-center mt-1">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-sm text-gray-500 ml-1">(5.0)</span>
//                     </div> */}
//                   </div>
//                   <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
//                     ติดต่อผู้ขาย
//                   </button>
//                 </div>
//             </div>
//         </div>

//        {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       </div>
//       <NavContact />
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import NavUser from '../../components/NavUser';
// import NavContact from '../../components/NavContact';

// const API_URL = "http://localhost:3111/api/v1";

// function ProductDetailsPage() {
//   const { id } = useParams();
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [images, setImages] = useState([]);// เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [bidAmount, setBidAmount] = useState('');

//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

//   const [selectedImage, setSelectedImage] = useState(null);

//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//   useEffect(() => {
//     if (!id) return;

//     fetch(`${API_URL}/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           setAuction(data.data);
//           setImages(data.data.image || []);

//           // ตั้งเวลาถอยหลัง
//           const endTime = new Date(data.data.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         } else {
//           setError('ไม่พบสินค้า');
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setError('เกิดข้อผิดพลาด');
//         setLoading(false);
//       });
//   }, [id]);

//   // 📌 เปลี่ยนรูปภาพ
//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   // 📌 ฟังก์ชันประมูลสินค้า
//   const handleBid = async () => {
//     if (!auction) return;

//     const minBid = auction.currentPrice + auction.minimumBidIncrement;
//     if (!bidAmount || bidAmount < minBid) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });

//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('🎉 ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(`⚠️ ${data.message}`);
//       }
//     } catch (err) {
//       alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//     }
//   };

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

//         {/* 📌 รูปภาพสินค้า */}
//         <div className="relative">
//           <img
//             src={images[currentImageIndex] || "/default-image.jpg"}
//             alt={auction.name}
//             className="w-full h-[450px] object-contain rounded-lg border"
//           />
//           {images.length > 1 && (
//             <>
//               <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 text-white p-2 rounded-full">
//                 ◀
//               </button>
//               <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 text-white p-2 rounded-full">
//                 ▶
//               </button>
//             </>
//           )}
//           {/* 📌 Thumbnail Images */}
//           <div className="flex gap-2 justify-center mt-2">
//             {images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Thumbnail ${index}`}
//                 className={`w-20 h-20 object-cover rounded border cursor-pointer ${index === currentImageIndex ? 'border-pink-500' : 'border-gray-300'}`}
//                 onClick={() => setCurrentImageIndex(index)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* 📌 รายละเอียดสินค้า */}
//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold">{auction.name}</h1>

//           <div className="border-t border-b py-4">
//             <div className="flex justify-between items-center">
//               <span className="text-2xl font-bold"><strong>ราคาเริ่มต้น:</strong> </span>
//               <span className="text-2xl font-bold">{auction.startingPrice} บาท</span>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <span className="text-2xl font-bold"><strong>ราคาปัจจุบัน:</strong> </span>
//               <span className="text-2xl font-bold text-green-600">{auction.currentPrice} บาท</span>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <span className="text-2xl font-bold"><strong>เวลาที่เหลือ:</strong> </span>
//               <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//             </div>
//           </div>
//              <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//              <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//                <p className="text-gray-600">{auction.description}</p>
//              </div>

//           {/* 📌 ปุ่มประมูล */}
//           <div className="space-y-4">
//             <label className="block text-xl font-bold mb-2">ราคาประมูล</label>
//             <input type="number" className="w-full p-2 border rounded" value={bidAmount} onChange={e => setBidAmount(e.target.value)} />
//             <p className="font-bold text-red-500 text-sm">* ราคาประมูลขั้นต่ำ {auction.minimumBidIncrement} บาท *</p>
//             <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2" onClick={handleBid}>
//               ประมูลสินค้า
//             </button>
//           </div>
//         </div>

//         {/* 📌 ข้อมูลผู้ขาย */}
//         <div className="mt-8 flex justify-center">
//           <div className="p-6 rounded-lg w-96">
//             <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//             {/* <div className="p-4 bg-white shadow-md rounded-lg border text-center"> */}
//               <h2 className="text-lg font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//               <img src={auction.sellerImage || "/default-profile.jpg"} alt="Seller" className="w-24 h-24 rounded-full border mx-auto mt-3" />
//               <p className="text-lg">{auction.sellerName || "ไม่ระบุ"}</p>
//               <p className="text-gray-500">{auction.sellerPhone || "ไม่ระบุเบอร์"}</p>
//               <button className="bg-pink-500 text-white px-4 py-2 rounded-lg mt-2">ติดต่อผู้ขาย</button>
//             </div>
//           </div>
//         </div>

//        {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       </div>
//       <NavContact />
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../../components/NavContact';
// // import product from '../product/page';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [auction, setAuction] = useState(null);
//   const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

//   const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   // const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           const auctionData = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);
//           setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ
//           setAuction(auctionData);
//           setLoading(false);
//           setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า'); // ✅ เพิ่ม description
//           setCategory(auction.category || 'ไม่ระบุหมวดหมู่'); // ✅ เพิ่ม category

//           // Handle both single image and array of images
//           const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//           setImages(auctionImages);
//           setSelectedImage(auctionImages[0]); // Set first image as selected

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่มีผู้ประมูลสินค้าชิ้นนี้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//     // 📌 ฟังก์ชันสำหรับการประมูล
//     const handleBid = async () => {
//       if (!auction) return;

//       const minBid = auction.currentPrice + auction.minimumBidIncrement;
//       if (!bidAmount || bidAmount < minBid) {
//         alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ amount: Number(bidAmount) }),
//         });
//         const data = await response.json();
//         if (data.status === 'success') {
//           alert('🎉 ประมูลสำเร็จ!');
//           window.location.reload();
//         } else {
//           alert(`⚠️ ${data.message}`);
//         }
//       } catch (err) {
//         alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//       }
//     };

//     if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//     if (error) return <p className="text-center text-red-500">{error}</p>;
//     if (!auction) return <p className="text-center text-red-500"></p>;
//     // if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   // // 📌 ฟังก์ชันสำหรับการประมูล
//   // const handleBid = async () => {
//   //   if (!auction) return;

//   //   const minBid = auction.currentPrice + auction.minimumBidIncrement;
//   //   if (!bidAmount || bidAmount < minBid) {
//   //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//   //     return;
//   //   }
//   // // const handleBid = async () => {
//   // //   if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//   // //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//   // //     return;
//   // //   }

//   //   try {
//   //     const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       credentials: 'include',
//   //       body: JSON.stringify({ amount: Number(bidAmount) }),
//   //     });
//   //     const data = await response.json();
//   //     if (data.status === 'success') {
//   //       alert('ประมูลสำเร็จ!');
//   //       window.location.reload();
//   //     } else {
//   //       alert(data.message);
//   //     }
//   //   } catch (err) {
//   //     alert('เกิดข้อผิดพลาด!');
//   //   }
//   // };
  
//   // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
//   const nextImage = () => {
//     const newIndex = (currentImageIndex + 1) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   const prevImage = () => {
//     const newIndex = (currentImageIndex - 1 + images.length) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Main Image Section */}
//            <div className="space-y-4">
//              <div className="relative">
//                <img
//                 src={images[currentImageIndex]}
//                 alt={name}
//                 className="w-full h-[400px] object-contain"
//               />
              
//               {/* Navigation Arrows with improved styling */}
//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ◀
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ▶
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setSelectedImage(img);
//                       setCurrentImageIndex(index);
//                     }}
//                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === img 
//                         ? 'border-pink-500 shadow-lg scale-105' 
//                         : 'border-gray-200 hover:border-pink-300'
//                     }`}
//                   >
//                     <div className="aspect-square">
//                       <img
//                         src={img}
//                         alt={`View ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           {/* <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover" />
//           </div> */}

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>

//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">หมวดหมู่สินค้า</span>
//                 <span className="text-xl font-bold text-red-500">{category}</span>
//               </div> */}

//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//               <p className="text-gray-600">{description}</p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//           {/* 🔥 Seller Info Section */}
//           {/* <div className="mt-10 flex justify-center">
//             <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 text-center">
//               <h2 className="text-xl font-semibold mb-4">👤 ข้อมูลผู้ขาย</h2>
//               <img
//                 src={auction.seller?.profileImage || "/default-profile.png"}
//                 alt="Seller Profile"
//                 className="w-20 h-20 rounded-full mx-auto shadow-md"
//                 />
//               <h3 className="font-bold mt-3">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//               <p className="text-gray-500">📧 {auction.seller?.email ? auction.seller.email : 'ไม่มีข้อมูลอีเมล'}</p>
//               <p className="text-gray-500">📞 {auction.seller?.phone ? auction.seller.phone : 'ไม่มีเบอร์โทร'}</p>
//             </div>
//           </div> */}
//           {/* Seller Information - Centered */}
//           <div className="mt-8 flex justify-center">
//               {/* <div className="bg-white p-6 rounded-lg w-96"> */}
//               <div className="p-6 rounded-lg w-96">
//                 <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//                   <img
//                     src={auction.seller?.profileImage || "/default-profile.png"}
//                     alt="Seller Profile"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="text-center">
//                     <h3 className="font-medium">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//                     {/* <p className="text-sm text-gray-500">{auction.seller?.email || 'ไม่มีข้อมูลอีเมล'}</p> */}
//                     <p className="text-sm text-gray-500">{auction.seller?.phone || 'ไม่มีเบอร์โทร'}</p>
//                     {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
//                     <div className="flex items-center justify-center mt-1">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-sm text-gray-500 ml-1">(5.0)</span>
//                     </div> */}
//                   </div>
//                   <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
//                     ติดต่อผู้ขาย
//                   </button>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';
// // import product from '../product/page';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [auction, setAuction] = useState(null);
//   const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

//   const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   // const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           const auctionData = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);
//           setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ
//           setAuction(auctionData);
//           setLoading(false);

//           // Handle both single image and array of images
//           const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//           setImages(auctionImages);
//           setSelectedImage(auctionImages[0]); // Set first image as selected

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่มีผู้ประมูลสินค้าชิ้นนี้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//     // 📌 ฟังก์ชันสำหรับการประมูล
//     const handleBid = async () => {
//       if (!auction) return;
  
//       const minBid = auction.currentPrice + auction.minimumBidIncrement;
//       if (!bidAmount || bidAmount < minBid) {
//         alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//         return;
//       }
  
//       try {
//         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ amount: Number(bidAmount) }),
//         });
//         const data = await response.json();
//         if (data.status === 'success') {
//           alert('🎉 ประมูลสำเร็จ!');
//           window.location.reload();
//         } else {
//           alert(`⚠️ ${data.message}`);
//         }
//       } catch (err) {
//         alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//       }
//     };

//     if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//     if (error) return <p className="text-center text-red-500">{error}</p>;
//     if (!auction) return <p className="text-center text-red-500"></p>;
//     // if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   // // 📌 ฟังก์ชันสำหรับการประมูล
//   // const handleBid = async () => {
//   //   if (!auction) return;

//   //   const minBid = auction.currentPrice + auction.minimumBidIncrement;
//   //   if (!bidAmount || bidAmount < minBid) {
//   //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//   //     return;
//   //   }
//   // // const handleBid = async () => {
//   // //   if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//   // //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//   // //     return;
//   // //   }

//   //   try {
//   //     const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       credentials: 'include',
//   //       body: JSON.stringify({ amount: Number(bidAmount) }),
//   //     });
//   //     const data = await response.json();
//   //     if (data.status === 'success') {
//   //       alert('ประมูลสำเร็จ!');
//   //       window.location.reload();
//   //     } else {
//   //       alert(data.message);
//   //     }
//   //   } catch (err) {
//   //     alert('เกิดข้อผิดพลาด!');
//   //   }
//   // };
  
//   // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
//   const nextImage = () => {
//     const newIndex = (currentImageIndex + 1) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   const prevImage = () => {
//     const newIndex = (currentImageIndex - 1 + images.length) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Main Image Section */}
//            <div className="space-y-4">
//              <div className="relative">
//                <img
//                 src={images[currentImageIndex]}
//                 alt={name}
//                 className="w-full h-[400px] object-contain"
//               />
              
//               {/* Navigation Arrows with improved styling */}
//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ◀
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ▶
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setSelectedImage(img);
//                       setCurrentImageIndex(index);
//                     }}
//                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === img 
//                         ? 'border-pink-500 shadow-lg scale-105' 
//                         : 'border-gray-200 hover:border-pink-300'
//                     }`}
//                   >
//                     <div className="aspect-square">
//                       <img
//                         src={img}
//                         alt={`View ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           {/* <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover" />
//           </div> */}

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//           {/* 🔥 Seller Info Section */}
//           {/* <div className="mt-10 flex justify-center">
//             <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 text-center">
//               <h2 className="text-xl font-semibold mb-4">👤 ข้อมูลผู้ขาย</h2>
//               <img
//                 src={auction.seller?.profileImage || "/default-profile.png"}
//                 alt="Seller Profile"
//                 className="w-20 h-20 rounded-full mx-auto shadow-md"
//                 />
//               <h3 className="font-bold mt-3">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//               <p className="text-gray-500">📧 {auction.seller?.email ? auction.seller.email : 'ไม่มีข้อมูลอีเมล'}</p>
//               <p className="text-gray-500">📞 {auction.seller?.phone ? auction.seller.phone : 'ไม่มีเบอร์โทร'}</p>
//             </div>
//           </div> */}
//           {/* Seller Information - Centered */}
//           <div className="mt-8 flex justify-center">
//               {/* <div className="bg-white p-6 rounded-lg w-96"> */}
//               <div className="p-6 rounded-lg w-96">
//                 <div className="flex flex-col items-center space-y-4 border-2 border-black rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้ขาย</h2>
//                   <img
//                     src={auction.seller?.profileImage || "/default-profile.png"}
//                     alt="Seller Profile"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="text-center">
//                     <h3 className="font-medium">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//                     {/* <p className="text-sm text-gray-500">{auction.seller?.email || 'ไม่มีข้อมูลอีเมล'}</p> */}
//                     <p className="text-sm text-gray-500">{auction.seller?.phone || 'ไม่มีเบอร์โทร'}</p>
//                     {/* <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
//                     <div className="flex items-center justify-center mt-1">
//                       <span className="text-yellow-400">★★★★★</span>
//                       <span className="text-sm text-gray-500 ml-1">(5.0)</span>
//                     </div> */}
//                   </div>
//                   <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
//                     ติดต่อผู้ขาย
//                   </button>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [auction, setAuction] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

//   const id = searchParams.get('id');

//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auctionData = data.data;
//           setAuction(auctionData);
//           setLoading(false);

//           const endTime = new Date(auctionData.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
//             }
//           }, 1000);
//         } else {
//           setError('ไม่พบสินค้านี้');
//           setLoading(false);
//         }
//       })
//       .catch(() => {
//         setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
//         setLoading(false);
//       });
//   }, [id]);

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!auction) return;

//     const minBid = auction.currentPrice + auction.minimumBidIncrement;
//     if (!bidAmount || bidAmount < minBid) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('🎉 ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(`⚠️ ${data.message}`);
//       }
//     } catch (err) {
//       alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//     }
//   };

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
//       <NavUser />
//       <div className="container mx-auto px-6 py-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//           {/* 🔥 Product Image Section */}
//           <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg relative">
//             {auction.image.length > 1 && (
//               <>
//                 <button
//                   onClick={() => setImageIndex((imageIndex - 1 + auction.image.length) % auction.image.length)}
//                   className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
//                 >
//                   ◀
//                 </button>
//                 <button
//                   onClick={() => setImageIndex((imageIndex + 1) % auction.image.length)}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
//                 >
//                   ▶
//                 </button>
//               </>
//             )}
//             <img
//               src={auction.image[imageIndex]}
//               alt={auction.name}
//               className="w-full h-auto rounded-lg shadow-md"
//             />
//           </div>

//           {/* 🔥 Product Details Section */}
//           <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
//             <h1 className="text-4xl font-extrabold text-gray-900">{auction.name}</h1>
//             <p className="text-gray-600 mt-2">{auction.description}</p>

//             <div className="mt-6 space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">💰 ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{auction.startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">🔥 ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{auction.currentPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">⏳ เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             {/* 🔥 Bidding Section */}
//             {timeLeft !== 'หมดเวลา' && (
//               <div className="mt-8 space-y-4">
//                 <div>
//                   <label className="block text-gray-600 mb-2">💵 ราคาประมูล</label>
//                   <input
//                     type="number"
//                     className="w-full p-3 border rounded-lg shadow-sm"
//                     value={bidAmount}
//                     onChange={e => setBidAmount(e.target.value)}
//                     min={auction.currentPrice + auction.minimumBidIncrement}
//                   />
//                   <p className="text-sm text-red-500 mt-1">*ประมูลขั้นต่ำ {auction.minimumBidIncrement} บาท*</p>
//                 </div>
//                 <button
//                   className="w-full bg-pink-500 text-white py-3 rounded-lg shadow-lg hover:bg-pink-600 hover:scale-105 transition"
//                   onClick={handleBid}
//                 >
//                   🎉 ประมูลสินค้า
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//           {/* 🔥 Seller Info Section */}
//           <div className="mt-10 flex justify-center">
//             <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-96 text-center">
//               <h2 className="text-xl font-semibold mb-4">👤 ข้อมูลผู้ขาย</h2>
//               <img
//                 src={auction.seller?.profileImage || "/default-profile.png"}
//                 alt="Seller Profile"
//                 className="w-20 h-20 rounded-full mx-auto shadow-md"
//               />
//               <h3 className="font-bold mt-3">{auction.seller?.name || 'ไม่ระบุชื่อ'}</h3>
//               <p className="text-gray-500">📧 {auction.seller?.email ? auction.seller.email : 'ไม่มีข้อมูลอีเมล'}</p>
//               <p className="text-gray-500">📞 {auction.seller?.phone ? auction.seller.phone : 'ไม่มีเบอร์โทร'}</p>
//             </div>
//           </div>

//       </div>
//       <NavContact />
//     </div>
//   );
// }

// export default ProductDetailsPage;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [images, setImages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
  

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);
//           setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ

//           // Handle both single image and array of images
//           const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//           setImages(auctionImages);
//           setSelectedImage(auctionImages[0]); // Set first image as selected

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
//   const nextImage = () => {
//     const newIndex = (currentImageIndex + 1) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   const prevImage = () => {
//     const newIndex = (currentImageIndex - 1 + images.length) % images.length;
//     setCurrentImageIndex(newIndex);
//     setSelectedImage(images[newIndex]); // Update selected image
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };
//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Main Image Section */}
//           <div className="space-y-4">
//             <div className="relative">
//               <img
//                 src={images[currentImageIndex]}
//                 alt={name}
//                 className="w-full h-[400px] object-contain"
//               />
              
//               {/* Navigation Arrows with improved styling */}
//               {images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ◀
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600/50 hover:bg-gray-600 text-white p-2 rounded-full transition-colors duration-200"
//                   >
//                     ▶
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2 mt-4">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setSelectedImage(img);
//                       setCurrentImageIndex(index);
//                     }}
//                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === img 
//                         ? 'border-pink-500 shadow-lg scale-105' 
//                         : 'border-gray-200 hover:border-pink-300'
//                     }`}
//                   >
//                     <div className="aspect-square">
//                       <img
//                         src={img}
//                         alt={`View ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
//                 </p>
//               </div>
//               <button
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2"
//                 onClick={() => alert('ประมูลสำเร็จ!')}
//               >
//                 ประมูลสินค้า
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       <NavContact />
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [images, setImages] = useState([]);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);
//           setImages(auction.image || []); // ✅ รองรับหลายรูปภาพ

//           // Handle both single image and array of images
//           const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//           setImages(auctionImages);
//           setSelectedImage(auctionImages[0]); // Set first image as selected

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* ✅ รองรับหลายภาพ */}
//           <div className="relative">
//             {images.length > 0 && (
//               <img
//                 src={images[currentImageIndex]}
//                 alt={name}
//                 className="w-full h-auto object-cover rounded-lg"
//               />
//             )}
//             {/* ปุ่มเลื่อนรูป */}
//             {images.length > 1 && (
//               <>
//                 <button
//                   className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
//                   onClick={prevImage}
//                 >
//                   ◀
//                 </button>
//                 <button
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
//                   onClick={nextImage}
//                 >
//                   ▶
//                 </button>
//               </>
//             )}
//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(img)}
//                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === img 
//                         ? 'border-pink-500 shadow-lg' 
//                         : 'border-gray-200 hover:border-pink-300'
//                     }`}
//                   >
//                     <div className="aspect-square">
//                       <img
//                         src={img}
//                         alt={`View ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
//                 </p>
//               </div>
//               <button
//                 className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2"
//                 onClick={() => alert('ประมูลสำเร็จ!')}
//               >
//                 ประมูลสินค้า
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <NavContact />
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';
// import product from '../product/page';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [images, setImages] = useState([]);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);

//           // Handle both single image and array of images
//           const auctionImages = Array.isArray(auction.image) ? auction.image : [auction.image];
//           setImages(auctionImages);
//           setSelectedImage(auctionImages[0]); // Set first image as selected

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Image Gallery Section */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="rounded-lg overflow-hidden bg-white shadow-lg">
//               <img
//                 src={selectedImage || image}
//                 alt={name}
//                 className="w-full h-[400px] object-contain"
//               />
//             </div>
            
//             {/* Thumbnails */}
//             {images.length > 1 && (
//               <div className="grid grid-cols-5 gap-2">
//                 {images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(img)}
//                     className={`relative rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === img 
//                         ? 'border-pink-500 shadow-lg' 
//                         : 'border-gray-200 hover:border-pink-300'
//                     }`}
//                   >
//                     <div className="aspect-square">
//                       <img
//                         src={img}
//                         alt={`View ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//           {/* <div className="mt-8 flex justify-center">
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
//                     <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
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
//             </div> */}
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';
// import product from '../product/page';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover" />
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//           {/* <div className="mt-8 flex justify-center">
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
//                     <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
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
//             </div> */}
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';
// import product from '../product/page';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover" />
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//           {/* <div className="mt-8 flex justify-center">
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
//                     <p className="text-sm text-gray-500">สมาชิกตั้งแต่: January 2024</p>
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
//             </div> */}
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover" />
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <div className="divide-y">
//                 {bidHistory.map(bid => (
//                   <div key={bid._id} className="py-4 flex justify-between">
//                     <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                     <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

// 'use client'

// import React, { useState, useEffect } from 'react'
// import NavUser from '../components/NavUser'
// import { useSearchParams } from 'next/navigation'

// function ProductDetailsPage() {
//   const searchParams = useSearchParams()
//   const [showBidHistory, setShowBidHistory] = useState(false)
//   const [bidHistory, setBidHistory] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [bidAmount, setBidAmount] = useState(""); // ใช้ "" แทน null
//   const [timeLeft, setTimeLeft] = useState("กำลังโหลด...")
//   const [price, setPrice] = useState(Number(searchParams.get('price')))

//   const id = searchParams.get('id')
//   const name = searchParams.get('name')
//   const image = searchParams.get('image')
//   const prices = searchParams.get('prices')

//   useEffect(() => {
//     if (!id) return

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success" && data.data.expiresAt) {
//           const endTime = new Date(data.data.expiresAt).getTime()
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

//   const fetchBidHistory = async () => {
//     if (!id) return
//     setLoading(true)
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
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
//     if (!bidAmount || bidAmount < price) {
//       alert("กรุณาใส่ราคาที่สูงกว่าหรือเท่ากับราคาปัจจุบัน")
//       return
//     }

//     try {
//       // ส่งคำสั่งประมูล
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ amount: Number(bidAmount) })
//       })
//       const data = await response.json()

//       if (data.status === "success") {
//         alert("ประมูลสำเร็จ!")
        
//         // ดึงข้อมูลล่าสุดของสินค้า
//         const auctionResponse = await fetch(`http://localhost:3111/api/v1/auction/${id}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include"
//         })
//         const auctionData = await auctionResponse.json()
        
//         if (auctionData.status === "success") {
//           // อัพเดทราคาปัจจุบัน
//           setPrice(auctionData.data.currentPrice)
//           setBidAmount("") // รีเซ็ตค่าในฟอร์ม
//         }
//       } else {
//         alert(data.message)
//       }
//     } catch (err) {
//       alert("เกิดข้อผิดพลาด!")
//     }
//   }

  

//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="rounded-lg overflow-hidden">
//             <img src={image} alt={name} className="w-full h-auto object-cover"/>
//           </div>

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
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button 
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => { setShowBidHistory(true); fetchBidHistory(); }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//               <p className="text-gray-600">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input 
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                   min={price}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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
//         </div>
//       </div>

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <div className="divide-y">
//                 {bidHistory.map((bid) => (
//                   <div key={bid._id} className="py-4 flex justify-between">
//                     <p>{bid.user.name}</p>
//                     <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ProductDetailsPage

// 'use client';

// import React, { useState, useEffect } from 'react';
// import NavUser from '../components/NavUser';
// import { useSearchParams } from 'next/navigation';
// import NavContact from '../components/NavContact';

// function ProductDetailsPage() {
//   const searchParams = useSearchParams();
//   const [showBidHistory, setShowBidHistory] = useState(false);
//   const [bidHistory, setBidHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
//   const [startingPrice, setStartingPrice] = useState(0);
//   const [currentPrice, setCurrentPrice] = useState(0);
//   const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [bidsPerPage] = useState(5);
//   const [selectedImage, setSelectedImage] = useState(null); // Initialize as null
//   const [productImages, setProductImages] = useState([]); // Initialize as empty array
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const id = searchParams.get('id');
//   const name = searchParams.get('name');
//   const image = searchParams.get('image');

//   // 📌 ดึงข้อมูลสินค้าจาก API
//   useEffect(() => {
//     if (!id) return;

//     fetch(`http://localhost:3111/api/v1/auction/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'success') {
//           const auction = data.data;
//           setStartingPrice(auction.startingPrice);
//           setCurrentPrice(auction.currentPrice);
//           setMinimumBidIncrement(auction.minimumBidIncrement);

//           // ✅ ตั้งเวลาหมดอายุ
//           const endTime = new Date(auction.expiresAt).getTime();
//           const interval = setInterval(() => {
//             const now = new Date().getTime();
//             const diff = endTime - now;
//             if (diff <= 0) {
//               clearInterval(interval);
//               setTimeLeft('หมดเวลา');
//             } else {
//               const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//               const minutes = Math.floor((diff / (1000 * 60)) % 60);
//               const seconds = Math.floor((diff / 1000) % 60);
//               setTimeLeft(`${hours}:${minutes}:${seconds}`);
//             }
//           }, 1000);
//         }
//       });
//   }, [id]);

//   // 📌 ดึงประวัติการบิดจาก API
//   const fetchBidHistory = async () => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลประวัติการประมูลได้');
//       const data = await response.json();
//       setBidHistory(data.data || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📌 ฟังก์ชันสำหรับการประมูล
//   const handleBid = async () => {
//     if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
//       alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ amount: Number(bidAmount) }),
//       });
//       const data = await response.json();
//       if (data.status === 'success') {
//         alert('ประมูลสำเร็จ!');
//         window.location.reload();
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert('เกิดข้อผิดพลาด!');
//     }
//   };

//   const indexOfLastBid = currentPage * bidsPerPage;
//   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
//   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
//   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);

//   // 2. Add a new useEffect to handle image initialization
//   useEffect(() => {
//     if (image) {
//       setSelectedImage(image);
//       setProductImages([
//         image,
//         'https://example.com/image1.jpg', // Replace with your actual image URLs
//         'https://example.com/image2.jpg',
//         'https://example.com/image3.jpg',
//         'https://example.com/image4.jpg'
//       ]);
//     }
//   }, [image]);

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
//     );
//     setSelectedImage(productImages[currentImageIndex === productImages.length - 1 ? 0 : currentImageIndex + 1]);
//   };

//   const previousImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
//     );
//     setSelectedImage(productImages[currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1]);
//   };

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="space-y-4">
//             {/* Main Image Display with Navigation Arrows */}
//             <div className="relative rounded-lg overflow-hidden bg-gray-100">
//               <img
//                 src={selectedImage || image}
//                 alt={name}
//                 className="w-full h-[400px] object-contain"
//               />
              
//               {/* Navigation Arrows */}
//               <button
//                 onClick={previousImage}
//                 className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-r"
//               >
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   className="h-6 w-6" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={2} 
//                     d="M15 19l-7-7 7-7" 
//                   />
//                 </svg>
//               </button>
              
//               <button
//                 onClick={nextImage}
//                 className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-l"
//               >
//                 <svg 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   className="h-6 w-6" 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth={2} 
//                     d="M9 5l7 7-7 7" 
//                   />
//                 </svg>
//               </button>
//             </div>
            
//             {/* Thumbnail Gallery */}
//             <div className="grid grid-cols-5 gap-2">
//               {productImages.map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setSelectedImage(img);
//                     setCurrentImageIndex(index);
//                   }}
//                   className={`relative rounded-lg overflow-hidden aspect-square ${
//                     selectedImage === img 
//                       ? 'ring-2 ring-blue-500' 
//                       : 'ring-1 ring-gray-200 hover:ring-blue-300'
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Product view ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">{name}</h1>

//             <div className="border-t border-b py-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">ราคาเริ่มต้น</span>
//                 <span className="text-2xl font-bold">{startingPrice} บาท</span>
//               </div>
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาปัจจุบัน</span>
//                 <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
//               </div>
//               {/* <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">ราคาขั้นต่ำ</span>
//                 <span className="text-2xl font-bold text-blue-600">{minimumBidIncrement} บาท</span>
//               </div> */}
//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">เวลาที่เหลือ</span>
//                 <span className="text-2xl font-bold text-red-500">{timeLeft}</span>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                 onClick={() => {
//                   setShowBidHistory(true);
//                   fetchBidHistory();
//                 }}
//               >
//                 <span>ประวัติการประมูล</span>
//               </button>
//             </div>

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//              <p className="text-gray-600">
//                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//               </p>
//              </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-600 mb-2">ราคาประมูล</label>
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   min={currentPrice + minimumBidIncrement}
//                 />
//                 <p className="text-red-500 text-sm mt-1">
//                   *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
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

//       {showBidHistory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//               <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                 ✖
//               </button>
//             </div>
//             {loading ? (
//               <div className="text-center py-4">กำลังโหลด...</div>
//             ) : error ? (
//               <div className="text-center py-4 text-red-500">{error}</div>
//             ) : bidHistory.length === 0 ? (
//               <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//             ) : (
//               <>
//                 <div className="divide-y">
//                   {currentBids.map(bid => (
//                     <div key={bid._id} className="py-4 flex justify-between">
//                       <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                       <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                     </div>
//                   ))}
//                 </div>
//                 {totalPages > 1 && (
//                   <div className="flex justify-end items-center gap-2 mt-4">
//                     {[...Array(totalPages)].map((_, index) => (
//                       <button
//                         key={index + 1}
//                         onClick={() => setCurrentPage(index + 1)}
//                         className={`px-3 py-1 rounded ${
//                           currentPage === index + 1
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                         }`}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;

  // useEffect(() => {
  //   if (!id) return;
  
  //   let countdownInterval;
  //   let refreshInterval;
  
  //   const loadAuction = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
  //       const data = await res.json();
  //       if (data.status === 'success') {
  //         const auction = data.data;
  //         setStartingPrice(auction.startingPrice);
  //         setCurrentPrice(auction.currentPrice);
  //         setMinimumBidIncrement(auction.minimumBidIncrement);
  //         setImages(auction.image || []);
  //         setAuction(auction);
  //         setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า');
  //         setCategory(auction.category || 'ไม่ระบุหมวดหมู่');
  
  //         // เริ่มนับเวลาถอยหลัง
  //         const endTime = new Date(auction.expiresAt).getTime();
  //         countdownInterval = setInterval(() => {
  //           const now = new Date().getTime();
  //           const diff = endTime - now;
  //           if (diff <= 0) {
  //             clearInterval(countdownInterval);
  //             setTimeLeft('หมดเวลา');
  //           } else {
  //             const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //             const minutes = Math.floor((diff / (1000 * 60)) % 60);
  //             const seconds = Math.floor((diff / 1000) % 60);
  //             setTimeLeft(`${hours}:${minutes}:${seconds}`);
  //           }
  //         }, 1000);
  //       }
  //     } catch (err) {
  //       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', err);
  //     }
  //   };
  
  //   // โหลดข้อมูลครั้งแรก
  //   loadAuction();
  
  //   refreshInterval = setInterval(() => {
  //     fetch(`http://localhost:3111/api/v1/auction/${id}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.status === 'success') {
  //           const auctionData = data.data;
  //           setAuction(auctionData);
  //           setCurrentPrice(auctionData.currentPrice);
  //           setMinimumBidIncrement(auctionData.minimumBidIncrement);
  //         }
  //       })
  //       .catch(err => console.error('⚠️ ดึงราคาล่าสุดล้มเหลว', err));
  //   }, 3000);
    
  
  //   return () => {
  //     clearInterval(countdownInterval);
  //     clearInterval(refreshInterval);
  //   };
  // }, [id]);
  
  //   // 📌 ดึงประวัติการบิดจาก API
  //   const fetchBidHistory = async () => {
  //     if (!id) return;
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //         credentials: 'include',
  //       });
  //       if (!response.ok) throw new Error('ไม่มีผู้ประมูลสินค้าชิ้นนี้');
  //       const data = await response.json();
  //       setBidHistory(data.data || []);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //     // 📌 ฟังก์ชันสำหรับการประมูล
  //     const handleBid = async () => {
  //       if (!auction) return;
    
  //       const minBid = auction.currentPrice + auction.minimumBidIncrement;
  //       if (!bidAmount || bidAmount < minBid) {
  //         alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
  //         return;
  //       }
    
  //       try {
  //         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           credentials: 'include',
  //           body: JSON.stringify({ amount: Number(bidAmount) }),
  //         });
  //         const data = await response.json();
  //         if (data.status === 'success') {
  //           alert('🎉 ประมูลสำเร็จ!');
  //           window.location.reload();
  //         } else {
  //           alert(`⚠️ ${data.message}`);
  //         }
  //       } catch (err) {
  //         alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
  //       }
  //     };
    
  //     if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
  //     if (error) return <p className="text-center text-red-500">{error}</p>;
  //     if (!auction) return <p className="text-center text-red-500"></p>;
  //     // if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;
  
  //   // // 📌 ฟังก์ชันสำหรับการประมูล
  //   // const handleBid = async () => {
  //   //   if (!auction) return;
  
  //   //   const minBid = auction.currentPrice + auction.minimumBidIncrement;
  //   //   if (!bidAmount || bidAmount < minBid) {
  //   //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
  //   //     return;
  //   //   }
  //   // // const handleBid = async () => {
  //   // //   if (!bidAmount || bidAmount < currentPrice + minimumBidIncrement) {
  //   // //     alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${currentPrice + minimumBidIncrement} บาท`);
  //   // //     return;
  //   // //   }
  
  //   //   try {
  //   //     const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
  //   //       method: 'POST',
  //   //       headers: { 'Content-Type': 'application/json' },
  //   //       credentials: 'include',
  //   //       body: JSON.stringify({ amount: Number(bidAmount) }),
  //   //     });
  //   //     const data = await response.json();
  //   //     if (data.status === 'success') {
  //   //       alert('ประมูลสำเร็จ!');
  //   //       window.location.reload();
  //   //     } else {
  //   //       alert(data.message);
  //   //     }
  //   //   } catch (err) {
  //   //     alert('เกิดข้อผิดพลาด!');
  //   //   }
  //   // };
    
  //   // 📌 ฟังก์ชันเปลี่ยนรูปภาพ
  //   const nextImage = () => {
  //     const newIndex = (currentImageIndex + 1) % images.length;
  //     setCurrentImageIndex(newIndex);
  //     setSelectedImage(images[newIndex]); // Update selected image
  //   };
  
  //   const prevImage = () => {
  //     const newIndex = (currentImageIndex - 1 + images.length) % images.length;
  //     setCurrentImageIndex(newIndex);
  //     setSelectedImage(images[newIndex]); // Update selected image
  //   };
  
  //   const indexOfLastBid = currentPage * bidsPerPage;
  //   const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  //   const currentBids = bidHistory.slice(indexOfFirstBid, indexOfLastBid);
  //   const totalPages = Math.ceil(bidHistory.length / bidsPerPage);
  // useEffect(() => {
  //   if (!id) return;
  
  //   let countdownInterval;
  //   let refreshInterval;
  
  //   const loadAuction = async () => {
  //     try {
  //       const res = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
  //       const data = await res.json();
  //       if (data.status === 'success') {
  //         const auction = data.data;
  //         setStartingPrice(auction.startingPrice);
  //         setCurrentPrice(auction.currentPrice);
  //         setMinimumBidIncrement(auction.minimumBidIncrement);
  //         setImages(auction.image || []);
  //         setAuction(auction);
  //         setDescription(auction.description || 'ไม่มีรายละเอียดสินค้า');
  //         setCategory(auction.category || 'ไม่ระบุหมวดหมู่');
  
  //         // เริ่มนับเวลาถอยหลัง
  //         const endTime = new Date(auction.expiresAt).getTime();
  //         countdownInterval = setInterval(() => {
  //           const now = new Date().getTime();
  //           const diff = endTime - now;
  //           if (diff <= 0) {
  //             clearInterval(countdownInterval);
  //             setTimeLeft('หมดเวลา');
  //           } else {
  //             const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  //             const minutes = Math.floor((diff / (1000 * 60)) % 60);
  //             const seconds = Math.floor((diff / 1000) % 60);
  //             setTimeLeft(`${hours}:${minutes}:${seconds}`);
  //           }
  //         }, 1000);
  //       }
  //     } catch (err) {
  //       console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล', err);
  //     }
  //   };
  
  //   // โหลดข้อมูลครั้งแรก
  //   loadAuction();
  
  //   refreshInterval = setInterval(() => {
  //     fetch(`http://localhost:3111/api/v1/auction/${id}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.status === 'success') {
  //           const auctionData = data.data;
  //           setAuction(auctionData);
  //           setCurrentPrice(auctionData.currentPrice);
  //           setMinimumBidIncrement(auctionData.minimumBidIncrement);
  //         }
  //       })
  //       .catch(err => console.error('⚠️ ดึงราคาล่าสุดล้มเหลว', err));
  //   }, 3000); //เวลารีหน้า 3 วินาที
    
  
  //   return () => {
  //     clearInterval(countdownInterval);
  //     clearInterval(refreshInterval);
  //   };
  // }, [id]);