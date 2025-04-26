'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { data: session } = useSession()
  if (session) {
    router.replace('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // ล้างข้อความแจ้งเตือนก่อนหน้า

    if (!email || !password) {
      return setError('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    try {
      const res = await fetch('http://localhost:3111/api/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ ถ้าเป็น admin → ไป /admin
        if ((email === 'admin' || email === 'admin@system.com') && password === 'admin1234') {
          router.push('/Admin/dashboard')
        } else{
          router.push('/homeuser')
        }
      } else if (res.status === 401) {
        // รหัสผ่านไม่ถูกต้อง
        setError('รหัสผ่านไม่ถูกต้อง');
      } else {
        // ข้อผิดพลาดอื่นๆ
        setError(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    }
  }

  return (
    <div>
      <Navbar />
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="อีเมล"
              />
            </div>

            <div className="mb-6 relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="รหัสผ่าน"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="h-5 w-5"
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="text-center mt-4 space-x-4">
            <Link href="/register" className="text-blue-500 hover:underline">
              สมัครสมาชิก
            </Link>
            <Link href="/forgot" className="text-blue-500 hover:underline">
              ลืมรหัสผ่าน
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage


// 'use client'

// import React, { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
// import Link from 'next/link'
// import Navbar from '../components/Navbar'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)

//   const router = useRouter()
//   const { data: session } = useSession()
//   if (session) {
//     router.replace('/')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     if(!email, !password) {return setError('กรุณากรอกข้อมูลให้ครบถ้วน')}
//     // ✅ อนุญาต "admin" ไม่ต้องมี @
//     if (!email || (!email.includes('@') && email !== 'admin' && email !== 'admin@system.com')) {
//       return setError('กรุณากรอกอีเมลให้ถูกต้อง')
//     }

//     if (!password || password.length < 6) {
//       return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
//     }

//     try {
//       const res = await fetch('http://localhost:3111/api/v1/auth/login', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password })
//       })

//       const data = await res.json()

//       if (res.ok) {
//         // ✅ ถ้าเป็น admin → ไป /admin
//         if ((email === 'admin' || email === 'admin@system.com') && password === 'admin1234') {
//           router.push('/Admin/dashboard')
//         } else {
//           router.push('/homeuser')
//         }
//       } else {
//         setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
//       }
//     } catch (err) {
//       console.error('Login Error:', err)
//       setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
//           <form onSubmit={handleSubmit}>
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="mb-4">
//               <input
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="text"
//                 id="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="อีเมล"
//               />
//             </div>

//             <div className="mb-6 relative">
//               <input
//                 onChange={(e) => setPassword(e.target.value)}
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="รหัสผ่าน"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 <FontAwesomeIcon
//                   icon={showPassword ? faEyeSlash : faEye}
//                   className="h-5 w-5"
//                 />
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
//             >
//               เข้าสู่ระบบ
//             </button>
//           </form>

//           <div className="text-center mt-4 space-x-4">
//             <Link href="/register" className="text-blue-500 hover:underline">
//               สมัครสมาชิก
//             </Link>
//             <Link href="/forgot" className="text-blue-500 hover:underline">
//               ลืมรหัสผ่าน
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default LoginPage


// 'use client'

// import React, { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
// import Link from 'next/link'
// import Navbar from '../components/Navbar'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)

//   const router = useRouter()
//   const { data: session } = useSession()
//   if (session) {
//     router.replace('/')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     if (!email || !email.includes("@")) {
//       return setError('กรุณากรอกอีเมลให้ถูกต้อง')
//     }

//     if (!password || password.length < 6) {
//       return setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
//     }

//     try {
//       const res = await fetch('http://localhost:3111/api/v1/auth/login', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password })
//       })

//       const data = await res.json()
//       if (res.ok) {
//         router.push('/homeuser') // ✅ เปลี่ยนเส้นทางเมื่อ login สำเร็จ
//       } else {
//         setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
//       }
//     } catch (err) {
//       console.error('Login Error:', err)
//       setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
//     }
//   }

//   return (
//     <div>
//       <Navbar />
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
//           <form onSubmit={handleSubmit}>
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="mb-4">
//               {/* <label htmlFor="email" className="block text-sm text-gray-700 mb-1">อีเมล</label> */}
//               <input
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 id="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="อีเมล"
//               />
//             </div>

//             <div className="mb-6 relative">
//               {/* <label htmlFor="password" className="block text-sm text-gray-700 mb-1">รหัสผ่าน</label> */}
//               <input
//                 onChange={(e) => setPassword(e.target.value)}
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="รหัสผ่าน"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 <FontAwesomeIcon
//                   icon={showPassword ? faEyeSlash : faEye}
//                   className="h-5 w-5"
//                 />
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
//             >
//               เข้าสู่ระบบ
//             </button>
//           </form>

//           <div className="text-center mt-4 space-x-4">
//             <Link href="/register" className="text-blue-500 hover:underline">
//               สมัครสมาชิก
//             </Link>
//             <Link href="/forgot" className="text-blue-500 hover:underline">
//               ลืมรหัสผ่าน
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default LoginPage

// 'use client'

// import React, { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

// import Link from 'next/link'
// import Navbar from '../components/Navbar'
// import { signIn } from 'next-auth/react'
// import  { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { redirect } from 'next/navigation'


// function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)

//   const router = useRouter()
  
//   const {data: session} = useSession()
//   if(session){
//     router.replace('/')
//   }
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(''); // Clear any existing errors
    
//     // Basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('กรุณากรอกอีเมลให้ถูกต้อง');
//       return;
//     }

//     // Password validation
//     if (!password || password.trim() === '') {
//       setError('กรุณากรอกรหัสผ่าน');
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:3111/api/v1/auth/login', {
//         method: 'POST',
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//           "BusinessId": "1234567890",
//           "device-fingerprint" : "unique-device-123456",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await res.json()

//       if (res.status === 200) {
//         window.location.href = '/homeuser'
//       } else if (res.status === 401) {
//         setError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
//       } else if (res.status === 404) {
//         setError('ไม่พบบัญชีผู้ใช้งานนี้ในระบบ')
//       } else {
//         setError(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
//       }
//     } catch (error) {
//       setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
//     }
//   }

//   return (
//     <div>
//       <Navbar/>
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
//           <form onSubmit={handleSubmit}>
            
//             {/* Show error message if exists */}
//             {error && (
//               <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="mb-4">
//               <input
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 id="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Email"
//                 />
//             </div>
//             <div className="mb-6 relative">
//               <input
//                 onChange={(e) => setPassword(e.target.value)}
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Password"
//                 />
//               <button 
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 <FontAwesomeIcon 
//                   icon={showPassword ? faEyeSlash : faEye} 
//                   className="h-5 w-5"
//                 />
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-[#FFA6D4]"
//               >
//               เข้าสู่ระบบ
//             </button>
//           </form>
//           <div className="text-center mt-4 space-x-4">
//             <Link href="/register" className="text-blue-500 hover:underline">
//               สมัครสมาชิก
//             </Link>
//             <Link href="/forgot" className="text-blue-500 hover:underline">
//               ลืมรหัสผ่าน
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default LoginPage
