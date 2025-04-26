"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  FaChartLine, 
  FaBox, 
  FaUsers, 
  FaMoneyBillWave,
  FaExclamationCircle,
  FaBars,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa'

function NavAdmin({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Add effect to redirect to dashboard if on root admin path
  useEffect(() => {
    if (pathname === '/Admin' || pathname === '/Admin/') {
      router.push('/Admin/dashboard')
    }
  }, [pathname, router])

  const handleLogout = () => {
    // Add logout logic here
    router.push('/')
  }

  return (
    <div className="flex h-screen">
      {/* Header Component */}
      <header className="fixed top-0 w-full bg-[#FFA6D4] text-white p-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl mr-4"
          >
            <FaBars />
          </button>
          <h1 
            onClick={() => router.push('/Admin/dashboard')}
            className="text-2xl font-bold cursor-pointer hover:text-gray-200 transition-colors"
          >
            Toy Auction Admin
          </h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2"
          >
            <FaUser className="text-xl" />
            <span>Admin</span>
          </button>
          
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Menu Component */}
      <nav className={`fixed left-0 top-16 h-full w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="py-4">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 px-6 py-3 hover:bg-gray-700 ${
                pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Router Outlet */}
      <main className={`flex-1 mt-16 p-6 ${isMenuOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
        {children}
      </main>
    </div>
  )
}

// Menu items configuration
const menuItems = [
  {
    path: '/Admin/dashboard',
    label: 'Dashboard',
    icon: <FaChartLine />
  },
  {
    path: '/Admin/products',
    label: 'จัดการสินค้า',
    icon: <FaBox />
  },
  {
    path: '/Admin/users',
    label: 'จัดการผู้ใช้',
    icon: <FaUsers />
  },
  {
    path: '/Admin/transactions',
    label: 'ตรวจสอบการชำระเงิน',
    icon: <FaMoneyBillWave />
  },
  // {
  //   path: '/Admin/complaints',
  //   label: 'คำร้องเรียน',
  //   icon: <FaExclamationCircle />
  // }
]

export default NavAdmin

// "use client"

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { useRouter, usePathname } from 'next/navigation'
// import { 
//   FaChartLine, 
//   FaBox, 
//   FaUsers, 
//   FaMoneyBillWave,
//   FaExclamationCircle,
//   FaBars,
//   FaUser,
//   FaSignOutAlt
// } from 'react-icons/fa'

// function NavAdmin({ children }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)

//   const handleLogout = () => {
//     // Add logout logic here
//     router.push('/login')
//   }

//   return (
//     <div className="flex h-screen">
//       {/* Header Component */}
//       <header className="fixed top-0 w-full bg-[#FFA6D4] text-white p-4 flex justify-between items-center z-50">
//         <div className="flex items-center">
//           <button 
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-2xl mr-4"
//           >
//             <FaBars />
//           </button>
//           <h1 
//             onClick={() => router.push('/Admin')}
//             className="text-2xl font-bold cursor-pointer hover:text-gray-200 transition-colors"
//           >
//             Toy Auction Admin
//           </h1>
//         </div>
        
//         <div className="relative">
//           <button 
//             onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//             className="flex items-center space-x-2"
//           >
//             <FaUser className="text-xl" />
//             <span>Admin</span>
//           </button>
          
//           {showProfileDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
//               >
//                 <FaSignOutAlt />
//                 <span>ออกจากระบบ</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Menu Component */}
//       <nav className={`fixed left-0 top-16 h-full w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out ${
//         isMenuOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         <div className="py-4">
//           {menuItems.map((item) => (
//             <Link 
//               key={item.path}
//               href={item.path}
//               className={`flex items-center space-x-2 px-6 py-3 hover:bg-gray-700 ${
//                 pathname === item.path ? 'bg-gray-700' : ''
//               }`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </div>
//       </nav>

//       {/* Router Outlet */}
//       <main className={`flex-1 mt-16 p-6 ${isMenuOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
//         {children}
//       </main>
//     </div>
//   )
// }

// // Menu items configuration
// const menuItems = [
//   {
//     path: '/Admin/dashboard',
//     label: 'Dashboard',
//     icon: <FaChartLine />
//   },
//   {
//     path: '/Admin/products',
//     label: 'จัดการสินค้า',
//     icon: <FaBox />
//   },
//   {
//     path: '/Admin/users',
//     label: 'จัดการผู้ใช้',
//     icon: <FaUsers />
//   },
//   {
//     path: '/Admin/transactions',
//     label: 'ตรวจสอบการชำระเงิน',
//     icon: <FaMoneyBillWave />
//   },
//   {
//     path: '/Admin/complaints',
//     label: 'คำร้องเรียน',
//     icon: <FaExclamationCircle />
//   }
// ]

// export default NavAdmin

// "use client"

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { useRouter, usePathname } from 'next/navigation'
// import { 
//   FaChartLine, 
//   FaBox, 
//   FaUsers, 
//   FaMoneyBillWave,
//   FaExclamationCircle,
//   FaBars,
//   FaUser,
//   FaSignOutAlt
// } from 'react-icons/fa'

// function NavAdmin({ children }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)

//   const handleLogout = () => {
//     // Add logout logic here
//     router.push('/login')
//   }

//   // Add handlers for mouse events
//   const handleMenuEnter = () => {
//     setIsMenuOpen(true);
//   };

//   const handleMenuLeave = () => {
//     setIsMenuOpen(false);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Header Component */}
//       <header className="fixed top-0 w-full bg-[#FFA6D4] text-white p-4 flex justify-between items-center z-50">
//         <div className="flex items-center">
//           <button 
//             onMouseEnter={handleMenuEnter}
//             className="text-2xl mr-4"
//           >
//             <FaBars />
//           </button>
//           <h1 
//             onClick={() => router.push('/Admin/dashboard')}
//             className="text-2xl font-bold cursor-pointer hover:text-gray-200 transition-colors"
//           >
//             Toy Auction Admin
//           </h1>
//         </div>
        
//         <div className="relative">
//           <button 
//             onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//             className="flex items-center space-x-2"
//           >
//             <FaUser className="text-xl" />
//             <span>Admin</span>
//           </button>
          
//           {showProfileDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
//               >
//                 <FaSignOutAlt />
//                 <span>ออกจากระบบ</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Menu Component */}
//       <nav 
//         className={`fixed left-0 top-16 h-full w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out ${
//           isMenuOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//         onMouseEnter={handleMenuEnter}
//         onMouseLeave={handleMenuLeave}
//       >
//         <div className="py-4">
//           {menuItems.map((item) => (
//             <Link 
//               key={item.path}
//               href={item.path}
//               className={`flex items-center space-x-2 px-6 py-3 hover:bg-gray-700 ${
//                 pathname === item.path ? 'bg-gray-700' : ''
//               }`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           ))}
//         </div>
//       </nav>

//       {/* Router Outlet */}
//       <main className={`flex-1 mt-16 p-6 ${isMenuOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
//         {children}
//       </main>
//     </div>
//   )
// }

// // Menu items configuration
// const menuItems = [
//   {
//     path: '/Admin/dashboard',
//     label: 'Dashboard',
//     icon: <FaChartLine />
//   },
//   {
//     path: '/Admin/products',
//     label: 'จัดการสินค้า',
//     icon: <FaBox />
//   },
//   {
//     path: '/Admin/users',
//     label: 'จัดการผู้ใช้',
//     icon: <FaUsers />
//   },
//   {
//     path: '/Admin/transactions',
//     label: 'ตรวจสอบการชำระเงิน',
//     icon: <FaMoneyBillWave />
//   },
//   {
//     path: '/Admin/complaints',
//     label: 'คำร้องเรียน',
//     icon: <FaExclamationCircle />
//   }
// ]

// export default NavAdmin

// "use client"

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { 
//   FaChartLine, 
//   FaBox, 
//   FaUsers, 
//   FaMoneyBillWave,
//   FaExclamationCircle,
//   FaBars,
//   FaUser,
//   FaSignOutAlt
// } from 'react-icons/fa'

// function NavAdmin() {
//   const router = useRouter()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)

//   const handleLogout = () => {
//     // Add logout logic here
//     router.push('/login')
//   }

//   return (
//     <div className="flex h-screen">
//       {/* Header Component */}
//       <header className="fixed top-0 w-full bg-[#FFA6D4] text-white p-4 flex justify-between items-center z-50">
//         <div className="flex items-center">
//           <button 
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-2xl mr-4"
//           >
//             <FaBars />
//           </button>
//           <h1 className="text-2xl font-bold">Toy Auction Admin</h1>
//         </div>
        
//         <div className="relative">
//           <button 
//             onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//             className="flex items-center space-x-2"
//           >
//             <FaUser className="text-xl" />
//             <span>Admin</span>
//           </button>
          
//           {showProfileDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
//               >
//                 <FaSignOutAlt />
//                 <span>ออกจากระบบ</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Menu Component */}
//       <nav className={`fixed left-0 top-16 h-full w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out ${
//         isMenuOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         <div className="py-4">
//           <Link href="/Admin/dashboard" className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-700">
//             <FaChartLine />
//             <span>Dashboard</span>
//           </Link>
//           <Link href="/Admin/products" className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-700">
//             <FaBox />
//             <span>จัดการสินค้า</span>
//           </Link>
//           <Link href="/Admin/users" className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-700">
//             <FaUsers />
//             <span>จัดการผู้ใช้</span>
//           </Link>
//           <Link href="/Admin/transactions" className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-700">
//             <FaMoneyBillWave />
//             <span>ตรวจสอบการชำระเงิน</span>
//           </Link>
//           <Link href="/Admin/complaints" className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-700">
//             <FaExclamationCircle />
//             <span>คำร้องเรียน</span>
//           </Link>
//         </div>
//       </nav>

//       {/* Router Outlet */}
//       <main className={`flex-1 mt-16 p-6 ${isMenuOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
//         {/* Content will be rendered here */}
//       </main>
//     </div>
//   )
// }

// export default NavAdmin