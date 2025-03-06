'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo } from 'react-icons/fa'

const API_URL = "http://localhost:3111/api/v1";

function NavUser() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileImage, setProfileImage] = useState(null)
  const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile', {
          credentials: 'include'
        })

        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

        const data = await response.json()
        setProfile(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchProfileImage = async () => {
      try {
        const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
          credentials: 'include'
        })
        
        if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")

        const data = await res.json()
        setProfileImage(data.image) // ใช้ Base64 Image
      } catch (err) {
        console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
      }
    }

    fetchProfile()
    fetchProfileImage()
  }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Add new state for expanded view
  const [showAllNotifications, setShowAllNotifications] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
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
    const [searchText, setSearchText] = React.useState("")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/auction/notifications`, { credentials: 'include' });
        const data = await response.json();
        if (data.status === 'success') {
          setNotifications(data.data);
          setUnreadCount(data.data.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    setUnreadCount(0);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    await fetch(`${API_URL}/auction/notifications/read-all`, {
      method: "POST",
      credentials: 'include'
    });
  };

  return (
    <div>
    <nav className="bg-[#FFA6D4] text-white py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1 flex justify-center items-center">
              <div className="text-3xl font-cute font-semibold me-9">
                Toy Auction
              </div>
              <input
                type="text"
                style={{ fontFamily: "'Mali',sans-serif"}}
                placeholder="ค้นหาสินค้า"
                className="w-1/3 p-2 rounded ms-3"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <ul className='flex items-center'>
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center focus:outline-none hover:opacity-80"
                >
                  {profileImage ? (
                    <img
                      src={profileImage || "/image/profile1.jpg"}
                      alt="Profile"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                  )}
                </button>
                  {/* <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button> */}
                  <span className="text-base font-medium ml-2">{profile?.profile?.name || 'ไม่ระบุ'}</span>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"style={{ fontFamily: "'Mali',sans-serif"}}>
                      <Link href="profile" legacyBehavior>
                        <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Profile</a>
                      </Link>
                      <Link href="/my-auctions" legacyBehavior>
                        <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">MyAuction</a>
                      </Link>
                      <Link href="/settings" legacyBehavior>
                        <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Settings</a>
                      </Link>
                      <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-lg cursor-pointer">
                        Logout
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Create Auction Button */}
                {/* <Link href="/create-auction" legacyBehavior>
                  <a className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"style={{ fontFamily: "'Mali',sans-serif"}}>
                    <FaPlus className="w-4 h-4" />
                    <span className="font-medium">สร้างประมูล</span>
                  </a>
                </Link> */}
                
                {/* Notification Bell */}
                <div className="relative flex items-center" ref={notificationRef}>
                  <button 
                    className="relative hover:text-gray-200"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                  >
                    <FaBell className="w-8 h-8" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
                        <button onClick={markAllAsRead} className="text-blue-600 text-sm">อ่านทั้งหมด</button>
                      </div>

                      {/* Notification Items */}
                      <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-500 p-4">ไม่มีการแจ้งเตือน</p>
                        ) : (
                          notifications.map((notification, index) => (
                            <div key={notification.id || index} className="p-4 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  {notification.type === 'time_warning' ? (
                                    <FaClock className="h-6 w-6 text-purple-500" />
                                  ) : notification.type === 'auction_end' ? (
                                    <FaCheckCircle className="h-6 w-6 text-green-500" />
                                  ) : (
                                    <FaInfo className="h-6 w-6 text-blue-500" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-gray-800">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        {/* View All Link
                      <div className="p-4 text-center border-t border-gray-200">
                        <button onClick={() => setShowAllNotifications(!showAllNotifications)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {showAllNotifications ? 'แสดงน้อยลง' : 'ดูการแจ้งเตือนทั้งหมด'}
                        </button>
                      </div> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ul>
      </div>
    </nav>
    <nav className='bg-[#FFA6D4] text-white py-3'style={{ fontFamily: "'Mali',sans-serif"}}>
        <div className='container mx-auto'>
          <div className='flex justify-center items-center'>
            <ul className='flex space-x-10'>
              <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
              <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
              <li className='ms-3'><Link href="/winner">ประกาศผู้ชนะ</Link></li>
              <li className='ms-3'><Link href="/contacts">ติดต่อเรา</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavUser;


// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'

// // Add imports for icons
// import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo, FaPlus } from 'react-icons/fa'

// function NavUser() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp
//   const [unreadCount, setUnreadCount] = useState(0);
//   // const []

//   useEffect(() => {
//       const fetchProfile = async () => {
//         try {
//           const response = await fetch('http://localhost:3111/api/v1/profile', {
//             credentials: 'include'
//           })
  
//           if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')
  
//           const data = await response.json()
//           setProfile(data.data)
//         } catch (err) {
//           setError(err.message)
//         } finally {
//           setLoading(false)
//         }
//       }
  
//       const fetchProfileImage = async () => {
//         try {
//           const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//             credentials: 'include'
//           })
          
//           if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")
  
//           const data = await res.json()
//           setProfileImage(data.image) // ใช้ Base64 Image
//         } catch (err) {
//           console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//         }
//       }
  
//       fetchProfile()
//       fetchProfileImage()
//     }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Add new state for notification dropdown
//   const [notificationOpen, setNotificationOpen] = useState(false)
//   const notificationRef = useRef(null)

//   // Add new state for expanded view
//   const [showAllNotifications, setShowAllNotifications] = useState(false)

//   // Remove the static notifications array and add these states
//   const [notifications, setNotifications] = useState([])
//   const [notificationCount, setNotificationCount] = useState(0)

//   // Add useEffect to fetch notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(`${API_URL}/auction/notifications`, { credentials: 'include' });
//         const data = await response.json();
//         if (data.status === 'success') {
//           setNotifications(data.data);
//           setUnreadCount(data.data.filter(n => !n.read).length);
//         }
//       } catch (err) {
//         console.error("Error fetching notifications", err);
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const markAllAsRead = async () => {
//     setUnreadCount(0);
//     setNotifications(notifications.map(n => ({ ...n, read: true })));
//     await fetch(`${API_URL}/auction/notifications/read-all`, {
//       method: "POST",
//       credentials: 'include'
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false)
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
//         method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
//         credentials: 'include', // ส่ง cookies ไปกับ request
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         console.log('Logged out successfully');
//         // ลบ session หรือรีเฟรชหน้า
//         window.location.href = '/';
//       } else {
//         console.error('Failed to log out:', response.status);
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
//     const [searchText, setSearchText] = React.useState("")
//   return (
//     <div>
//       <nav className="bg-[#FFA6D4] text-white py-3">
//         <div className="container mx-auto">
//           <div className='flex justify-between items-center'>
//             <div className="flex-1 flex justify-center items-center">
//               <div className="text-3xl font-cute font-semibold me-9">
//                 Toy Auction
//               </div>
//               <input
//                 type="text"
//                 style={{ fontFamily: "'Mali',sans-serif"}}
//                 placeholder="ค้นหาสินค้า"
//                 className="w-1/3 p-2 rounded ms-3"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>
//             <ul className='flex items-center'>
//               <div className="flex items-center space-x-4">
//                 <div className="relative flex items-center" ref={dropdownRef}>
//                 <button 
//                   onClick={() => setDropdownOpen(!dropdownOpen)} 
//                   className="flex items-center focus:outline-none hover:opacity-80"
//                 >
//                   {profileImage ? (
//                     <img
//                       src={profileImage || "/image/profile1.jpg"}
//                       alt="Profile"
//                       className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                       </svg>
//                     </div>
//                   )}
//                 </button>
//                   {/* <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none hover:text-gray-200">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                     </svg>
//                   </button> */}
//                   <span className="text-base font-medium ml-2">{profile?.profile?.name || 'ไม่ระบุ'}</span>
//                   {dropdownOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"style={{ fontFamily: "'Mali',sans-serif"}}>
//                       <Link href="profile" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Profile</a>
//                       </Link>
//                       <Link href="/my-auctions" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">MyAuction</a>
//                       </Link>
//                       <Link href="/settings" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Settings</a>
//                       </Link>
//                       <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-lg cursor-pointer">
//                         Logout
//                       </a>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Create Auction Button */}
//                 {/* <Link href="/create-auction" legacyBehavior>
//                   <a className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"style={{ fontFamily: "'Mali',sans-serif"}}>
//                     <FaPlus className="w-4 h-4" />
//                     <span className="font-medium">สร้างประมูล</span>
//                   </a>
//                 </Link> */}

//                 {/* Notification Bell */}
//         <div className="relative flex items-center" ref={notificationRef}>
//           <button 
//             className="relative hover:text-gray-200"
//             onClick={() => setNotificationOpen(!notificationOpen)}
//           >
//             <FaBell className="w-8 h-8" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {/* Notification Dropdown */}
//           {notificationOpen && (
//             <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//               <div className="p-4 border-b border-gray-200 flex justify-between">
//                 <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
//                 <button onClick={markAllAsRead} className="text-blue-600 text-sm">อ่านทั้งหมด</button>
//               </div>

//               {/* Notification Items */}
//               <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
//                 {notifications.length === 0 ? (
//                   <p className="text-center text-gray-500 p-4">ไม่มีการแจ้งเตือน</p>
//                 ) : (
//                   notifications.map((notification, index) => (
//                     <div key={notification.id || index} className="p-4 hover:bg-gray-50 cursor-pointer">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0">
//                           {notification.type === 'time_warning' ? (
//                             <FaClock className="h-6 w-6 text-purple-500" />
//                           ) : notification.type === 'auction_end' ? (
//                             <FaCheckCircle className="h-6 w-6 text-green-500" />
//                           ) : (
//                             <FaInfo className="h-6 w-6 text-blue-500" />
//                           )}
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm text-gray-800">{notification.message}</p>
//                           <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//             </div>
//           )}
//         </div>
//               </div>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       <nav className='bg-[#FFA6D4] text-white py-3'style={{ fontFamily: "'Mali',sans-serif"}}>
//         <div className='container mx-auto'>
//           <div className='flex justify-center items-center'>
//             <ul className='flex space-x-10'>
//               <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
//               <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
//               <li className='ms-3'><Link href="/winner">ประกาศผู้ชนะ</Link></li>
//               <li className='ms-3'><Link href="/contacts">ติดต่อเรา</Link></li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default NavUser;

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'

// // Add imports for icons
// import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo, FaPlus } from 'react-icons/fa'

// function NavUser() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp
//   // const []

//   useEffect(() => {
//       const fetchProfile = async () => {
//         try {
//           const response = await fetch('http://localhost:3111/api/v1/profile', {
//             credentials: 'include'
//           })
  
//           if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')
  
//           const data = await response.json()
//           setProfile(data.data)
//         } catch (err) {
//           setError(err.message)
//         } finally {
//           setLoading(false)
//         }
//       }
  
//       const fetchProfileImage = async () => {
//         try {
//           const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//             credentials: 'include'
//           })
          
//           if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")
  
//           const data = await res.json()
//           setProfileImage(data.image) // ใช้ Base64 Image
//         } catch (err) {
//           console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//         }
//       }
  
//       fetchProfile()
//       fetchProfileImage()
//     }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Add new state for notification dropdown
//   const [notificationOpen, setNotificationOpen] = useState(false)
//   const notificationRef = useRef(null)

//   // Add new state for expanded view
//   const [showAllNotifications, setShowAllNotifications] = useState(false)

//   // Remove the static notifications array and add these states
//   const [notifications, setNotifications] = useState([])
//   const [notificationCount, setNotificationCount] = useState(0)

//   // Add useEffect to fetch notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch('${API_URL}/auction/notifications', { 
//           credentials: 'include' });
//         const data = await response.json();
//         if (data.status === 'success') {
//           setNotifications(data.data);
//           setUnreadCount(data.data.filter(n => !n.read).length);
//         }
//       } catch (err) {
//         console.error("Error fetching notifications", err);
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false)
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
//         method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
//         credentials: 'include', // ส่ง cookies ไปกับ request
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         console.log('Logged out successfully');
//         // ลบ session หรือรีเฟรชหน้า
//         window.location.href = '/';
//       } else {
//         console.error('Failed to log out:', response.status);
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
//     const [searchText, setSearchText] = React.useState("")
//   return (
//     <div>
//       <nav className="bg-[#FFA6D4] text-white py-3">
//         <div className="container mx-auto">
//           <div className='flex justify-between items-center'>
//             <div className="flex-1 flex justify-center items-center">
//               <div className="text-3xl font-cute font-semibold me-9">
//                 Toy Auction
//               </div>
//               <input
//                 type="text"
//                 style={{ fontFamily: "'Mali',sans-serif"}}
//                 placeholder="ค้นหาสินค้า"
//                 className="w-1/3 p-2 rounded ms-3"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>
//             <ul className='flex items-center'>
//               <div className="flex items-center space-x-4">
//                 <div className="relative flex items-center" ref={dropdownRef}>
//                 <button 
//                   onClick={() => setDropdownOpen(!dropdownOpen)} 
//                   className="flex items-center focus:outline-none hover:opacity-80"
//                 >
//                   {profileImage ? (
//                     <img
//                       src={profileImage || "/image/profile1.jpg"}
//                       alt="Profile"
//                       className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                       </svg>
//                     </div>
//                   )}
//                 </button>
//                   {/* <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none hover:text-gray-200">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                     </svg>
//                   </button> */}
//                   <span className="text-base font-medium ml-2">{profile?.profile?.name || 'ไม่ระบุ'}</span>
//                   {dropdownOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"style={{ fontFamily: "'Mali',sans-serif"}}>
//                       <Link href="profile" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Profile</a>
//                       </Link>
//                       <Link href="/my-auctions" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">MyAuction</a>
//                       </Link>
//                       <Link href="/settings" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Settings</a>
//                       </Link>
//                       <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-lg cursor-pointer">
//                         Logout
//                       </a>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Create Auction Button */}
//                 {/* <Link href="/create-auction" legacyBehavior>
//                   <a className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"style={{ fontFamily: "'Mali',sans-serif"}}>
//                     <FaPlus className="w-4 h-4" />
//                     <span className="font-medium">สร้างประมูล</span>
//                   </a>
//                 </Link> */}

//                 {/* Notification Bell */}
//                 <div className="relative flex items-center" ref={notificationRef}>
//                   <button 
//                     className="hover:text-gray-200"
//                     onClick={() => setNotificationOpen(!notificationOpen)}
//                   >
//                     <div className="relative">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
//                       </svg>
//                       {/* Notification Badge */}
//                       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {notificationCount}
//                       </span>
//                     </div>
//                   </button>

//                   {/* Notification Dropdown */}
//                   {notificationOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
//                       <div className="p-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
//                       </div>
                      
//                       {/* Notification Items */}
//                       <div className="divide-y divide-gray-200">
//                         {notifications.slice(0, showAllNotifications ? notifications.length : 3).map(notification => (
//                           <div 
//                             key={notification.id} 
//                             className="p-4 hover:bg-gray-50 cursor-pointer"
//                             onClick={() => {
//                               // Check if notification is about winning an auction
//                               if (notification.type === 'success' && notification.message.includes('ชนะการประมูล')) {
//                                 // Redirect to payment page
//                                 window.location.href = '/payment';
//                               }
//                             }}
//                           >
//                             <div className="flex items-start">
//                               <div className="flex-shrink-0">
//                                 {notification.icon === 'clock' ? (
//                                   <FaClock className="h-6 w-6 text-purple-500" />
//                                 ) : notification.type === 'success' ? (
//                                   <FaCheckCircle className="h-6 w-6 text-green-500" />
//                                 ) : notification.type === 'warning' ? (
//                                   <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
//                                 ) : notification.type === 'info' ? (
//                                   <FaInfo className="h-6 w-6 text-blue-500" />
//                                 ) : null}
//                               </div>
//                               <div className="ml-3">
//                                 <p className="text-sm text-gray-800">{notification.message}</p>
//                                 <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* View All Link */}
//                       <div className="p-4 text-center border-t border-gray-200">
//                         <button onClick={() => setShowAllNotifications(!showAllNotifications)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                           {showAllNotifications ? 'แสดงน้อยลง' : 'ดูการแจ้งเตือนทั้งหมด'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       <nav className='bg-[#FFA6D4] text-white py-3'style={{ fontFamily: "'Mali',sans-serif"}}>
//         <div className='container mx-auto'>
//           <div className='flex justify-center items-center'>
//             <ul className='flex space-x-10'>
//               <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
//               <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
//               <li className='ms-3'><Link href="/winner">ประกาศผู้ชนะ</Link></li>
//               <li className='ms-3'><Link href="/contacts">ติดต่อเรา</Link></li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default NavUser;

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'

// // Add imports for icons
// import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo, FaPlus } from 'react-icons/fa'

// function NavUser() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//       const fetchProfile = async () => {
//         try {
//           const response = await fetch('http://localhost:3111/api/v1/profile', {
//             credentials: 'include'
//           })
  
//           if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')
  
//           const data = await response.json()
//           setProfile(data.data)
//         } catch (err) {
//           setError(err.message)
//         } finally {
//           setLoading(false)
//         }
//       }
  
//       const fetchProfileImage = async () => {
//         try {
//           const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//             credentials: 'include'
//           })
          
//           if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")
  
//           const data = await res.json()
//           setProfileImage(data.image) // ใช้ Base64 Image
//         } catch (err) {
//           console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//         }
//       }
  
//       fetchProfile()
//       fetchProfileImage()
//     }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Add new state for notification dropdown
//   const [notificationOpen, setNotificationOpen] = useState(false)
//   const notificationRef = useRef(null)

//   // Add new state for expanded view
//   const [showAllNotifications, setShowAllNotifications] = useState(false)

//   // Add more notifications data
//   const notifications = [
//     {
//       id: 1,
//       type: 'success',
//       message: 'คุณชนะการประมูล Gundam RX-78-2',
//       time: '2 นาทีที่แล้ว',
//       icon: 'check'
//     },
//     {
//       id: 2,
//       type: 'warning',
//       message: 'มีผู้ประมูลสูงกว่าคุณ Figma Nendoroid',
//       time: '5 นาทีที่แล้ว',
//       icon: 'warning'
//     },
//     {
//       id: 3,
//       type: 'info',
//       message: 'การประมูล Art Toy จะสิ้นสุดในอีก 30 นาที',
//       time: '15 นาทีที่แล้ว',
//       icon: 'clock'
//     },
//     // More notifications...
//     {
//       id: 4,
//       type: 'success',
//       message: 'คุณชนะการประมูล Figure XYZ',
//       time: '1 ชั่วโมงที่แล้ว',
//       icon: 'check'
//     },
//     {
//       id: 5,
//       type: 'info',
//       message: 'มีสินค้าใหม่ในหมวดหมู่ที่คุณสนใจ',
//       time: '2 ชั่วโมงที่แล้ว',
//       icon: 'info'
//     }
//   ]

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false)
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
//         method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
//         credentials: 'include', // ส่ง cookies ไปกับ request
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         console.log('Logged out successfully');
//         // ลบ session หรือรีเฟรชหน้า
//         window.location.href = '/';
//       } else {
//         console.error('Failed to log out:', response.status);
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };
//     const [searchText, setSearchText] = React.useState("")
//   return (
//     <div>
//       <nav className="bg-[#FFA6D4] text-white py-3">
//         <div className="container mx-auto">
//           <div className='flex justify-between items-center'>
//             <div className="flex-1 flex justify-center items-center">
//               <div className="text-3xl font-cute font-semibold me-9">
//                 Toy Auction
//               </div>
//               <input
//                 type="text"
//                 style={{ fontFamily: "'Mali',sans-serif"}}
//                 placeholder="ค้นหาสินค้า"
//                 className="w-1/3 p-2 rounded ms-3"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>
//             <ul className='flex items-center'>
//               <div className="flex items-center space-x-4">
//                 <div className="relative flex items-center" ref={dropdownRef}>
//                 <button 
//                   onClick={() => setDropdownOpen(!dropdownOpen)} 
//                   className="flex items-center focus:outline-none hover:opacity-80"
//                 >
//                   {profileImage ? (
//                     <img
//                       src={profileImage || "/image/profile1.jpg"}
//                       alt="Profile"
//                       className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                       </svg>
//                     </div>
//                   )}
//                 </button>
//                   {/* <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none hover:text-gray-200">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                     </svg>
//                   </button> */}
//                   <span className="text-base font-medium ml-2">{profile?.profile?.name || 'ไม่ระบุ'}</span>
//                   {dropdownOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"style={{ fontFamily: "'Mali',sans-serif"}}>
//                       <Link href="profile" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Profile</a>
//                       </Link>
//                       <Link href="/my-auctions" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">MyAuction</a>
//                       </Link>
//                       <Link href="/settings" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Settings</a>
//                       </Link>
//                       <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-lg cursor-pointer">
//                         Logout
//                       </a>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Create Auction Button */}
//                 {/* <Link href="/create-auction" legacyBehavior>
//                   <a className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"style={{ fontFamily: "'Mali',sans-serif"}}>
//                     <FaPlus className="w-4 h-4" />
//                     <span className="font-medium">สร้างประมูล</span>
//                   </a>
//                 </Link> */}

//                 {/* Notification Bell */}
//                 <div className="relative flex items-center" ref={notificationRef}>
//                   <button 
//                     className="hover:text-gray-200"
//                     onClick={() => setNotificationOpen(!notificationOpen)}
//                   >
//                     <div className="relative">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
//                       </svg>
//                       {/* Notification Badge */}
//                       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         3
//                       </span>
//                     </div>
//                   </button>

//                   {/* Notification Dropdown */}
//                   {notificationOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
//                       <div className="p-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
//                       </div>
                      
//                       {/* Notification Items */}
//                       <div className="divide-y divide-gray-200">
//                         {notifications.slice(0, showAllNotifications ? notifications.length : 3).map(notification => (
//                           <div 
//                             key={notification.id} 
//                             className="p-4 hover:bg-gray-50 cursor-pointer"
//                             onClick={() => {
//                               // Check if notification is about winning an auction
//                               if (notification.type === 'success' && notification.message.includes('ชนะการประมูล')) {
//                                 // Redirect to payment page
//                                 window.location.href = '/payment';
//                               }
//                             }}
//                           >
//                             <div className="flex items-start">
//                               <div className="flex-shrink-0">
//                                 {notification.icon === 'clock' ? (
//                                   <FaClock className="h-6 w-6 text-purple-500" />
//                                 ) : notification.type === 'success' ? (
//                                   <FaCheckCircle className="h-6 w-6 text-green-500" />
//                                 ) : notification.type === 'warning' ? (
//                                   <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
//                                 ) : notification.type === 'info' ? (
//                                   <FaInfo className="h-6 w-6 text-blue-500" />
//                                 ) : null}
//                               </div>
//                               <div className="ml-3">
//                                 <p className="text-sm text-gray-800">{notification.message}</p>
//                                 <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* View All Link */}
//                       <div className="p-4 text-center border-t border-gray-200">
//                         <button onClick={() => setShowAllNotifications(!showAllNotifications)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                           {showAllNotifications ? 'แสดงน้อยลง' : 'ดูการแจ้งเตือนทั้งหมด'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       <nav className='bg-[#FFA6D4] text-white py-3'style={{ fontFamily: "'Mali',sans-serif"}}>
//         <div className='container mx-auto'>
//           <div className='flex justify-center items-center'>
//             <ul className='flex space-x-10'>
//               <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
//               <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
//               <li className='ms-3'><Link href="/winner">ประกาศผู้ชนะ</Link></li>
//               <li className='ms-3'><Link href="/contacts">ติดต่อเรา</Link></li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default NavUser;

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'

// // Add imports for icons
// import { FaCheckCircle, FaExclamationTriangle, FaBell, FaClock, FaInfo, FaPlus } from 'react-icons/fa'

// function NavUser() {
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const dropdownRef = useRef(null)

//   // Add new state for notification dropdown
//   const [notificationOpen, setNotificationOpen] = useState(false)
//   const notificationRef = useRef(null)

//   // Add new state for expanded view
//   const [showAllNotifications, setShowAllNotifications] = useState(false)

//   // Add more notifications data
//   const notifications = [
//     {
//       id: 1,
//       type: 'success',
//       message: 'คุณชนะการประมูล Gundam RX-78-2',
//       time: '2 นาทีที่แล้ว',
//       icon: 'check'
//     },
//     {
//       id: 2,
//       type: 'warning',
//       message: 'มีผู้ประมูลสูงกว่าคุณ Figma Nendoroid',
//       time: '5 นาทีที่แล้ว',
//       icon: 'warning'
//     },
//     {
//       id: 3,
//       type: 'info',
//       message: 'การประมูล Art Toy จะสิ้นสุดในอีก 30 นาที',
//       time: '15 นาทีที่แล้ว',
//       icon: 'clock'
//     },
//     // More notifications...
//     {
//       id: 4,
//       type: 'success',
//       message: 'คุณชนะการประมูล Figure XYZ',
//       time: '1 ชั่วโมงที่แล้ว',
//       icon: 'check'
//     },
//     {
//       id: 5,
//       type: 'info',
//       message: 'มีสินค้าใหม่ในหมวดหมู่ที่คุณสนใจ',
//       time: '2 ชั่วโมงที่แล้ว',
//       icon: 'info'
//     }
//   ]

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setNotificationOpen(false)
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/auth/logout', {
//         method: 'POST', // หรือ 'GET' ขึ้นอยู่กับ backend ของคุณ
//         credentials: 'include', // ส่ง cookies ไปกับ request
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         console.log('Logged out successfully');
//         // ลบ session หรือรีเฟรชหน้า
//         window.location.href = '/';
//       } else {
//         console.error('Failed to log out:', response.status);
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <div>
//       <nav className="bg-red-600 text-white py-3">
//         <div className="container mx-auto">
//           <div className='flex justify-between items-center'>
//             <div className="flex-1 flex justify-center items-center">
//               <div className="text-2xl font-semibold ms-3">
//                 Toy Auction
//               </div>
//               <input
//                 type="text"
//                 placeholder="ค้นหาสินค้า"
//                 className="w-1/3 p-2 rounded ms-3"
//               />
//             </div>
//             <ul className='flex items-center'>
//               <div className="flex items-center space-x-4">
//                 <div className="relative flex items-center" ref={dropdownRef}>
//                   <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none hover:text-gray-200">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                     </svg>
//                   </button>
//                   {/* <span className="text-base font-medium ml-2">Username</span> */}
//                   {dropdownOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                       <Link href="profile" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Profile</a>
//                       </Link>
//                       <Link href="/my-auctions" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">MyAuction</a>
//                       </Link>
//                       <Link href="/settings" legacyBehavior>
//                         <a className="block px-4 py-2 text-black hover:bg-gray-400 hover:text-white rounded-lg">Settings</a>
//                       </Link>
//                       <a onClick={handleLogout} className="block px-4 py-2 text-gray-800 hover:bg-red-600 hover:text-white rounded-lg cursor-pointer">
//                         Logout
//                       </a>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Create Auction Button */}
//                 <Link href="/create-auction" legacyBehavior>
//                   <a className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
//                     <FaPlus className="w-4 h-4" />
//                     <span className="font-medium">สร้างประมูล</span>
//                   </a>
//                 </Link>

//                 {/* Notification Bell */}
//                 <div className="relative flex items-center" ref={notificationRef}>
//                   <button 
//                     className="hover:text-gray-200"
//                     onClick={() => setNotificationOpen(!notificationOpen)}
//                   >
//                     <div className="relative">
//                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
//                       </svg>
//                       {/* Notification Badge */}
//                       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         3
//                       </span>
//                     </div>
//                   </button>

//                   {/* Notification Dropdown */}
//                   {notificationOpen && (
//                     <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
//                       <div className="p-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
//                       </div>
                      
//                       {/* Notification Items */}
//                       <div className="divide-y divide-gray-200">
//                         {notifications.slice(0, showAllNotifications ? notifications.length : 3).map(notification => (
//                           <div 
//                             key={notification.id} 
//                             className="p-4 hover:bg-gray-50 cursor-pointer"
//                             onClick={() => {
//                               // Check if notification is about winning an auction
//                               if (notification.type === 'success' && notification.message.includes('ชนะการประมูล')) {
//                                 // Redirect to payment page
//                                 window.location.href = '/payment';
//                               }
//                             }}
//                           >
//                             <div className="flex items-start">
//                               <div className="flex-shrink-0">
//                                 {notification.icon === 'clock' ? (
//                                   <FaClock className="h-6 w-6 text-purple-500" />
//                                 ) : notification.type === 'success' ? (
//                                   <FaCheckCircle className="h-6 w-6 text-green-500" />
//                                 ) : notification.type === 'warning' ? (
//                                   <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />
//                                 ) : notification.type === 'info' ? (
//                                   <FaInfo className="h-6 w-6 text-blue-500" />
//                                 ) : null}
//                               </div>
//                               <div className="ml-3">
//                                 <p className="text-sm text-gray-800">{notification.message}</p>
//                                 <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* View All Link */}
//                       <div className="p-4 text-center border-t border-gray-200">
//                         <button onClick={() => setShowAllNotifications(!showAllNotifications)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//                           {showAllNotifications ? 'แสดงน้อยลง' : 'ดูการแจ้งเตือนทั้งหมด'}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       <nav className='bg-red-600 text-white py-3'>
//         <div className='container mx-auto'>
//           <div className='flex justify-center items-center'>
//             <ul className='flex space-x-10'>
//               <li className='ms-3'><Link href="/homeuser">หน้าหลัก</Link></li>
//               <li className='ms-3'><Link href="/productuser">สินค้าประมูล</Link></li>
//               <li className='ms-3'><Link href="/about">เกี่ยวกับเรา</Link></li>
//               <li className='ms-3'><Link href="/contacts">ติดต่อเรา</Link></li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default NavUser;