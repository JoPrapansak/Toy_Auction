'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function NavUser() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
        method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
        credentials: 'include', // ส่ง cookies ไปกับ request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logged out successfully');
        // ลบ session หรือรีเฟรชหน้า
        window.location.href = '/';
      } else {
        console.error('Failed to log out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
            <ul className='flex items-center'>
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                  <span className="text-base font-medium ml-2">Username</span>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <Link href="profile" legacyBehavior>
                        <a className="block px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">Profile</a>
                      </Link>
                      <Link href="/settings" legacyBehavior>
                        <a className="block px-4 py-2 text-black hover:bg-yellow-400 hover:text-white rounded-lg">Settings</a>
                      </Link>
                      <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-800 hover:text-white rounded-lg cursor-pointer">
                        Logout
                      </a>
                    </div>
                  )}
                </div>
                {/* Notification Bell - Aligned */}
                <div className="flex items-center">
                  <button className="hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <nav className='bg-red-600 text-white py-3'>
        <div className='container mx-auto'>
          <div className='flex justify-center items-center'>
            <ul className='flex space-x-10'>
              <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
              <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
              <li className='ms-3'><Link href="/asked">คำถามที่พบบ่อย</Link></li>
              <li className='ms-3'><Link href="/about">เกี่ยวกับเรา</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default NavUser;