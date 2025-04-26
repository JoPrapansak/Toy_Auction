'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBell, FaCheckCircle, FaClock, FaInfo } from 'react-icons/fa';

const API_URL = "http://localhost:3111/api/v1";

const categories = [
  { key: "designer_toys", name: "Designer Toys" },
  { key: "vinyl_figures", name: "Vinyl Figures" },
  { key: "resin_figures", name: "Resin Figures" },
  { key: "blind_box", name: "Blind Box Toys" },
  { key: "anime_figures", name: "Anime Figures" },
  { key: "movie_game_collectibles", name: "Movie & Game Collectibles" },
  { key: "robot_mecha", name: "Robot & Mecha Toys" },
  { key: "soft_vinyl", name: "Soft Vinyl (Sofubi)" },
  { key: "kaiju_monsters", name: "Kaiju & Monsters" },
  { key: "diy_custom", name: "DIY & Custom Toys" },
  { key: "retro_vintage", name: "Retro & Vintage Toys" },
  { key: "limited_edition", name: "Limited Edition & Exclusive" },
  { key: "gunpla_models", name: "Gunpla & Mecha Models" },
  { key: "plastic_models", name: "Plastic Model Kits" }
];


function Payment() {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isDropdownOpen, toggleDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        toggleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`${API_URL}/auction/search?name=${encodeURIComponent(searchText)}`);
      const data = await response.json();

      if (data.status === "success") {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการค้นหา:", error);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
        // if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลโปรไฟล์");
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setHasSearched(false);
      }
    };
    const fetchProfileImage = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/image`, { credentials: 'include' });
        // if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ");
        const data = await res.json();
        setProfileImage(data.image);
      } catch (err) {
        console.error("Error fetching profile image:", err);
      }
    };


    fetchProfile();
    fetchProfileImage();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/auction/notifications`, { credentials: 'include' });
        const data = await res.json();
        if (data.status === 'success') {
          setNotifications(data.data);
          setUnreadCount(data.data.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (notificationRef.current && !notificationRef.current.contains(event.target)) {
  //       setNotificationOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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
      <div className="container mx-auto">
        <div className='flex justify-between items-center'>

          <div className="flex-1 flex justify-start items-center">
            <div className="text-3xl font-cute font-semibold me-9" style={{ fontFamily: "'Mali',sans-serif"}}><Link href="/homeuser">Toy Auction </Link> </div>
            <div className="text-3xl font-cute font-semibold me-9" style={{ fontFamily: "'Mali',sans-serif"}}>| ทำการชำระเงิน</div>
            </div>

            {/* โปรไฟล์และการแจ้งเตือน */}
            <ul className='flex items-center'>
              <div className="flex items-center space-x-4">
                {/* โปรไฟล์ */}
                <div className="relative flex items-center" ref={dropdownRef}>
                  <button
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center focus:outline-none hover:opacity-80">
                    {profileImage ? (
                      <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <span className="text-base font-medium ml-2">{profile?.name || 'ไม่ระบุ'}</span>
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

                {/* การแจ้งเตือน */}
                <div className="relative flex items-center" ref={notificationRef}>
                  <button className="relative hover:text-gray-200" onClick={() => setNotificationOpen(!notificationOpen)}>
                    <FaBell className="w-8 h-8" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown แจ้งเตือน */}
                  {notificationOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">การแจ้งเตือน</h3>
                        <button onClick={markAllAsRead} className="text-blue-600 text-sm">อ่านทั้งหมด</button>
                      </div>
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
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </ul>
        </div>
        </div>
      </nav>
    </div>
    
  );
}

export default Payment;