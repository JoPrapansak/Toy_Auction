import React from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import NavUser from '../components/์NavUser'

function ProfilePage() {
  return (
    <div>
      <NavUser/>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src="/image/profile1.jpg" 
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-200"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">ชื่อผู้ใช้</h1>
              <p className="text-gray-600">example@email.com</p>
              <p className="text-sm text-gray-500 mt-2">สมาชิกตั้งแต่: January 2024</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">การประมูลที่ชนะ</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">การประมูลที่เข้าร่วม</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold">สินค้าที่ลงขาย</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div> */}
          </div>

          {/* Personal Information */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* <p className="text-gray-600">ชื่อ-นามสกุล: John Doe</p> */}
                <p className="text-gray-600">เบอร์โทร: xxx-xxx-xxxx</p>
                <p className="text-gray-600">ที่อยู่: xxxxxxxxx</p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-8">
            <Link href="/editprofile">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                แก้ไขข้อมูลส่วนตัว
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
