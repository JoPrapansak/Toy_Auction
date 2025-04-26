'use client'

import React, { useEffect, useState } from 'react'
import NavAdmin from '../../components/NavAdmin'

const API_URL = "http://localhost:3111/api/v1/admin"

export default function TransactionsPage() {

  const [payments, setPayment] = useState([])
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`${API_URL}/payments?_=${Date.now()}`)
        const data = await response.json()
        setPayment(data.payments)
      } catch (error) {
        console.error("Error fetching payment:", error)
      }
    }
    fetchPayment() 
  }, [])

  const handleViewSlip = (slipImage) => {
    setSelectedSlip(slipImage);
  };

  const closeSlipModal = () => {
    setSelectedSlip(null);
  };

  return (
    <div>
      {/* <NavAdmin /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">ตรวจสอบการชำระเงิน</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <input
              type="search"
              placeholder="ค้นหาธุรกรรม..."
              className="p-2 border rounded-lg w-64"
            />
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รหัสธุรกรรม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อสินค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จำนวนเงิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมายเหตุ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment?.auctionId?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount} บาท
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewSlip(payment.slipImage)}
                    >
                      ตรวจสอบสลิป
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing slip */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={closeSlipModal}
            >
              ✖
            </button>
            <img
              src={`http://localhost:3111${selectedSlip}`}
              alt="Slip"
              className="w-full h-auto mt-4 rounded-lg"
              onError={(e) => {
                e.target.src = "/default-slip.png"; // fallback
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 'use client'

// import React, { useEffect, useState } from 'react'
// import NavAdmin from '../../components/NavAdmin'

// const API_URL = "http://localhost:3111/api/v1/admin"

// export default function TransactionsPage() {

//   const [payments, setPayment] = useState([])
//   // const auctionId = searchParams.get('auctionId');
//   // const [auction, setAuction] = useState(null);

//   useEffect(() => {
//     const fetchPayment = async () => {
//       try {
//         const response = await fetch(`${API_URL}/payments?_=${Date.now()}`)
//         const data = await response.json()
//         setPayment(data.payments)
//       } catch (error) {
//         console.error("Error fetching payment:", error)
//       }
//     }
//     fetchPayment() 
//   }, [])

//   // const [transactions, setTransactions] = useState([
//   //   {
//   //     id: 'TXN001',
//   //     productName: 'สินค้า A',
//   //     amount: 1500,
//   //     status: 'สำเร็จ',
//   //   },
//   //   {
//   //     id: 'TXN002',
//   //     productName: 'สินค้า B',
//   //     amount: 2500,
//   //     status: 'รอดำเนินการ',
//   //   },
//   //   {
//   //     id: 'TXN003',
//   //     productName: 'สินค้า C',
//   //     amount: 3500,
//   //     status: 'ล้มเหลว',
//   //   },
//   // ]);

//   return (
//     <div>
//       {/* <NavAdmin /> */}
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">ตรวจสอบการชำระเงิน</h1>
//         <div className="bg-white rounded-lg shadow">
//           <div className="p-4">
//             <input
//               type="search"
//               placeholder="ค้นหาธุรกรรม..."
//               className="p-2 border rounded-lg w-64"
//             />
//           </div>
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   รหัสธุรกรรม
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ชื่อสินค้า
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   จำนวนเงิน
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
//               {payments.map((payment, idx) => (
//                 <tr key={idx}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {payment._id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {payment?.auctionId?.name}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {payment.amount} บาท
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {payment.status}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <button className="text-blue-500 hover:underline">ดูรายละเอียด</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }