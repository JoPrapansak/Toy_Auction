'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import NavUser from '../components/NavUser'

function EditProfilePage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push('/profile')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your form submission logic here
    router.push('/profile')
  }

  return (
    <div>
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลส่วนตัว</h1>
          
          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="mb-6">
              <div className="flex flex-col items-center">
                <img 
                  src="/image/profile1.jpg" 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4"
                />
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  <span>อัพโหลดรูปภาพ</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">ชื่อผู้ใช้</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="ชื่อผู้ใช้"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">อีเมล</label>
                <input 
                  type="email"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="อีเมล"
                />
              </div>

              {/* <div>
                <label className="block text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div> */}

              <div>
                <label className="block text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                <input 
                  type="tel"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="เบอร์โทรศัพท์"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">ที่อยู่</label>
                <textarea 
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="ที่อยู่"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
