'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Payment from '../components/NavPayment';
import CheckPayment from '../components/NavCheckpayment';

const API_URL = "http://localhost:3111/api/v1";

function CheckPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [slip, setSlip] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [shippingStatus, setShippingStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  // 🧾 ข้อมูลผู้ซื้อ / ที่อยู่
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [auction, setAuction] = useState(null);

  const auctionId = searchParams.get('auctionId');

  const fetchSlipData = async () => {
    if (!auctionId) {
      setError("❌ ไม่พบข้อมูลการประมูล");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payment/slip-by-auction/${auctionId}?nocache=${Date.now()}`, {
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setPaymentId(data.paymentId);
        setIsPaid(data.isPaid);
        setShippingStatus(data.shippingStatus || "");
        setTrackingNumber(data.trackingNumber || "");
        setRecipientName(data.recipientName || "—");
        setRecipientPhone(data.recipientPhone || "—");
        setShippingAddress(data.shippingAddress || "—");
        setNote(data.note || "");

        if (data.slipImage) {
          setSlip(`http://localhost:3111${data.slipImage}`);
        }
      } else {
        setError("❌ ไม่พบการชำระเงิน");
      }
    } catch (err) {
      console.error("❌ fetchSlipData error:", err);
      setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!auctionId) return;
    setConfirming(true);
    try {
      const res = await fetch(`${API_URL}/payment/confirm-payment/by-auction/${auctionId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ ยืนยันการชำระเงินแล้ว");
        await fetchSlipData();
      } else {
        alert(data.message || "❌ ยืนยันล้มเหลว");
      }
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาด");
    } finally {
      setConfirming(false);
    }
  };

  const handleUpdateShipping = async () => {
    if (!paymentId) return alert("ไม่พบข้อมูลการชำระเงิน");
    setUpdating(true);

    try {
      const res = await fetch(`${API_URL}/payment/shipping-status/${paymentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shippingStatus, trackingNumber }),
      });
      const data = await res.json();
      if (data.success) {
        alert("📦 อัปเดตสถานะจัดส่งแล้ว");
        await fetchSlipData();
      } else {
        alert(data.message || "❌ อัปเดตล้มเหลว");
      }
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    
    fetchSlipData();
  }, [auctionId]);

//   if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;
  if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div >
      <CheckPayment />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
                {/* <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2> */}

                {slip ? (
                <>
                <img src={slip} alt="Slip" className="w-56 h-56 rounded shadow-lg mx-auto mb-4" />
                {/* <p className={`text-lg font-bold ${isPaid ? "text-green-600" : "text-yellow-600"}`}>
                    {isPaid ? "✅ การชำระเงินได้รับการยืนยันแล้ว" : "⏳ ยังไม่ได้ยืนยันการชำระเงิน"}
                </p> */}

                <div className="mt-6 text-left border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">ที่อยู่จัดส่ง</h3>
                    <p>ชื่อผู้รับ: {recipientName}</p>
                    <p>เบอร์โทร: {recipientPhone}</p>
                    <p>ที่อยู่: {shippingAddress}</p>

                    <div className="mt-4 text-sm">
                    <label className="block font-medium mb-1">หมายเหตุ</label>
                    <p>{note}</p>
                    </div>

                </div>


                {!isPaid && (
                    <button
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                    ✅ ยืนยันการชำระเงิน
                    </button>
                )}

                {isPaid && (
                    <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">อัปเดตสถานะ</h2>
                    <select
                        value={shippingStatus}
                        onChange={(e) => setShippingStatus(e.target.value)}
                        className="border px-3 py-2 rounded mb-3 w-full"
                    >
                        <option value="">-- เลือกสถานะ --</option>
                        <option value="not_sent">ยังไม่จัดส่ง</option>
                        <option value="shipped">จัดส่งแล้ว</option>
                        <option value="delivered">จัดส่งสำเร็จ</option>
                    </select>

                    <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="เลขพัสดุ (ถ้ามี)"
                        className="border px-3 py-2 rounded w-full mb-3"
                    />

                    <button
                        onClick={handleUpdateShipping}
                        disabled={updating}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
                    >
                        อัปเดต
                    </button>
                    </div>
                )}
                </>
            ) : (
                <p className="text-gray-500">⏳ ลูกค้ายังไม่ได้อัปโหลดสลิป</p>
            )}

                {/* <img src={''} alt="Slip" className="w-56 h-56 rounded shadow-lg mx-auto mb-4" /> */}
                
            {/* </div> */}
        </div>
        
      </div>
    </div>
  )
}

export default CheckPaymentPage

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';
// import Payment from '../components/NavPayment';
// import CheckPayment from '../components/NavCheckpayment';

// const API_URL = "http://localhost:3111/api/v1";

// function CheckPaymentPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [slip, setSlip] = useState(null);
//   const [isPaid, setIsPaid] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paymentId, setPaymentId] = useState(null);
//   const [confirming, setConfirming] = useState(false);
//   const [shippingStatus, setShippingStatus] = useState("");
//   const [trackingNumber, setTrackingNumber] = useState("");
//   const [updating, setUpdating] = useState(false);

//   // 🧾 ข้อมูลผู้ซื้อ / ที่อยู่
//   const [recipientName, setRecipientName] = useState("");
//   const [recipientPhone, setRecipientPhone] = useState("");
//   const [shippingAddress, setShippingAddress] = useState("");
//   const [note, setNote] = useState("");
//   const [auction, setAuction] = useState(null);

//   const auctionId = searchParams.get('auctionId');

//   const fetchSlipData = async () => {
//     if (!auctionId) {
//       setError("❌ ไม่พบข้อมูลการประมูล");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/payment/slip-by-auction/${auctionId}?nocache=${Date.now()}`, {
//         credentials: 'include'
//       });
//       const data = await res.json();

//       if (data.success) {
//         setPaymentId(data.paymentId);
//         setIsPaid(data.isPaid);
//         setShippingStatus(data.shippingStatus || "");
//         setTrackingNumber(data.trackingNumber || "");
//         setRecipientName(data.recipientName || "—");
//         setRecipientPhone(data.recipientPhone || "—");
//         setShippingAddress(data.shippingAddress || "—");
//         setNote(data.note || "");

//         if (data.slipImage) {
//           setSlip(`http://localhost:3111${data.slipImage}`);
//         }
//       } else {
//         setError("❌ ไม่พบการชำระเงิน");
//       }
//     } catch (err) {
//       console.error("❌ fetchSlipData error:", err);
//       setError("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmPayment = async () => {
//     if (!auctionId) return;
//     setConfirming(true);
//     try {
//       const res = await fetch(`${API_URL}/payment/confirm-payment/by-auction/${auctionId}`, {
//         method: 'POST',
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("✅ ยืนยันการชำระเงินแล้ว");
//         await fetchSlipData();
//       } else {
//         alert(data.message || "❌ ยืนยันล้มเหลว");
//       }
//     } catch (err) {
//       alert("❌ เกิดข้อผิดพลาด");
//     } finally {
//       setConfirming(false);
//     }
//   };

//   const handleUpdateShipping = async () => {
//     if (!paymentId) return alert("ไม่พบข้อมูลการชำระเงิน");
//     setUpdating(true);

//     try {
//       const res = await fetch(`${API_URL}/payment/shipping-status/${paymentId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ shippingStatus, trackingNumber }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("📦 อัปเดตสถานะจัดส่งแล้ว");
//         await fetchSlipData();
//       } else {
//         alert(data.message || "❌ อัปเดตล้มเหลว");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ เกิดข้อผิดพลาด");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   useEffect(() => {
    
//     fetchSlipData();
//   }, [auctionId]);

//   if (loading || !auction) return <div className="text-center p-6">⏳ กำลังโหลดข้อมูล...</div>;
//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูล...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div >
//       <CheckPayment />
//       <div className="container mx-auto px-4 py-8">
        
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left Side - Product Details */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             {/* <h2 className="text-xl font-semibold mb-4">รายละเอียดการสั่งซื้อ</h2> */}
            
//             <div className="space-y-4">

//               {/* Add Shipping Address Section */}
//               <div className="pt-4">
//                 <h3 className="text-xl font-semibold mb-4">ที่อยู่จัดส่ง</h3>
//                 <p>ชื่อผู้รับ: {recipientName}</p>
//                 <p>เบอร์โทร: {recipientPhone}</p>
//                 <p>ที่อยู่: {shippingAddress}</p>
//               </div>

//               <div className="mt-4 text-sm">
//               <label className="block font-medium mb-1">หมายเหตุ</label>
//               <p>{note}</p>
//             </div>

//             </div>
//           </div>

//           {/* Right Side - Payment Section */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">เลือกวิธีการชำระเงิน</h2>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-gray-600 mb-2">ยอดที่ต้องชำระ</p>
//               <p className="text-2xl font-bold text-blue-600">
//               {} บาท
//               </p>
//             </div>

//             {slip ? (
//             <>
//               <img src={slip} alt="Slip" className="w-56 h-56 rounded shadow-lg mx-auto mb-4" />
//               <p className={`text-lg font-bold ${isPaid ? "text-green-600" : "text-yellow-600"}`}>
//                 {isPaid ? "✅ การชำระเงินได้รับการยืนยันแล้ว" : "⏳ ยังไม่ได้ยืนยันการชำระเงิน"}
//               </p>

//               {!isPaid && (
//                 <button
//                   onClick={handleConfirmPayment}
//                   disabled={confirming}
//                   className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   ✅ ยืนยันการชำระเงิน
//                 </button>
//               )}

//               {isPaid && (
//                 <div className="mt-6 border-t pt-4">
//                   <h2 className="text-lg font-semibold text-gray-800 mb-2">📦 อัปเดตสถานะการจัดส่ง</h2>
//                   <select
//                     value={shippingStatus}
//                     onChange={(e) => setShippingStatus(e.target.value)}
//                     className="border px-3 py-2 rounded mb-3 w-full"
//                   >
//                     <option value="">-- เลือกสถานะ --</option>
//                     <option value="not_sent">ยังไม่จัดส่ง</option>
//                     <option value="shipped">จัดส่งแล้ว</option>
//                     <option value="delivered">จัดส่งสำเร็จ</option>
//                   </select>

//                   <input
//                     type="text"
//                     value={trackingNumber}
//                     onChange={(e) => setTrackingNumber(e.target.value)}
//                     placeholder="เลขพัสดุ (ถ้ามี)"
//                     className="border px-3 py-2 rounded w-full mb-3"
//                   />

//                   <button
//                     onClick={handleUpdateShipping}
//                     disabled={updating}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
//                   >
//                     อัปเดต
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <p className="text-gray-500">⏳ ลูกค้ายังไม่ได้อัปโหลดสลิป</p>
//           )}

//             {/* <img src={''} alt="Slip" className="w-56 h-56 rounded shadow-lg mx-auto mb-4" /> */}
            
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CheckPaymentPage