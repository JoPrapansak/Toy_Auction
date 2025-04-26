'use client'

import React, { useState, useEffect } from 'react';
import NavUser from '../components/NavUser'
import { useSearchParams } from 'next/navigation'
import NavPayment from '../components/NavPayment';

import provinces from '../../../data/provinces.json';
import amphures from '../../../data/amphures.json';
import districts from '../../../data/districts.json';

const API_URL = 'http://localhost:3111/api/v1';

function PaymentPage() {
  const searchParams = useSearchParams();
  const auctionId = searchParams.get('auctionId');

  const [auction, setAuction] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [paymentId, setPaymentId] = useState('');
  const [note, setNote] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const quantity = searchParams.get('quantity') || 1


 useEffect(() => {
    const loadAll = async () => {
      if (!auctionId) return;

      const [auctionRes, qrRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/auction/${auctionId}`),
        fetch(`${API_URL}/payment/generate-qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ auctionId }),
        }),
        fetch(`${API_URL}/profile`, { credentials: 'include' }),
      ]);

      const auctionData = await auctionRes.json();
      if (auctionData.status === 'success') setAuction(auctionData.data);

      const qrData = await qrRes.json();
      if (qrData.success) {
        setQrCode(qrData.qrCode);
        setPaymentId(qrData.paymentId);
        setQrError('');
      } else {
        setQrError(qrData.error || 'ไม่สามารถสร้าง QR ได้');
      }

      const profileData = await profileRes.json();
      if (profileData.status === 'success') {
        const user = profileData.data;
        setRecipientName(user.name || '');
        setRecipientPhone(user.phone || '');

        const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
        if (defaultAddress) {
          setShippingAddress(defaultAddress.fullAddress);
        }
      }

      setLoading(false);
    };

    loadAll();
  }, [auctionId]);

  const handleSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSlipFile(file);
  };

  const handlePlaceOrder = async () => {
    if (!slipFile) return alert('กรุณาอัปโหลดสลิป');
    if (!shippingAddress) return alert('ไม่พบที่อยู่จัดส่ง');

    const formData = new FormData();
    formData.append('slip', slipFile);

    const uploadRes = await fetch(`${API_URL}/payment/upload-slip/${paymentId}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadData.success) return alert('❌ อัปโหลดสลิปล้มเหลว');

    const addressRes = await fetch(`${API_URL}/payment/shipping-address/${paymentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        address: shippingAddress,
        note,
      }),
    });

    const addressData = await addressRes.json();
    if (!addressData.success) return alert('❌ บันทึกที่อยู่ล้มเหลว');

    alert('✅ ส่งข้อมูลคำสั่งซื้อสำเร็จ กรุณารอการอนุมัติ');
  };

  if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;


  return (
    <div >
      <NavPayment />
      <div className="container mx-auto px-4 py-8 ">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1> */}
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Product Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-semibold">สินค้า</p>
                <img src={auction?.image?.[0]} className="w-20 h-20 object-cover rounded border" />
                <p className="font-semibold">{auction?.name}</p>
              </div>
              
              <div className="border-b pb-4">
                <p className="font-semibold">จำนวน</p>
                <p className="font-semibold">{quantity} ชิ้น</p>
              </div>

              <div className="border-b pb-4">
                <p className="font-semibold">ราคารวม</p>
                <p className="font-semibold text-xl text-blue-600">
                  {auction?.currentPrice} บาท
                </p>
              </div>
              
              <div className="mt-4 text-sm">
              <label className="block font-medium mb-1">หมายเหตุ</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

              {/* Add Shipping Address Section */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">ที่อยู่จัดส่ง</h3>
                <p>ชื่อผู้รับ: {recipientName || '—'}</p>
                <p>เบอร์โทร: {recipientPhone || '—'}</p>
                <p>ที่อยู่: {shippingAddress || '—'}</p>
              </div>
           
            </div>
          </div>

          {/* Right Side - Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
              <p className="text-2xl font-bold text-blue-600">
              {auction?.currentPrice} บาท
              </p>
            </div>

            <div className="mt-4 text-center">
              {qrCode ? (
                <>
                  <img src={qrCode} alt="QR Promptpay" className="w-44 h-44 border mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">📷 กรุณาสแกนเพื่อชำระเงิน</p>
                </>
              ) : qrError ? (
                <p className="text-red-600 text-sm mt-2">❌ {qrError}</p>
              ) : (
                <p className="text-gray-500 text-sm">⏳ กำลังสร้าง QR Code...</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">แนบสลิปการโอนเงิน</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSlipUpload}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={handlePlaceOrder}
              disabled={!paymentId}
              className="bg-green-500 text-white text-lg px-3 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    
              >
              ยืนยันการชำระเงิน
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import NavPayment from '../components/NavPayment';

// const API_URL = 'http://localhost:3111/api/v1';

// export default function CheckoutPage() {
//   const searchParams = useSearchParams();
//   const auctionId = searchParams.get('auctionId');

//   const [auction, setAuction] = useState(null);
//   const [qrCode, setQrCode] = useState(null);
//   const [paymentId, setPaymentId] = useState('');
//   const [note, setNote] = useState('');
//   const [slipFile, setSlipFile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [qrError, setQrError] = useState('');

//   const [recipientName, setRecipientName] = useState('');
//   const [recipientPhone, setRecipientPhone] = useState('');
//   const [shippingAddress, setShippingAddress] = useState('');

//   const shippingFee = 54;
//   const total = (auction?.currentPrice || 0) + shippingFee;

//   useEffect(() => {
//     const loadAll = async () => {
//       if (!auctionId) return;

//       const [auctionRes, qrRes, profileRes] = await Promise.all([
//         fetch(`${API_URL}/auction/${auctionId}`),
//         fetch(`${API_URL}/payment/generate-qr`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ auctionId }),
//         }),
//         fetch(`${API_URL}/profile`, { credentials: 'include' }),
//       ]);

//       const auctionData = await auctionRes.json();
//       if (auctionData.status === 'success') setAuction(auctionData.data);

//       const qrData = await qrRes.json();
//       if (qrData.success) {
//         setQrCode(qrData.qrCode);
//         setPaymentId(qrData.paymentId);
//         setQrError('');
//       } else {
//         setQrError(qrData.error || 'ไม่สามารถสร้าง QR ได้');
//       }

//       const profileData = await profileRes.json();
//       if (profileData.status === 'success') {
//         const user = profileData.data;
//         setRecipientName(user.name || '');
//         setRecipientPhone(user.phone || '');

//         const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
//         if (defaultAddress) {
//           setShippingAddress(defaultAddress.fullAddress);
//         }
//       }

//       setLoading(false);
//     };

//     loadAll();
//   }, [auctionId]);

//   const handleSlipUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setSlipFile(file);
//   };

//   const handlePlaceOrder = async () => {
//     if (!slipFile) return alert('กรุณาอัปโหลดสลิป');
//     if (!shippingAddress) return alert('ไม่พบที่อยู่จัดส่ง');

//     const formData = new FormData();
//     formData.append('slip', slipFile);

//     const uploadRes = await fetch(`${API_URL}/payment/upload-slip/${paymentId}`, {
//       method: 'POST',
//       credentials: 'include',
//       body: formData,
//     });

//     const uploadData = await uploadRes.json();
//     if (!uploadData.success) return alert('❌ อัปโหลดสลิปล้มเหลว');

//     const addressRes = await fetch(`${API_URL}/payment/shipping-address/${paymentId}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         address: shippingAddress,
//         note,
//       }),
//     });

//     const addressData = await addressRes.json();
//     if (!addressData.success) return alert('❌ บันทึกที่อยู่ล้มเหลว');

//     alert('✅ ส่งข้อมูลคำสั่งซื้อสำเร็จ กรุณารอการอนุมัติ');
//   };

//   if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;

//   return (
//     <div>
//       <NavPayment />
//       <div className="min-h-screen bg-gray-100 p-6">
//         <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6">

//           {/* 📍 ที่อยู่จัดส่ง */}
//           <div className="mb-6 border-b pb-4">
//             <h2 className="text-lg font-bold text-red-600 mb-2">📍 ข้อมูลที่อยู่จัดส่ง</h2>
//             <p>ชื่อผู้รับ: {recipientName || '—'}</p>
//             <p>เบอร์โทร: {recipientPhone || '—'}</p>
//             <p>ที่อยู่: {shippingAddress || '—'}</p>
//           </div>

//           {/* รายการสินค้า */}
//           <div className="mb-6 border-b pb-4">
//             <h2 className="text-lg font-bold mb-2">🛒 รายการสินค้าที่สั่งซื้อ</h2>
//             <div className="flex items-start justify-between">
//               <div className="flex gap-4">
//                 <img src={auction?.image?.[0]} className="w-20 h-20 object-cover rounded border" />
//                 <div>
//                   <p className="font-semibold">{auction?.name}</p>
//                   <p className="text-sm text-gray-600">ตัวเลือกสินค้า: 2pin</p>
//                   <p className="text-sm text-gray-500 mt-1">จำนวน: 1</p>
//                 </div>
//               </div>
//               <p className="font-semibold">฿{auction?.currentPrice}</p>
//             </div>
//             <div className="mt-4 text-sm">
//               <label className="block font-medium mb-1">📦 ความคิดเห็นถึงร้านค้า</label>
//               <input
//                 type="text"
//                 className="w-full border rounded px-3 py-2"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="ฝากข้อความถึงผู้ขาย เช่น กรุณาห่อกันกระแทก"
//               />
//             </div>
//           </div>

//           {/* วิธีชำระเงิน */}
//           <div className="mb-6 border-b pb-4">
//             <h2 className="text-lg font-bold mb-2">💳 วิธีชำระเงิน</h2>
//             <div className="flex gap-4 items-center">
//               <input type="radio" checked readOnly />
//               <label className="font-medium">QR PromptPay</label>
//             </div>

//             <div className="mt-4 text-center">
//               {qrCode ? (
//                 <>
//                   <img src={qrCode} alt="QR Promptpay" className="w-44 h-44 border mx-auto" />
//                   <p className="text-sm text-gray-600 mt-2">📷 กรุณาสแกนเพื่อชำระเงิน</p>
//                 </>
//               ) : qrError ? (
//                 <p className="text-red-600 text-sm mt-2">❌ {qrError}</p>
//               ) : (
//                 <p className="text-gray-500 text-sm">⏳ กำลังสร้าง QR Code...</p>
//               )}
//             </div>

//             <div className="mt-4">
//               <label className="block text-sm font-medium mb-1">📤 อัปโหลดสลิปหลังโอน</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleSlipUpload}
//                 className="block w-full text-sm text-gray-500"
//               />
//             </div>
//           </div>

//           {/* ยอดรวม */}
//           <div className="flex justify-end items-center mt-6">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">ราคาสินค้า: ฿{auction?.currentPrice}</p>
//               <p className="text-sm text-gray-500">ค่าจัดส่ง: ฿{shippingFee}</p>
//               <p className="text-xl font-bold text-red-600 mt-2">ยอดชำระทั้งหมด: ฿{total}</p>
//             </div>
//           </div>

//           {/* ปุ่มยืนยัน */}
//           <div className="flex justify-end mt-6">
//             <button
//               onClick={handlePlaceOrder}
//               disabled={!paymentId}
//               className="bg-orange-500 text-white text-lg px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
//             >
//               🧾 ยืนยันคำสั่งซื้อ
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import NavUser from '../components/NavUser';

// const API_URL = "http://localhost:3111/api/v1";

// function PaymentPage() {
//   const searchParams = useSearchParams();
//   const [auction, setAuction] = useState(null);
//   const [winner, setWinner] = useState(null);  // ข้อมูลผู้ชนะบิด
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [qrCode, setQrCode] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState("pending");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const auctionId = searchParams.get('auctionId');

//   useEffect(() => {
//     if (!auctionId) {
//       setError("❌ ไม่พบข้อมูลการประมูล");
//       return;
//     }

//     fetch(`${API_URL}/auction/${auctionId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success") {
//           setAuction(data.data);
//           setAmount(data.data.currentPrice);

//           if (data.data.seller && data.data.seller.phone) {
//             setRecipient(data.data.seller.phone);
//             generateQR(data.data.seller.phone, data.data.currentPrice);
//           }

//           // ดึงข้อมูลผู้ชนะบิด
//           if (data.data.winner) {
//             setWinner(data.data.winner);  // สมมติว่า `winner` มีข้อมูลของผู้ชนะ
//           }

//         } else {
//           setError("❌ ไม่พบข้อมูลการประมูล");
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
//         setLoading(false);
//       });
//   }, [auctionId]);

//   const generateQR = async (phone, price) => {
//     if (!phone || !price) {
//       setError("⚠️ ข้อมูลไม่ครบถ้วน ไม่สามารถสร้าง QR Code ได้");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/payment/generate-qr`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ recipient: phone, amount: price, auctionId }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setQrCode(data.qrCode);
//         setPaymentStatus("completed");
//         setError(null);
//       } else {
//         setError("❌ สร้าง QR Code ล้มเหลว");
//       }
//     } catch (error) {
//       setError("❌ เกิดข้อผิดพลาดในการสร้าง QR Code");
//     }
//   };

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto">
//           {/* 🔥 ส่วนแสดงรายละเอียดสินค้า */}
//           <div className="p-4">
//             <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//               📦 รายละเอียดสินค้า
//             </h1>
//             {auction.image && auction.image.length > 0 && (
//               <img
//                 src={auction.image[0]}
//                 alt={auction.name}
//                 className="w-full h-60 object-cover rounded-xl shadow-lg"
//               />
//             )}
//             <h2 className="text-xl font-semibold text-gray-800 mt-4">{auction.name}</h2>
//             <p className="text-gray-600">{auction.description}</p>
//             <p className="text-xl font-bold text-green-600 mt-2">💰 ราคา: {auction.currentPrice} บาท</p>

//             {/* 🔥 ข้อมูลผู้ขาย */}
//             <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//               <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ขาย</h3>
//               <p className="text-gray-800">📛 ชื่อ: {auction.seller?.name || "ไม่ระบุ"}</p>
//               <p className="text-gray-800">📧 Email: {auction.seller?.email || "ไม่มีข้อมูล"}</p>
//               <p className="text-gray-800">📞 เบอร์โทร: {auction.seller?.phone || "ไม่มีข้อมูล"}</p>
//             </div>
//           </div>

//           {/* 🔥 ส่วนแสดง QR Code และการชำระเงิน */}
//           <div className="p-4 flex flex-col justify-center items-center border-l border-gray-300">
//             <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//               💳 ชำระเงิน
//             </h1>

//             {qrCode ? (
//               <div className="text-center">
//                 <h2 className="text-lg font-semibold text-gray-700">🔗 QR Code สำหรับการชำระเงิน</h2>
//                 <img
//                   src={qrCode}
//                   alt="QR Code"
//                   className="w-48 h-48 border-2 border-gray-400 rounded-lg shadow-xl mt-4 mx-auto"
//                 />
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center">⏳ กำลังสร้าง QR Code...</p>
//             )}

//             {/* 🔥 แสดงจำนวนเงิน */}
//             <p className="text-lg font-bold text-gray-800 mt-6">💰 จำนวนเงินที่ต้องจ่าย: {amount} บาท</p>

//             {/* 🔥 แสดงสถานะการชำระเงิน */}
//             <div className="mt-4 flex items-center">
//               <span className="text-lg font-semibold">สถานะ:</span>
//               {paymentStatus === "completed" ? (
//                 <span className="ml-2 text-green-600 font-bold flex items-center">
//                   ✔ ชำระเงินแล้ว <span className="ml-2 w-4 h-4 bg-green-500 rounded-full"></span>
//                 </span>
//               ) : (
//                 <span className="ml-2 text-red-500 font-bold flex items-center">
//                   ⏳ รอชำระเงิน <span className="ml-2 w-4 h-4 bg-red-500 rounded-full"></span>
//                 </span>
//               )}
//             </div>

//             {/* 🔥 แสดงข้อมูลผู้ชนะบิด */}
//             {winner && (
//               <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//                 <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ชนะบิด</h3>
//                 <p className="text-gray-800">📛 ชื่อ: {winner.name || "ไม่ระบุ"}</p>
//                 <p className="text-gray-800">📧 Email: {winner.email || "ไม่มีข้อมูล"}</p>
//                 <p className="text-gray-800">📞 เบอร์โทร: {winner.phone || "ไม่มีข้อมูล"}</p>
//                 <p className="text-gray-800">🏠 ที่อยู่: {winner.address || "ไม่มีข้อมูล"}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentPage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';

// const API_URL = "http://localhost:3111/api/v1";

// function PaymentPage() {
//   const searchParams = useSearchParams();
//   const [auction, setAuction] = useState(null);
//   const [winner, setWinner] = useState(null);  // ข้อมูลผู้ชนะบิด
//   const [recipient, setRecipient] = useState('');
//   const [amount, setAmount] = useState('');
//   const [qrCode, setQrCode] = useState(null);
//   const [paymentStatus, setPaymentStatus] = useState("pending");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const auctionId = searchParams.get('auctionId');

//   useEffect(() => {
//     if (!auctionId) {
//       setError("❌ ไม่พบข้อมูลการประมูล");
//       return;
//     }

//     fetch(`${API_URL}/auction/${auctionId}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === "success") {
//           setAuction(data.data);
//           setAmount(data.data.currentPrice);

//           if (data.data.seller && data.data.seller.phone) {
//             setRecipient(data.data.seller.phone);
//             generateQR(data.data.seller.phone, data.data.currentPrice);
//           }

//           // ดึงข้อมูลผู้ชนะบิด
//           if (data.data.winner) {
//             setWinner(data.data.winner);  // สมมติว่า `winner` มีข้อมูลของผู้ชนะ
//           }

//         } else {
//           setError("❌ ไม่พบข้อมูลการประมูล");
//         }
//         setLoading(false);
//       })
//       .catch(err => {
//         setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
//         setLoading(false);
//       });
//   }, [auctionId]);

//   const generateQR = async (phone, price) => {
//     if (!phone || !price) {
//       setError("⚠️ ข้อมูลไม่ครบถ้วน ไม่สามารถสร้าง QR Code ได้");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/payment/generate-qr`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ recipient: phone, amount: price, auctionId }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setQrCode(data.qrCode);
//         setPaymentStatus("completed");
//         setError(null);
//       } else {
//         setError("❌ สร้าง QR Code ล้มเหลว");
//       }
//     } catch (error) {
//       setError("❌ เกิดข้อผิดพลาดในการสร้าง QR Code");
//     }
//   };

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!auction) return <p className="text-center text-red-500">❌ ไม่พบสินค้านี้</p>;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
//       <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* 🔥 ส่วนแสดงรายละเอียดสินค้า */}
//         <div className="p-4">
//           <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//             📦 รายละเอียดสินค้า
//           </h1>
//           {auction.image && auction.image.length > 0 && (
//             <img
//               src={auction.image[0]}
//               alt={auction.name}
//               className="w-full h-60 object-cover rounded-xl shadow-lg"
//             />
//           )}
//           <h2 className="text-xl font-semibold text-gray-800 mt-4">{auction.name}</h2>
//           <p className="text-gray-600">{auction.description}</p>
//           <p className="text-xl font-bold text-green-600 mt-2">💰 ราคา: {auction.currentPrice} บาท</p>

//           {/* 🔥 ข้อมูลผู้ขาย */}
//           <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ขาย</h3>
//             <p className="text-gray-800">📛 ชื่อ: {auction.seller?.name || "ไม่ระบุ"}</p>
//             <p className="text-gray-800">📧 Email: {auction.seller?.email || "ไม่มีข้อมูล"}</p>
//             <p className="text-gray-800">📞 เบอร์โทร: {auction.seller?.phone || "ไม่มีข้อมูล"}</p>
//           </div>
//         </div>

//         {/* 🔥 ส่วนแสดง QR Code และการชำระเงิน */}
//         <div className="p-4 flex flex-col justify-center items-center border-l border-gray-300">
//           <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">
//             💳 ชำระเงิน
//           </h1>

//           {qrCode ? (
//             <div className="text-center">
//               <h2 className="text-lg font-semibold text-gray-700">🔗 QR Code สำหรับการชำระเงิน</h2>
//               <img
//                 src={qrCode}
//                 alt="QR Code"
//                 className="w-48 h-48 border-2 border-gray-400 rounded-lg shadow-xl mt-4 mx-auto"
//               />
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center">⏳ กำลังสร้าง QR Code...</p>
//           )}

//           {/* 🔥 แสดงจำนวนเงิน */}
//           <p className="text-lg font-bold text-gray-800 mt-6">💰 จำนวนเงินที่ต้องจ่าย: {amount} บาท</p>

//           {/* 🔥 แสดงสถานะการชำระเงิน */}
//           <div className="mt-4 flex items-center">
//             <span className="text-lg font-semibold">สถานะ:</span>
//             {paymentStatus === "completed" ? (
//               <span className="ml-2 text-green-600 font-bold flex items-center">
//                 ✔ ชำระเงินแล้ว <span className="ml-2 w-4 h-4 bg-green-500 rounded-full"></span>
//               </span>
//             ) : (
//               <span className="ml-2 text-red-500 font-bold flex items-center">
//                 ⏳ รอชำระเงิน <span className="ml-2 w-4 h-4 bg-red-500 rounded-full"></span>
//               </span>
//             )}
//           </div>

//           {/* 🔥 แสดงข้อมูลผู้ชนะบิด */}
//           {winner && (
//             <div className="mt-6 bg-gray-100 p-4 rounded-xl shadow">
//               <h3 className="text-lg font-semibold text-gray-700">👤 ข้อมูลผู้ชนะบิด</h3>
//               <p className="text-gray-800">📛 ชื่อ: {winner.name || "ไม่ระบุ"}</p>
//               <p className="text-gray-800">📧 Email: {winner.email || "ไม่มีข้อมูล"}</p>
//               <p className="text-gray-800">📞 เบอร์โทร: {winner.phone || "ไม่มีข้อมูล"}</p>
//               <p className="text-gray-800">🏠 ที่อยู่: {winner.address || "ไม่มีข้อมูล"}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentPage;

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'
// import { useSearchParams } from 'next/navigation'

// function PaymentPage() {
//   const searchParams = useSearchParams()
//   const [selectedSlip, setSelectedSlip] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const [paymentMethod, setPaymentMethod] = useState('qr')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [cardDetails, setCardDetails] = useState({
//     number: '',
//     name: '',
//     expiry: '',
//     cvv: ''
//   })
//   const name = searchParams.get('name')
//   const price = searchParams.get('price')
//   const quantity = searchParams.get('quantity') || 1

//   const handleSlipUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       setSelectedSlip(file)
//       // Create preview URL for the image
//       const url = URL.createObjectURL(file)
//       setPreviewUrl(url)
//     }
//   }

//   const handleSubmitPayment = async () => {
//     if (!selectedSlip) {
//       alert('กรุณาแนบสลิปการโอนเงิน')
//       return
//     }
//     // Add your payment submission logic here
//   }

//   const paymentMethods = [
//     {
//       id: 'qr',
//       name: 'QR PromptPay',
//       icon: '/images/promptpay-logo.png'
//     },
//     {
//       id: 'credit',
//       name: 'บัตรเครดิต/เดบิต',
//       icon: '/images/credit-card.png'
//     },
//     {
//       id: 'truemoney',
//       name: 'TrueMoney Wallet',
//       icon: '/images/truemoney.png'
//     }
//   ]

//   const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod)

//   const renderPaymentMethodContent = () => {
//     switch(paymentMethod) {
//       case 'credit':
//         return (
//           <div className="space-y-4 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 หมายเลขบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.number}
//                 onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
//                 placeholder="0000 0000 0000 0000"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 maxLength="19"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ชื่อบนบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.name}
//                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
//                 placeholder="JOHN DOE"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   วันหมดอายุ
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.expiry}
//                   onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
//                   placeholder="MM/YY"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="5"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.cvv}
//                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
//                   placeholder="123"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="3"
//                 />
//               </div>
//             </div>
//           </div>
//         )
      
//       case 'qr':
//       case 'truemoney':
//         return (
//           <>
//             <div className="mt-6">
//               <img 
//                 src={paymentMethod === 'qr' ? "/qr-code-example.png" : "/truemoney-qr.png"}
//                 alt="QR Code Payment"
//                 className="mx-auto w-64 h-64 border-2 border-gray-200 p-2 rounded-lg"
//               />
//             </div>

//             <div className="space-y-2 mt-4 text-left">
//               <p className="text-sm text-gray-600">
//                 1. สแกน QR Code ด้วย{paymentMethod === 'qr' ? 'แอปธนาคาร' : 'TrueMoney Wallet'}
//               </p>
//               <p className="text-sm text-gray-600">
//                 2. ตรวจสอบจำนวนเงินให้ถูกต้อง
//               </p>
//               <p className="text-sm text-gray-600">
//                 3. ยืนยันการชำระเงิน
//               </p>
//               <p className="text-sm text-gray-600">
//                 4. แนบสลิปการโอนเงินด้านล่าง
//               </p>
//             </div>
//           </>
//         )
//     }
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left Side - Product Details */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
//             <div className="space-y-4">
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">สินค้า</p>
//                 <p className="font-semibold">{name}</p>
//               </div>
              
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">จำนวน</p>
//                 <p className="font-semibold">{quantity} ชิ้น</p>
//               </div>

//               <div className="border-b pb-4">
//                 <p className="text-gray-600">ราคารวม</p>
//                 <p className="font-semibold text-xl text-blue-600">
//                   {Number(price).toLocaleString()} บาท
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Payment Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            
//             <div className="space-y-6">
//               {/* Payment Method Dropdown */}
//               <div className="relative">
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <img 
//                       src={selectedPaymentMethod.icon} 
//                       alt={selectedPaymentMethod.name}
//                       className="h-8 w-8"
//                     />
//                     <span className="font-medium">{selectedPaymentMethod.name}</span>
//                   </div>
//                   <svg 
//                     className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
//                     {paymentMethods.map((method) => (
//                       <button
//                         key={method.id}
//                         className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition"
//                         onClick={() => {
//                           setPaymentMethod(method.id)
//                           setIsDropdownOpen(false)
//                         }}
//                       >
//                         <img src={method.icon} alt={method.name} className="h-8 w-8" />
//                         <span className="font-medium">{method.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Rest of the payment section */}
//               <div className="mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {Number(price).toLocaleString()} บาท
//                   </p>
//                 </div>

//                 {renderPaymentMethodContent()}

//                 {/* Show slip upload only for QR and TrueMoney */}
//                 {(paymentMethod === 'qr' || paymentMethod === 'truemoney') && (
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       แนบสลิปการโอนเงิน
//                     </label>
//                     <div className="mt-1 flex flex-col items-center space-y-4">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleSlipUpload}
//                         className="w-full text-sm text-gray-500
//                           file:mr-4 file:py-2 file:px-4
//                           file:rounded-full file:border-0
//                           file:text-sm file:font-semibold
//                           file:bg-blue-50 file:text-blue-700
//                           hover:file:bg-blue-100"
//                       />
                      
//                       {previewUrl && (
//                         <div className="relative w-full max-w-[200px]">
//                           <img
//                             src={previewUrl}
//                             alt="Payment Slip Preview"
//                             className="rounded-lg shadow-md"
//                           />
//                           <button
//                             onClick={() => {
//                               setSelectedSlip(null)
//                               setPreviewUrl(null)
//                             }}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
//                               hover:bg-red-600 transition"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <button 
//                   className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition mt-6"
//                   onClick={handleSubmitPayment}
//                   disabled={paymentMethod === 'credit' ? 
//                     !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv :
//                     !selectedSlip}
//                 >
//                   ยืนยันการชำระเงิน
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaymentPage

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'
// import { useSearchParams } from 'next/navigation'

// function PaymentPage() {
//   const searchParams = useSearchParams()
//   const [selectedSlip, setSelectedSlip] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const [paymentMethod, setPaymentMethod] = useState('qr')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [cardDetails, setCardDetails] = useState({
//     number: '',
//     name: '',
//     expiry: '',
//     cvv: ''
//   })
//   const name = searchParams.get('name')
//   const price = searchParams.get('price')
//   const quantity = searchParams.get('quantity') || 1

//   const handleSlipUpload = (event) => {
//     const file = event.target.files[0]
//     if (file) {
//       setSelectedSlip(file)
//       // Create preview URL for the image
//       const url = URL.createObjectURL(file)
//       setPreviewUrl(url)
//     }
//   }

//   const handleSubmitPayment = async () => {
//     if (!selectedSlip) {
//       alert('กรุณาแนบสลิปการโอนเงิน')
//       return
//     }
//     // Add your payment submission logic here
//   }

//   const paymentMethods = [
//     {
//       id: 'qr',
//       name: 'QR PromptPay',
//       icon: '/image/promptpay.png'
//     },
//     {
//       id: 'credit',
//       name: 'บัตรเครดิต/เดบิต',
//       icon: '/image/iconscreditcard.png'
//     },
//     {
//       id: 'truemoney',
//       name: 'TrueMoney Wallet',
//       icon: '/image/truewallet.png'
//     }
//   ]

//   const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod)

//   const renderPaymentMethodContent = () => {
//     switch(paymentMethod) {
//       case 'credit':
//         return (
//           <div className="space-y-4 mt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 หมายเลขบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.number}
//                 onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
//                 placeholder="0000 0000 0000 0000"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 maxLength="19"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ชื่อบนบัตร
//               </label>
//               <input
//                 type="text"
//                 value={cardDetails.name}
//                 onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
//                 placeholder="Name"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   วันหมดอายุ
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.expiry}
//                   onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
//                   placeholder="MM/YY"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="5"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CVV
//                 </label>
//                 <input
//                   type="text"
//                   value={cardDetails.cvv}
//                   onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
//                   placeholder="123"
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   maxLength="3"
//                 />
//               </div>
//             </div>
//           </div>
//         )
      
//       case 'qr':
//       case 'truemoney':
//         return (
//           <>
//             <div className="mt-6">
//               <img 
//                 src={paymentMethod === 'qr' ? "/qr-code-example.png" : "/truemoney-qr.png"}
//                 alt="QR Code Payment"
//                 className="mx-auto w-64 h-64 border-2 border-gray-200 p-2 rounded-lg"
//               />
//             </div>

//             <div className="space-y-2 mt-4 text-left">
//               <p className="text-sm text-gray-600">
//                 1. สแกน QR Code ด้วย{paymentMethod === 'qr' ? 'แอปธนาคาร' : 'TrueMoney Wallet'}
//               </p>
//               <p className="text-sm text-gray-600">
//                 2. ตรวจสอบจำนวนเงินให้ถูกต้อง
//               </p>
//               <p className="text-sm text-gray-600">
//                 3. ยืนยันการชำระเงิน
//               </p>
//               <p className="text-sm text-gray-600">
//                 4. แนบสลิปการโอนเงินด้านล่าง
//               </p>
//             </div>
//           </>
//         )
//     }
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h1>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left Side - Product Details */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2>
            
//             <div className="space-y-4">
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">สินค้า</p>
//                 <p className="font-semibold">{name}</p>
//               </div>
              
//               <div className="border-b pb-4">
//                 <p className="text-gray-600">จำนวน</p>
//                 <p className="font-semibold">{quantity} ชิ้น</p>
//               </div>

//               <div className="border-b pb-4">
//                 <p className="text-gray-600">ราคารวม</p>
//                 <p className="font-semibold text-xl text-blue-600">
//                   {Number(price).toLocaleString()} บาท
//                 </p>
//               </div>

//               {/* Add Shipping Address Section */}
//               <div className="pt-4">
//                 <h3 className="text-lg font-semibold mb-4">ที่อยู่จัดส่ง</h3>
//                 <div>
//                   <textarea
//                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     rows="4"
//                     placeholder="ระบุที่อยู่จัดส่ง เช่น บ้านเลขที่ ถนน ตำบล/แขวง อำเภอ/เขต จังหวัด รหัสไปรษณีย์"
//                     required
//                   ></textarea>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Payment Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
            
//             <div className="space-y-6">
//               {/* Payment Method Dropdown */}
//               <div className="relative">
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <img 
//                       src={selectedPaymentMethod.icon} 
//                       alt={selectedPaymentMethod.name}
//                       className="h-8 w-8"
//                     />
//                     <span className="font-medium">{selectedPaymentMethod.name}</span>
//                   </div>
//                   <svg 
//                     className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg">
//                     {paymentMethods.map((method) => (
//                       <button
//                         key={method.id}
//                         className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition"
//                         onClick={() => {
//                           setPaymentMethod(method.id)
//                           setIsDropdownOpen(false)
//                         }}
//                       >
//                         <img src={method.icon} alt={method.name} className="h-8 w-8" />
//                         <span className="font-medium">{method.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Rest of the payment section */}
//               <div className="mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {Number(price).toLocaleString()} บาท
//                   </p>
//                 </div>

//                 {renderPaymentMethodContent()}

//                 {/* Show slip upload only for QR and TrueMoney */}
//                 {(paymentMethod === 'qr' || paymentMethod === 'truemoney') && (
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       แนบสลิปการโอนเงิน
//                     </label>
//                     <div className="mt-1 flex flex-col items-center space-y-4">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleSlipUpload}
//                         className="w-full text-sm text-gray-500
//                           file:mr-4 file:py-2 file:px-4
//                           file:rounded-full file:border-0
//                           file:text-sm file:font-semibold
//                           file:bg-blue-50 file:text-blue-700
//                           hover:file:bg-blue-100"
//                       />
                      
//                       {previewUrl && (
//                         <div className="relative w-full max-w-[200px]">
//                           <img
//                             src={previewUrl}
//                             alt="Payment Slip Preview"
//                             className="rounded-lg shadow-md"
//                           />
//                           <button
//                             onClick={() => {
//                               setSelectedSlip(null)
//                               setPreviewUrl(null)
//                             }}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
//                               hover:bg-red-600 transition"
//                           >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <button 
//                   className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition mt-6"
//                   onClick={handleSubmitPayment}
//                   disabled={paymentMethod === 'credit' ? 
//                     !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv :
//                     !selectedSlip}
//                 >
//                   ยืนยันการชำระเงิน
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaymentPage