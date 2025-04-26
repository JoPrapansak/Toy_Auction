'use client';

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser';
import { useSearchParams } from 'next/navigation';
import NavContact from '../components/NavContact';

function ProductDetailsPage() {
  const searchParams = useSearchParams();
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('กำลังโหลด...');
  const [startingPrice, setStartingPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [minimumBidIncrement, setMinimumBidIncrement] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidsPerPage] = useState(5);
  const [auction, setAuction] = useState(null);
  const [imageIndex, setImageIndex] = useState(0); // สำหรับเลื่อนรูป

  const [images, setImages] = useState([]); // เก็บรูปภาพสินค้าแบบ array
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const [showConfirmBid, setShowConfirmBid] = useState(false); // สำหรับป๊อบอัพยืนยันการประมูล
  const [isBidding, setIsBidding] = useState(false); // สำหรับการป้องกันการบิดหลายครั้ง
  const [bidStatus, setBidStatus] = useState(''); // ใช้จัดเก็บข้อความสถานะการประมูล

  

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
          <div className="space-y-4">
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={name}
                className="w-full h-[400px] object-contain"
              />
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
            </div>

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

          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{name}</h1>

            <div className="border-t border-b py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ราคาเริ่มต้น</span>
                <span className="text-2xl font-bold">{startingPrice} บาท</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">ราคาปัจจุบัน</span>
                <span className="text-2xl font-bold text-green-600">{currentPrice} บาท</span>
              </div>

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
                onClick={handleBidHistoryClick}
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
              {/* <input
                type="number"
                className="w-full p-2 border rounded"
                value={bidAmount}
                readOnly
              /> */}
              <div className="flex gap-4 ml-4">
                {/* <button
                  className="w-12 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                  onClick={() => setBidAmount(prevBid => {
                    const newBid = parseInt(prevBid) || currentPrice;
                    return newBid + minimumBidIncrement;
                  })}
                >
                  +
                </button> */}

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

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2"
              onClick={handleBid}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
              <button
                onClick={() => setShowBidHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-4">⏳ กำลังโหลดข้อมูล...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : bidHistory.length === 0 ? (
              <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
            ) : (
              <>
                <div className="divide-y max-h-72 overflow-y-auto">
                  {currentBids.map((bid) => (
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



      <NavContact />
    </div>
  );
}

export default ProductDetailsPage;

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
//           setCurrentPrice(auctionData.currentPrice); // ✅ อัปเดตราคาปัจจุบัน
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

//   const fetchAuctionData = async () => {
//     try {
//       const response = await fetch(`http://localhost:3111/api/v1/auction/${id}`);
//       const data = await response.json();
//       if (data.status === 'success') {
//         // อัปเดตข้อมูลการประมูลใน state
//         setAuction(data.data);
//         setCurrentPrice(data.data.currentPrice);
//       } else {
//         alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการประมูล');
//       }
//     } catch (err) {
//       console.error("❌ Error fetching auction data:", err);
//       alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการประมูล');
//     }
//   };
  

//     // 📌 ฟังก์ชันสำหรับการประมูล
//     const handleBid = async () => {
//       if (!auction) return;
    
//       // คำนวณราคาบิดขั้นต่ำ
//       const minBid = auction.currentPrice + auction.minimumBidIncrement;
    
//       // ตรวจสอบว่าราคาบิดที่ผู้ใช้ใส่มามากกว่าหรือเท่ากับราคาที่กำหนดหรือไม่
//       if (!bidAmount || isNaN(bidAmount) || bidAmount < minBid) {
//         alert(`กรุณาใส่ราคาที่มากกว่าหรือเท่ากับ ${minBid} บาท`);
//         return;
//       }
    
//       // ส่งคำขอบิดไปยัง Backend
//       try {
//         const response = await fetch(`http://localhost:3111/api/v1/auction/${id}/bids`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ amount: Number(bidAmount) }), // ส่งราคาบิดที่ผู้ใช้ตั้ง
//         });
    
//         const data = await response.json();
//         if (data.status === 'success') {
//           alert('🎉 ประมูลสำเร็จ!');
    
//           // อัปเดตราคาปัจจุบัน
//           const newCurrentPrice = Number(bidAmount); // ราคาปัจจุบันต้องเป็นราคาบิดใหม่
//           auction.currentPrice = newCurrentPrice; // อัปเดตค่าใน Frontend
    
//           // รีเฟรชข้อมูลการประมูลทันที
//           fetchAuctionData();
//         } else {
//           alert(`⚠️ ${data.message}`);
//         }
//       } catch (err) {
//         alert('❌ เกิดข้อผิดพลาด! กรุณาลองอีกครั้ง');
//         console.error("❌ Error in placing bid:", err); // เพิ่มข้อความ error ใน console เพื่อช่วยในการดีบัก
//       }
//     };
    
    
  
//     if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//     if (error) return <p className="text-center text-red-500">{error}</p>;
//     if (!auction) return <p className="text-center text-red-500"></p>;
    
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

//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">หมวดหมู่สินค้า</span>
//                 <span className="text-xl font-bold text-red-500">{category}</span>
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
//                <p className="text-gray-600">{description}</p>
//             </div>

//             <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               {/* <label className="block text-gray-600 mb-2">ราคาประมูล</label> */}
//               {/* ช่องกรอกราคาบิด */}
//               <input
//                 type="number"
//                 className="w-full p-2 border rounded"
//                 value={bidAmount}
//                 readOnly // ป้องกันไม่ให้ผู้ใช้กรอกข้อมูลเอง
//               />
//               {/* ปุ่มเพิ่มราคาบิดและลดราคาบิด */}
//               <div className="flex gap-4 ml-4">
//                 <button
//                   className="w-12 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
//                   onClick={() => setBidAmount(prevBid => {
//                     const newBid = parseInt(prevBid) || currentPrice; // เริ่มต้นด้วยราคาปัจจุบัน
//                     return newBid + minimumBidIncrement; // เพิ่มราคาประมูลขั้นต่ำ
//                   })}
//                 >
//                   +
//                 </button>

//                 <button
//                   className="w-12 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
//                   onClick={() => setBidAmount(prevBid => {
//                     const newBid = parseInt(prevBid) || currentPrice; // เริ่มต้นด้วยราคาปัจจุบัน
//                     const newAmount = newBid - minimumBidIncrement;
//                     return newAmount >= currentPrice ? newAmount : currentPrice; // ป้องกันไม่ให้ต่ำกว่าราคาปัจจุบัน
//                   })}
//                 >
//                   -
//                 </button>
//               </div>
//             </div>

//             <p className="text-red-500 text-sm mt-1">
//               *ราคาประมูลขั้นต่ำ {minimumBidIncrement} บาท*
//             </p>

//             {/* ปุ่มประมูล */}
//             <button
//               className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 mt-2"
//               onClick={handleBid} // ฟังก์ชันประมูล
//             >
//               ประมูลสินค้า
//             </button>
//           </div>



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
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//             <button 
//               onClick={() => setShowBidHistory(false)} 
//               className="text-gray-500 hover:text-gray-700">
//               ✖
//             </button>
//           </div>
          
//           {loading ? (
//             <div className="text-center py-4">กำลังโหลด...</div>
//           ) : error ? (
//             <div className="text-center py-4 text-red-500">{error}</div>
//           ) : bidHistory.length === 0 ? (
//             <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//           ) : (
//             <>
//               <div className="divide-y">
//                 {currentBids.map(bid => (
//                   <div key={bid._id} className="py-4 flex justify-between">
//                     <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                     <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                   </div>
//                 ))}
//               </div>
              
//               {totalPages > 1 && (
//                 <div className="flex justify-end items-center gap-2 mt-4">
//                   {[...Array(totalPages)].map((_, index) => (
//                     <button
//                       key={index + 1}
//                       onClick={() => setCurrentPage(index + 1)}
//                       className={`px-3 py-1 rounded ${
//                         currentPage === index + 1
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}>
//                       {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     )}

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

//               <div className="flex justify-between items-center mt-4">
//                 <span className="text-gray-600">หมวดหมู่สินค้า</span>
//                 <span className="text-xl font-bold text-red-500">{category}</span>
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
//               {showBidHistory && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                   <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                     <div className="flex justify-between items-center mb-4">
//                       <h2 className="text-xl font-semibold">ประวัติการประมูล</h2>
//                       <button onClick={() => setShowBidHistory(false)} className="text-gray-500 hover:text-gray-700">
//                         ✖
//                       </button>
//                     </div>
//                     {loading ? (
//                       <div className="text-center py-4">กำลังโหลด...</div>
//                     ) : error ? (
//                       <div className="text-center py-4 text-red-500">{error}</div>
//                     ) : bidHistory.length === 0 ? (
//                       <div className="text-center py-4">ยังไม่มีประวัติการประมูล</div>
//                     ) : (
//                       <>
//                         <div className="divide-y">
//                           {currentBids.map(bid => (
//                             <div key={bid._id} className="py-4 flex justify-between">
//                               <p className="font-medium">{bid.user?.user?.name || bid.userName || 'ไม่ทราบชื่อ'}</p>
//                               <p className="text-lg font-semibold">{bid.amount} บาท</p>
//                             </div>
//                           ))}
//                         </div>
//                         {totalPages > 1 && (
//                           <div className="flex justify-end items-center gap-2 mt-4">
//                             {[...Array(totalPages)].map((_, index) => (
//                               <button
//                                 key={index + 1}
//                                 onClick={() => setCurrentPage(index + 1)}
//                                 className={`px-3 py-1 rounded ${
//                                   currentPage === index + 1
//                                     ? 'bg-blue-500 text-white'
//                                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                 }`}
//                               >
//                               {index + 1}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               )}

//             <div>
//                <h2 className="text-xl font-semibold mb-2">รายละเอียดสินค้า</h2>
//                <p className="text-gray-600">{description}</p>
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

//       <NavContact/>
//     </div>
//   );
// }

// export default ProductDetailsPage;