'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'

function Forgotpage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false) // ✅ เพิ่มสถานะโหลด

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3111/api/v1/accounts/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลของคุณแล้ว');
      } else {
        setMessage(`❌ ${data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'}`);
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">🔑 ลืมรหัสผ่าน</h2>
          <p className="text-gray-600 text-center mb-4">กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
          
          {message && <p className="text-center mb-4">{message}</p>} {/* ✅ แสดงข้อความแจ้งเตือน */}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="กรอกอีเมลของคุณ"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition duration-200"
              disabled={loading} // ✅ ปิดปุ่มเมื่อกำลังโหลด
            >
              {loading ? '⏳ กำลังส่ง...' : '📩 ส่งลิงก์รีเซ็ตรหัสผ่าน'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Forgotpage

// 'use client'

// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'
// // import { set } from 'mongoose'

// function Forgotpage() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('https://nodejs-for-test-vua7.onrender.com/api/v1/accounts/password/reset', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       })
//       if (res.ok) {
//         setMessage('Reset link has been sent to your email')
//       } else {
//         setMessage('Something went wrong')
//       }
//     } catch (error) {
//       setMessage('Error sending password reset link.');
//       console.error('Error:', error);
//     }
//   }

//   return (
//     <div>
//       <Navbar/>
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">Forget Password</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <input
//               onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 id="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Email"
//                 />
//             </div>
//             <button
//               type="submit"
//               className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-xl hover:bg-red-700"
//               >
//               Send Reset Link
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default Forgotpage
