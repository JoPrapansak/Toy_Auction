'use client'

import React, { useState } from 'react'
import NavUser from '../components/NavUser'

function Settingpage() {
  const [activeTab, setActiveTab] = useState('password')

  const renderContent = () => {
    switch(activeTab) {
      case 'password':
        return (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">รหัสผ่านปัจจุบัน</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">รหัสผ่านใหม่</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ยืนยันรหัสผ่านใหม่</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        )
      case 'location':
        return (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">ตำแหน่งที่คุณเข้าระบบ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">ตำแหน่งปัจจุบัน</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="กรุงเทพมหานคร, ประเทศไทย" disabled />
              </div>
              {/* <p className="text-sm text-gray-600">
                ตำแหน่งนี้จะถูกใช้เพื่อความปลอดภัยในการเข้าสู่ระบบของคุณ
              </p> */}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <NavUser/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">ตั้งค่า</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'password' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                เปลี่ยนรหัสผ่าน
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeTab === 'location' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                ตำแหน่งที่คุณเข้าระบบ
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-1 max-w-xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settingpage
