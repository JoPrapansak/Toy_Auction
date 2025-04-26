'use client'

import React, { useEffect, useState } from 'react'
import NavAdmin from '../../components/NavAdmin'
const API_URL = "http://localhost:3111/api/v1/admin"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalAuctions: 0,
    successfulAuctions: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`)
        const data = await res.json()
        setDashboardData(data)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      }
    }

    fetchData()
  }, [])

  const salesData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
    datasets: [{
      label: 'ยอดขายรายเดือน',
      data: [65, 59, 80, 81, 56, 55],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  const categoryData = {
    labels: ['Gunpla', 'Figure', 'Art Toy', 'อื่นๆ'],
    datasets: [{
      data: [30, 25, 35, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
    }]
  }

  const bidActivityData = {
    labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
    datasets: [{
      label: 'จำนวนการประมูล',
      data: [12, 19, 3, 5, 2, 3, 15],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    }]
  }

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">จำนวนสินค้าทั้งหมด</h2>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.totalAuctions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">ผู้ใช้งานทั้งหมด</h2>
            <p className="text-3xl font-bold text-green-600">{dashboardData.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">การประมูลที่สำเร็จ</h2>
            <p className="text-3xl font-bold text-yellow-600">{dashboardData.successfulAuctions}</p>
          </div>
        </div>

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6">ยอดขายรายเดือน</h3>
            <div className="h-[400px]">
              <Line data={salesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6">สัดส่วนหมวดหมู่สินค้า</h3>
            <div className="h-[400px] flex items-center justify-center">
              <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
            <h3 className="text-xl font-semibold mb-6">กิจกรรมการประมูลรายวัน</h3>
            <div className="h-[300px]">
              <Bar data={bidActivityData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>         */}
      </div>
    </div>
  )
}


// 'use client'

// import React from 'react'
// import NavAdmin from '../../components/NavAdmin'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js'
// import { Line, Bar, Doughnut } from 'react-chartjs-2'

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// )

// export default function DashboardPage() {
//   // Sample data for charts
//   const salesData = {
//     labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
//     datasets: [{
//       label: 'ยอดขายรายเดือน',
//       data: [65, 59, 80, 81, 56, 55],
//       fill: false,
//       borderColor: 'rgb(75, 192, 192)',
//       tension: 0.1
//     }]
//   }

//   const categoryData = {
//     labels: ['Gunpla', 'Figure', 'Art Toy', 'อื่นๆ'],
//     datasets: [{
//       data: [30, 25, 35, 10],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.8)',
//         'rgba(54, 162, 235, 0.8)',
//         'rgba(255, 206, 86, 0.8)',
//         'rgba(75, 192, 192, 0.8)',
//       ],
//     }]
//   }

//   const bidActivityData = {
//     labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
//     datasets: [{
//       label: 'จำนวนการประมูล',
//       data: [12, 19, 3, 5, 2, 3, 15],
//       backgroundColor: 'rgba(153, 102, 255, 0.5)',
//     }]
//   }

//   return (
//     <div>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">จำนวนสินค้าทั้งหมด</h2>
//             <p className="text-3xl font-bold text-blue-600">150</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">ผู้ใช้งานทั้งหมด</h2>
//             <p className="text-3xl font-bold text-green-600">1,234</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">การประมูลที่สำเร็จ</h2>
//             <p className="text-3xl font-bold text-yellow-600">89</p>
//           </div>
//           {/* <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">คำร้องเรียนที่รอดำเนินการ</h2>
//             <p className="text-3xl font-bold text-red-600">5</p>
//           </div> */}
//         </div>

//         {/* Charts Grid - Updated size */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           {/* Sales Line Chart */}
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-xl font-semibold mb-6">ยอดขายรายเดือน</h3>
//             <div className="h-[400px]">
//               <Line 
//                 data={salesData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     }
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           {/* Category Distribution - Updated size */}
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-xl font-semibold mb-6">สัดส่วนหมวดหมู่สินค้า</h3>
//             <div className="h-[400px] flex items-center justify-center">
//               <Doughnut 
//                 data={categoryData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: {
//                       position: 'bottom',
//                     }
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           {/* Bid Activity */}
//           <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
//             <h3 className="text-xl font-semibold mb-6">กิจกรรมการประมูลรายวัน</h3>
//             <div className="h-[300px]">
//               <Bar 
//                 data={bidActivityData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false
//                 }}
//               />
//             </div>
//           </div>
//         </div>        
//       </div>
//     </div>
//   )
// }