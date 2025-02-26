'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavUser from '../components/NavUser'

function EditProfilePage() {
  const router = useRouter()
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

  // โหลดข้อมูลโปรไฟล์จากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile', {
          method: 'GET',
          credentials: 'include',
        })
        if (!response.ok) throw new Error('โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')
        const data = await response.json()
        setFormData({
          name: data.data.profile.name || 'New User',  // ✅ ป้องกัน name ว่าง,
          phone: data.data.profile.phone || '',
          address: data.data.profile.address || '',
        })
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    const fetchProfileImage = async () => {
      try {
        const response = await fetch('http://localhost:3111/api/v1/profile/image', {
          method: 'GET',
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setPreviewImage(data.image) // ใช้ Base64 image
        }
      } catch (error) {
        console.error('Error loading profile image:', error)
      }
    }

    fetchProfile()
    fetchProfileImage()
  }, [])

  const handleCancel = () => {
    router.push('/profile')
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file)) // แสดงตัวอย่างรูปที่เลือก
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📩 Sending Data:", formData); // ✅ Debug formData ก่อนส่ง
  
    try {
      // 🔹 อัปเดตข้อมูลโปรไฟล์
      const profileUpdateResponse = await fetch('http://localhost:3111/api/v1/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!profileUpdateResponse.ok) throw new Error('อัปเดตข้อมูลไม่สำเร็จ');
  
      // 🔹 อัปโหลดรูปโปรไฟล์ (ถ้ามีการเปลี่ยนรูป)
      if (profileImage) {
        const formDataToSend = new FormData();
        formDataToSend.append('image', profileImage);
  
        const uploadResponse = await fetch('http://localhost:3111/api/v1/profile/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend,
        });
  
        if (!uploadResponse.ok) throw new Error('อัปโหลดรูปภาพไม่สำเร็จ');
      }
  
      router.push('/profile'); // 🔄 กลับไปหน้าโปรไฟล์
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavUser />
      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">แก้ไขข้อมูลส่วนตัว</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-6 flex flex-col items-center">
              <img 
                src={previewImage || "/image/profile1.jpg"} 
                alt="Profile" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 mb-4"
              />
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
                อัพโหลดรูปภาพ
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">ชื่อผู้ใช้</label>
                <input 
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="ชื่อผู้ใช้"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                <input 
                  type="tel"
                  name="phone"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="เบอร์โทรศัพท์"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">ที่อยู่</label>
                <textarea 
                  name="address"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="ที่อยู่"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 mt-6">
              <button 
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                บันทึก
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage

// 'use client'

// import React from 'react'
// import Navbar from '../components/Navbar'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// function EditProfilePage() {
//   const router = useRouter()

//   const handleCancel = () => {
//     router.push('/profile')
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Add your form submission logic here
//     router.push('/profile')
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลส่วนตัว</h1>
          
//           <form onSubmit={handleSubmit}>
//             {/* Profile Image Section */}
//             <div className="mb-6">
//               <div className="flex flex-col items-center">
//                 <img 
//                   src="/image/profile1.jpg" 
//                   alt="Profile" 
//                   className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4"
//                 />
//                 <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//                   <span>อัพโหลดรูปภาพ</span>
//                   <input type="file" className="hidden" accept="image/*" />
//                 </label>
//               </div>
//             </div>

//             {/* Personal Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 mb-2">ชื่อผู้ใช้</label>
//                 <input 
//                   type="text"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อผู้ใช้"
//                 />
//               </div>
              
//               {/* <div>
//                 <label className="block text-gray-700 mb-2">อีเมล</label>
//                 <input 
//                   type="email"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="อีเมล"
//                 />
//               </div> */}

//               {/* <div>
//                 <label className="block text-gray-700 mb-2">ชื่อ-นามสกุล</label>
//                 <input 
//                   type="text"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อ-นามสกุล"
//                 />
//               </div> */}

//               <div>
//                 <label className="block text-gray-700 mb-2">เบอร์โทรศัพท์</label>
//                 <input 
//                   type="tel"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="เบอร์โทรศัพท์"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 mb-2">ที่อยู่</label>
//                 <textarea 
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   rows="3"
//                   placeholder="ที่อยู่"
//                 ></textarea>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-4 mt-6">
//               <button 
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//               >
//                 ยกเลิก
//               </button>
//               <button 
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 บันทึก
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditProfilePage
