'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import NavUser from '../components/NavUser'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

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

    fetchProfile()
  }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

  if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div>
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* ✅ แสดงรูปโปรไฟล์ */}
            <div className="relative">
              <img 
                src={profile?.profileImage || "/image/profile1.jpg"}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
              />
            </div>

            {/* ✅ แสดงชื่อและอีเมล */}
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {profile?.name || 'ไม่ระบุ'}
                </h1>
                <Link href="/editprofile">
                  <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
                    Edit profile
                  </button>
                </Link>
              </div>
              <p className="text-gray-500">📧 {profile?.email || 'ไม่ระบุอีเมล'}</p>
              <p className="text-gray-500">📞 {profile?.phone || 'ไม่ระบุเบอร์โทร'}</p>
              <p className="text-sm text-gray-400 mt-2">
                สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
              </p>

              {/* 🔥 Profile Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
                    <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
                    <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
                    <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Personal Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
                <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
              </div>
            </div>
          </div>

          {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดโปรไฟล์ใหม่
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
            >
              รีเฟรชโปรไฟล์
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* ✅ แสดงรูปโปรไฟล์ */}
//             <div className="relative">
//               <img 
//                 src={profile?.profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>

//             {/* ✅ แสดงชื่อและอีเมล */}
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                   {profile?.name || 'ไม่ระบุ'}
//                 </h1>
//                 <Link href="/editprofile">
//                   <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
//                     Edit profile
//                   </button>
//                 </Link>
//               </div>
//               <p className="text-gray-500">📧 {profile?.email || 'ไม่ระบุอีเมล'}</p>
//               <p className="text-gray-500">📞 {profile?.phone || 'ไม่ระบุเบอร์โทร'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>

//               {/* 🔥 Profile Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
//                     <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🔥 Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
//               </div>
//             </div>
//           </div>

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           {/* <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดโปรไฟล์ใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div> */}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchProfileImage = async () => {
//       try {
//         const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//           credentials: 'include'
//         })
        
//         if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")

//         const data = await res.json()
//         setProfileImage(data.image) // ใช้ Base64 Image
//       } catch (err) {
//         console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//       }
//     }

//     fetchProfile()
//     fetchProfileImage()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             <div className="relative">
//               <img 
//                 src={profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                   {profile?.profile?.name || 'ไม่ระบุ'}
//                 </h1>
//                 <Link href="/editprofile">
//                   <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
//                     Edit profile
//                   </button>
//                 </Link>
//               </div>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>

//               {/* Profile Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
//                     <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <div className="flex-1">
//               <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{profile?.profile?.name || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div> */}
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 {/* <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p> */}
//               </div>
//             </div>
//           </div>

//           {/* <div className="mt-6">
//             <Link href="/editprofile">
//               <button 
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
//               >
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div> */}

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           {/* <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดรูปใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div> */}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchProfileImage = async () => {
//       try {
//         const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//           credentials: 'include'
//         })
        
//         if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")

//         const data = await res.json()
//         setProfileImage(data.image) // ใช้ Base64 Image
//       } catch (err) {
//         console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//       }
//     }

//     fetchProfile()
//     fetchProfileImage()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <NavUser />
//       <div className="container mx-auto px-4 py-10 flex flex-col items-center">
//         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="relative">
//               <img 
//                 src={profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>
//             <div className="text-center">
//               <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{profile?.profile?.name || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <Link href="/editprofile">
//               <button 
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
//               >
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div>

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดรูปใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage


// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })
        
//         if (!response.ok) {
//           throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')
//         }

//         const data = await response.json()
//         setProfile(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [])

//   if (loading) return <div className="text-center py-8">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* Profile Header */}
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* Profile Image */}
//             <div className="relative">
//               <img 
//                 src={profile?.image || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-gray-200"
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">{profile?.username || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-600">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div>
//           </div>

//           {/* Profile Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่ชนะ</h3>
//               <p className="text-2xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่เข้าร่วม</h3>
//               <p className="text-2xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//             </div>
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Edit Profile Button */}
//           <div className="mt-8">
//             <Link href="/editprofile">
//               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'
// import React from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* Profile Header */}
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* Profile Image */}
//             <div className="relative">
//               <img 
//                 src="/image/profile1.jpg" 
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-gray-200"
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">ชื่อผู้ใช้</h1>
//               <p className="text-gray-600">example@email.com</p>
//               <p className="text-sm text-gray-500 mt-2">สมาชิกตั้งแต่: January 2024</p>
//             </div>
//           </div>

//           {/* Profile Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่ชนะ</h3>
//               <p className="text-2xl font-bold text-blue-600">0</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่เข้าร่วม</h3>
//               <p className="text-2xl font-bold text-green-600">0</p>
//             </div>
//             {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">สินค้าที่ลงขาย</h3>
//               <p className="text-2xl font-bold text-purple-600">0</p>
//             </div> */}
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 {/* <p className="text-gray-600">ชื่อ-นามสกุล: John Doe</p> */}
//                 <p className="text-gray-600">เบอร์โทร: xxx-xxx-xxxx</p>
//                 <p className="text-gray-600">ที่อยู่: xxxxxxxxx</p>
//               </div>
//             </div>
//           </div>

//           {/* Edit Profile Button */}
//           <div className="mt-8">
//             <Link href="/editprofile">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//                 แก้ไขข้อมูลส่วนตัว
//             </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage
