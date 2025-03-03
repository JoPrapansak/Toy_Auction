'use client';
import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser';
import NavContact from '../components/NavContact';

function WinnerPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/auction/winners', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.status === 'success') {
          setWinners(data.data);
        } else {
          setError('ไม่สามารถดึงข้อมูลได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  return (
    <div>
      {/* <NavUser /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">ผู้ชนะการประมูล</h1>
        
        {loading ? (
          <div className="text-center">กำลังโหลด...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : winners.length === 0 ? (
          <div className="text-center">ยังไม่มีผู้ชนะการประมูล</div>
        ) : (
          <>
            {/* Section Headers */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 mb-4 px-6">
              <h2 className="text-lg font-semibold text-gray-700">ชื่อผู้ชนะ</h2>
              <h2 className="text-lg font-semibold text-gray-700">สินค้าที่ประมูล</h2>
              <h2 className="text-lg font-semibold text-gray-700">ราคาที่ประมูลได้</h2>
            </div>

            {/* Winner Cards */}
            <div className="grid gap-6 md:grid-cols-1">
              {winners.map((winner) => (
                <div 
                  key={winner._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      {/* Winner Info */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={winner.userAvatar || '/image/default-avatar.png'}
                          alt="Winner Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{winner.userName}</h3>
                          <p className="text-sm text-gray-500">ผู้ชนะการประมูล</p>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="md:text-center">
                        <span className="md:hidden text-gray-600 mb-1 block">สินค้า:</span>
                        <span className="font-medium">{winner.productName}</span>
                      </div>

                      {/* Bid Info */}
                      <div className="md:text-right">
                        <span className="md:hidden text-gray-600 mb-1 block">ราคาที่ประมูลได้:</span>
                        <span className="font-bold text-green-600">{winner.winningBid} บาท</span>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(winner.winDate).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* <NavContact /> */}
    </div>
  );
}

export default WinnerPage;

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
