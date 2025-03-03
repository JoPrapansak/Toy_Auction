'use client'

import React, { useState, useEffect } from 'react'
import NavUser from '../components/NavUser'

function SettingPage() {
  const [activeTab, setActiveTab] = useState('password')
  const [loginHistory, setLoginHistory] = useState([])
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'loginHistory') {
      fetchLoginHistory()
    }
  }, [activeTab])

  const fetchLoginHistory = async () => {
    try {
      const response = await fetch('http://localhost:3111/api/v1/profile', { credentials: 'include' })
      if (!response.ok) throw new Error('โหลดข้อมูลล้มเหลว')

      const data = await response.json()
      setLoginHistory(data.data.profile.loginHistory || [])
    } catch (err) {
      console.error("โหลดประวัติการเข้าสู่ระบบล้มเหลว", err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('http://localhost:3111/api/v1/accounts/password/change', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

      setMessage({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ!' })
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300">
        {message && (
          <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'password' && (
          <>
            <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
            <div className="space-y-4">
              <Input label="รหัสผ่านปัจจุบัน" type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
              <Input label="รหัสผ่านใหม่" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
              <Input label="ยืนยันรหัสผ่านใหม่" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                onClick={handlePasswordChange}
                disabled={loading}
              >
                {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'เปลี่ยนรหัสผ่าน'}
              </button>
            </div>
          </>
        )}

        {/* {activeTab === 'location' && (
          <>
            <h2 className="text-xl font-semibold mb-4">ตำแหน่งที่คุณเข้าระบบ</h2>
            <p className="text-gray-600 text-sm">ตำแหน่งของคุณถูกบันทึกเพื่อความปลอดภัย</p>
            <Input label="ตำแหน่งปัจจุบัน" type="text" value="กรุงเทพมหานคร, ประเทศไทย" disabled />
          </>
        )} */}

        {activeTab === 'loginHistory' && (
          <>
            <h2 className="text-xl font-semibold mb-4">ประวัติการเข้าสู่ระบบ</h2>
            <div className="space-y-4">
              {loginHistory.length > 0 ? (
                // เรียงลำดับจากใหม่ไปเก่า
                [...loginHistory]
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((entry, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p><strong>IP:</strong> {entry.ipAddress}</p>
                          <p><strong>อุปกรณ์:</strong> {entry.userAgent}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString('th-TH', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูลการเข้าสู่ระบบ</p>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ตั้งค่า</h1>

        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar Menu */}
          <div className="md:w-1/4">
            <div className="bg-white p-4 rounded-xl shadow-md"> 
              <div className="space-y-1"> {/* เพิ่ม div ครอบปุ่มและใส่ class space-y-2 */}
                {['password', 'loginHistory'].map((tab) => ( //, 'location'
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {tab === 'password' && 'เปลี่ยนรหัสผ่าน'}
                    {/* {tab === 'location' && 'ตำแหน่งที่คุณเข้าระบบ'} */}
                    {tab === 'loginHistory' && 'ประวัติการเข้าสู่ระบบ'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-2/4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ✅ Component Input ใช้ร่วมกันเพื่อให้ UI สม่ำเสมอ */
const Input = ({ label, type, name, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2 border rounded-lg ${disabled ? 'bg-gray-100' : 'focus:outline-none focus:ring focus:ring-blue-200'}`} 
    />
  </div>
)

export default SettingPage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import NavUser from '../components/NavUser'

// function SettingPage() {
//   const [activeTab, setActiveTab] = useState('password')
//   const [loginHistory, setLoginHistory] = useState([])
//   const [formData, setFormData] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   })
//   const [message, setMessage] = useState(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (activeTab === 'loginHistory') {
//       fetchLoginHistory()
//     }
//   }, [activeTab])

//   const fetchLoginHistory = async () => {
//     try {
//       const response = await fetch('http://localhost:3111/api/v1/profile', { credentials: 'include' })
//       if (!response.ok) throw new Error('โหลดข้อมูลล้มเหลว')

//       const data = await response.json()
//       setLoginHistory(data.data.profile.loginHistory || [])
//     } catch (err) {
//       console.error("โหลดประวัติการเข้าสู่ระบบล้มเหลว", err)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handlePasswordChange = async () => {
//     if (formData.newPassword !== formData.confirmPassword) {
//       setMessage({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' })
//       return
//     }

//     setLoading(true)
//     setMessage(null)

//     try {
//       const response = await fetch('http://localhost:3111/api/v1/accounts/password/change', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           oldPassword: formData.oldPassword,
//           newPassword: formData.newPassword
//         })
//       })

//       const result = await response.json()

//       if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

//       setMessage({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ!' })
//       setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
//     } catch (err) {
//       setMessage({ type: 'error', text: err.message })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const renderContent = () => {
//     return (
//       <div className="bg-white rounded-xl p-6 shadow-md transition-all duration-300">
//         {message && (
//           <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//             {message.text}
//           </div>
//         )}

//         {activeTab === 'password' && (
//           <>
//             <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
//             <div className="space-y-4">
//               <Input label="รหัสผ่านปัจจุบัน" type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
//               <Input label="รหัสผ่านใหม่" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
//               <Input label="ยืนยันรหัสผ่านใหม่" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
//               <button
//                 className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
//                 onClick={handlePasswordChange}
//                 disabled={loading}
//               >
//                 {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'เปลี่ยนรหัสผ่าน'}
//               </button>
//             </div>
//           </>
//         )}

//         {activeTab === 'location' && (
//           <>
//             <h2 className="text-xl font-semibold mb-4">ตำแหน่งที่คุณเข้าระบบ</h2>
//             <p className="text-gray-600 text-sm">ตำแหน่งของคุณถูกบันทึกเพื่อความปลอดภัย</p>
//             <Input label="ตำแหน่งปัจจุบัน" type="text" value="กรุงเทพมหานคร, ประเทศไทย" disabled />
//           </>
//         )}

//         {activeTab === 'loginHistory' && (
//           <>
//             <h2 className="text-xl font-semibold mb-4">ประวัติการเข้าสู่ระบบ</h2>
//             <div className="space-y-4">
//               {loginHistory.length > 0 ? (
//                 loginHistory.map((entry, index) => (
//                   <div key={index} className="p-4 border rounded-lg bg-gray-50">
//                     <p><strong>IP:</strong> {entry.ipAddress}</p>
//                     <p><strong>อุปกรณ์:</strong> {entry.userAgent}</p>
//                     <p><strong>เวลา:</strong> {new Date(entry.timestamp).toLocaleString('th-TH')}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">ไม่มีข้อมูลการเข้าสู่ระบบ</p>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">ตั้งค่า</h1>

//         <div className="flex flex-col md:flex-row md:space-x-8">
//           {/* Sidebar Menu */}
//           <div className="md:w-1/4">
//             <div className="bg-white p-4 rounded-xl shadow-md">
//               {['password', 'location', 'loginHistory'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
//                     activeTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
//                   }`}
//                 >
//                   {tab === 'password' && 'เปลี่ยนรหัสผ่าน'}
//                   {/* {tab === 'location' && 'ตำแหน่งที่คุณเข้าระบบ'} */}
//                   {tab === 'loginHistory' && 'ประวัติการเข้าสู่ระบบ'}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="md:w-3/4">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ✅ Component Input ใช้ร่วมกันเพื่อให้ UI สม่ำเสมอ */
// const Input = ({ label, type, name, value, onChange, disabled }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//     <input 
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className={`w-full p-2 border rounded-lg ${disabled ? 'bg-gray-100' : 'focus:outline-none focus:ring focus:ring-blue-200'}`} 
//     />
//   </div>
// )

// export default SettingPage

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'

// function Settingpage() {
//   const [activeTab, setActiveTab] = useState('password')

//   const renderContent = () => {
//     switch(activeTab) {
//       case 'password':
//         return (
//           <div className="bg-white rounded-lg p-6 shadow">
//             <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">รหัสผ่านปัจจุบัน</label>
//                 <input type="password" className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">รหัสผ่านใหม่</label>
//                 <input type="password" className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">ยืนยันรหัสผ่านใหม่</label>
//                 <input type="password" className="w-full p-2 border rounded" />
//               </div>
//               <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                 เปลี่ยนรหัสผ่าน
//               </button>
//             </div>
//           </div>
//         )
//       case 'location':
//         return (
//           <div className="bg-white rounded-lg p-6 shadow">
//             <h2 className="text-xl font-semibold mb-4">ตำแหน่งที่คุณเข้าระบบ</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">ตำแหน่งปัจจุบัน</label>
//                 <input type="text" className="w-full p-2 border rounded" placeholder="กรุงเทพมหานคร, ประเทศไทย" disabled />
//               </div>
//               {/* <p className="text-sm text-gray-600">
//                 ตำแหน่งนี้จะถูกใช้เพื่อความปลอดภัยในการเข้าสู่ระบบของคุณ
//               </p> */}
//             </div>
//           </div>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">ตั้งค่า</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           {/* Left Sidebar */}
//           <div className="md:col-span-1">
//             <div className="space-y-2">
//               <button
//                 onClick={() => setActiveTab('password')}
//                 className={`w-full text-left px-4 py-2 rounded-lg ${
//                   activeTab === 'password' 
//                     ? 'bg-blue-500 text-white' 
//                     : 'hover:bg-gray-100'
//                 }`}
//               >
//                 เปลี่ยนรหัสผ่าน
//               </button>
//               <button
//                 onClick={() => setActiveTab('location')}
//                 className={`w-full text-left px-4 py-2 rounded-lg ${
//                   activeTab === 'location' 
//                     ? 'bg-blue-500 text-white' 
//                     : 'hover:bg-gray-100'
//                 }`}
//               >
//                 ตำแหน่งที่คุณเข้าระบบ
//               </button>
//             </div>
//           </div>

//           {/* Right Content Area */}
//           <div className="md:col-span-1 max-w-xl">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Settingpage

