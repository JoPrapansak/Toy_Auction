'use client'

import React, { useState } from 'react'
import Link from 'next/link'

function Navbar() {

  // const handleLogout = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3111/api/v1/auth/logout', {
  //       method: 'POST',
  //       credentials: 'include', // ส่ง cookies ไปกับ request
  //     });

  //     if (res.status === 200) {
  //       console.log('Logged out successfully');
  //       // ลบ session หรือรีเฟรชหน้า
  //       window.location.href = '/';
  //     } else {
  //       console.error('Failed to log out:', res.status);
  //     }
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };

  return (
    <div>
      <nav className="bg-red-600 text-white py-3">
        <div className="container mx-auto">
          <div className='flex justify-between items-center'>
            <div className="flex-1 flex justify-center items-center">
              <div className="text-2xl font-semibold ms-3">
                Toy Auction
              </div>
              <input
                type="text"
                placeholder="ค้นหาสินค้า"
                className="w-1/3 p-2 rounded ms-3"
              />
            </div>
            <ul className='flex'>
              <li className='ms-3'><Link href="/register">สมัครสมาชิก</Link></li>
              <li className='ms-3'><Link href="/login">ล็อคอิน</Link></li>
              {/* Notification Bell */}
              {/* <li className='ms-3 relative'>
                <button className="hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                </button>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
      <nav className='bg-red-600 text-white py-3'>
        <div className='container mx-auto'>
          <div className='flex justify-center items-center'>
            <ul className='flex space-x-10'>
              <li className='ms-3'><Link href="/">หน้าหลัก</Link></li>
              <li className='ms-3'><Link href="/product">สินค้าประมูล</Link></li>
              <li className='ms-3'><Link href="/about">เกี่ยวกับเรา</Link></li>
              <li className='ms-3'><Link href="/contact">ติดต่อเรา</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;


// 'use client'

// import React, {useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {signOut} from 'next-auth/react'


// function Navbar({session}) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };
//   return (
//     <div>
//       <nav className="bg-red-600 text-white py-3">
//         <div className="container mx-auto">
//             <div className='flex justify-between items-center'>
                
//                 <div className="flex-1 flex justify-center items-center">
//                     <div className="text-2xl font-semibold ms-3">
//                       Toy Auction
//                     </div>
//                     <input
//                     type="text"
//                     placeholder="ค้นหาสินค้า"
//                     className="w-1/3 p-2 rounded ms-3"
//                     />
//                 </div>
//                 <ul className='flex'>
//                   {!session ?(
//                     <>
//                     <li className='ms-3'><Link href="/register">สมัครสมาชิก</Link></li>
//                     <li className='ms-3'><Link href="/login">ล็อคอิน</Link></li>
//                     <li className='ms-3'><a onClick={() => signOut()}>ล็อคเอ้าท์</a></li>

//                     </>
//                   ) : (

//                     <>
//                     {/* <div className="relative">
//                       <button onClick={toggleDropdown} className="flex items-  center focus:outline-none">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                       </svg>
//                       </button> 
//                       {dropdownOpen && (
//                         <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
//                           <Link href="/profile" legacyBehavior>
//                             <a className="block px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">Profile</a>
//                           </Link>
//                           <Link href="/settings" legacyBehavior>
//                             <a className="block px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">Settings</a>
//                           </Link>
//                           <Link href="/" legacyBehavior>
//                             <a onClick={() => signOut()} className="block px-4 py-2 text-gray-800 hover:bg-red-800 hover:text-white rounded-lg">Logout</a>
//                           </Link>
//                         </div>
//                       )}
//                     </div> */}
//                     </>
//                   )}
//                 </ul>
//             </div>
//         </div>
//       </nav>
//       <nav className='bg-red-600 text-white py-3'>
//         <div className='container mx-auto'>
//             <div className='flex justify-center items-center'>
//                 <ul className='flex space-x-10'>
//                     <li className='ms-3'><Link href="/home">หน้าหลัก</Link></li>
//                     <li className='ms-3'><Link href="/product">สินค้าประมูล</Link></li>
//                     <li className='ms-3'><Link href="/asked">คำถามที่พบบ่อย</Link></li>
//                     <li className='ms-3'><Link href="/about">เกี่ยวกับเรา</Link></li>
//                 </ul>
//             </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default Navbar