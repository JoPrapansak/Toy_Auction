'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { data: session } = useSession()
  if (session) redirect("/")

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{9,10}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if(!name, !email, !password, !confirmpassword, !phone) return setError("กรุณากรอกข้อมูลให้ครบถ้วน")
    if (!name) return setError("กรุณากรอกชื่อ")
    if (!email || !email.includes("@")) return setError("กรุณากรอกอีเมล")
    if (password.length < 6) return setError("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร")
    if (password !== confirmpassword) return setError("รหัสผ่านไม่ตรงกัน")
    if (!validatePhone(phone)) return setError("เบอร์โทรไม่ถูกต้อง (ต้องเป็นตัวเลข 9-10 หลัก)")

    try {
      const res = await fetch("http://localhost:3111/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.message?.includes("exists")) {
          setError(data.message || "❌ อีเมลนี้มีผู้ใช้แล้ว กรุณาลองใหม่หรือเข้าสู่ระบบ")
        } else {
          setError(data.message || "เกิดข้อผิดพลาดขณะสมัครสมาชิก")
        }
        return
      }

      setShowSuccessModal(true)
    } catch (err) {
      console.error("Registration Error:", err)
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง")
    }
    setShowSuccessModal(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }

  return (
    <div>
      <Navbar />
      <main className="flex items-center justify-center py-16">
        <div className='w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md'>
          <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className='bg-red-500 text-white p-2 mb-4 rounded'>{error}</div>}

            <input onChange={(e) => setName(e.target.value)} className='w-full px-4 py-2 border rounded mb-3' type="text" placeholder='ชื่อผู้ใช้' />
            <input onChange={(e) => setEmail(e.target.value)} className='w-full px-4 py-2 border rounded mb-3' type="email" placeholder='อีเมล' />

            <div className='relative mb-3'>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                className='w-full px-4 py-2 border rounded' 
                type={showPassword ? "text" : "password"} 
                placeholder='รหัสผ่าน' 
              />
              <button 
                type="button" 
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="h-5 w-5"
                />
                {/* {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />} */}
              </button>
            </div>

            <div className='relative mb-3'>
              <input 
                onChange={(e) => setConfirmpassword(e.target.value)} 
                className='w-full px-4 py-2 border rounded' 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder='ยืนยันรหัสผ่าน' 
              />
              <button 
                type="button" 
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="h-5 w-5"
                />
                {/* {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />} */}
              </button>
            </div>

            <input
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // กรองเฉพาะตัวเลข
                if (value.length <= 10) setPhone(value)
              }}
              value={phone}
              className='w-full px-4 py-2 border rounded mb-3'
              type="tel"
              placeholder='เบอร์โทร (9-10 หลัก)'
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {/* 🔻 Gender */}
            {/* <div className="mb-3">
              <label className="block mb-1 text-sm text-gray-700">เพศ</label>
              <div className="flex gap-4">
                <label><input type="radio" name="gender" value="male" onChange={(e) => setGender(e.target.value)} /> ชาย</label>
                <label><input type="radio" name="gender" value="female" onChange={(e) => setGender(e.target.value)} /> หญิง</label>
                <label><input type="radio" name="gender" value="other" onChange={(e) => setGender(e.target.value)} /> อื่น ๆ</label>
              </div>
            </div> */}
            {/* <div className="mb-6">
              <label className="block mb-1 text-sm text-gray-700">วันเกิด</label>
              <input 
                onChange={(e) => setBirthday(e.target.value)} 
                className="w-full px-4 py-2 border rounded" 
                type="date" 
              />
            </div> */}

            <button
              type="submit"
              className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
            >
              สมัครสมาชิก
            </button>
          </form>
        </div>
      </main>

      {/* ✅ MODAL สำหรับสมัครเสร็จ */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-green-600 mb-4">🎉 สมัครสมาชิกสำเร็จ!</h3>
            <p className="text-gray-700 mb-4">กรุณายืนยันอีเมลของคุณผ่านลิงก์ที่ส่งไป</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisterPage

// 'use client'

// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'
// import { useSession } from 'next-auth/react'
// import { redirect } from 'next/navigation'
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

// function RegisterPage() {

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmpassword, setConfirmpassword] = useState('')
//   const [phone, setPhone] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [success, setSuccess] = useState('');

//   const { data: session } = useSession();
//   if (session) redirect("/");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); 
    
//     try {
//       if (!email || !email.includes("@")) {
//         setError("Invalid email format.");
//         return;
//       }
//       if (!name) {
//         setError("Name is required.");
//         return;
//       }
//       if (!password || password.length < 6) {
//         setError("Password must be at least 6 characters long.");
//         return;
//       }

//       const res = await fetch(
//         "http://localhost:3111/api/v1/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "BusinessId": "1234567890",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,  
//             confirmpassword,
//             phone,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "An error occurred during registration.");
//         if (data.message === "User already exists. Please login instead.") {
//           setError("อีเมลนี้มีผู้ใช้แล้ว กรุณาลองใหม่หรือเข้าสู่ระบบ.");
//         }
//         return;
//       }

//       setSuccess("สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลของคุณ.");
//       alert("สมัครสมาชิกเรียบร้อย กรุณายืนยันอีเมลของคุณ.");
//     } catch (err) {
//       console.error("Registration Error:", err);
//       setError("Unexpected error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div>
//       <Navbar/>
//       <main className="flex items-center justify-center py-16">
//         <div className='w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md'>
//           <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
//           <form onSubmit={handleSubmit}>

//             {error && (
//               <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className='bg-green-500 text-white p-2 my-2 rounded-md'>
//                 {success}
//               </div>
//             )}

//             <input onChange={(e)  => setName(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="text" placeholder='Name' />
//             <input onChange={(e)  => setEmail(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="email" placeholder='Email' />
            
//             <div className='relative mb-4'>
//               <input 
//                 onChange={(e)  => setPassword(e.target.value)} 
//                 className='w-full px-4 py-2 border rounded-md' 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder='Password' 
//               />
//               <button 
//                 type="button" 
//                 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? 
//                   <EyeSlashIcon className="h-5 w-5" /> : 
//                   <EyeIcon className="h-5 w-5" />
//                 }
//               </button>
//             </div>

//             <div className='relative mb-4'>
//               <input 
//                 onChange={(e)  => setConfirmpassword(e.target.value)} 
//                 className='w-full px-4 py-2 border rounded-md' 
//                 type={showConfirmPassword ? "text" : "password"} 
//                 placeholder='Confirmpassword' 
//               />
//               <button 
//                 type="button" 
//                 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? 
//                   <EyeSlashIcon className="h-5 w-5" /> : 
//                   <EyeIcon className="h-5 w-5" />
//                 }
//               </button>
//             </div>

//             <input onChange={(e)  => setPhone(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-6' type="tel" placeholder='Tel.' maxLength="10" />
//             <button
//                 type="submit"
//                 className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
//               >
//                 สมัครสมาชิก
//               </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default RegisterPage

// 'use client'

// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'
// import { useSession } from 'next-auth/react'
// import { redirect } from 'next/navigation'
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

// function RegisterPage() {

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmpassword, setConfirmpassword] = useState('')
//   const [phone, setPhone] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [success, setSuccess] = useState('');

//   const { data: session } = useSession();
//   if (session) redirect("/");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); 
    
//     try {
//       if (!email || !email.includes("@")) {
//         setError("Invalid email format.");
//         return;
//       }
//       if (!name) {
//         setError("Name is required.");
//         return;
//       }
//       if (!password || password.length < 6) {
//         setError("Password must be at least 6 characters long.");
//         return;
//       }

//       const res = await fetch(
//         "http://localhost:3111/api/v1/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "BusinessId": "1234567890",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,  
//             confirmpassword,
//             phone,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "An error occurred during registration.");
//         setSuccess('registration successfully ');
//         return;
//       }

//       alert("สมัครสมาชิกเรียบร้อย กรุณายืนยันอีเมลของคุณ.");
//     } catch (err) {
//       console.error("Registration Error:", err);
//       setError("Unexpected error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div>
//       <Navbar/>
//       <main className="flex items-center justify-center py-16">
//         <div className='w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md'>
//           <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
//           <form onSubmit={handleSubmit}>

//             {error && (
//               <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className='bg-green-500 text-white p-2 my-2 rounded-md'>
//                 {success}
//               </div>
//             )}

//             <input onChange={(e)  => setName(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="text" placeholder='Name' />
//             <input onChange={(e)  => setEmail(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="email" placeholder='Email' />
            
//             <div className='relative mb-4'>
//               <input 
//                 onChange={(e)  => setPassword(e.target.value)} 
//                 className='w-full px-4 py-2 border rounded-md' 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder='Password' 
//               />
//               <button 
//                 type="button" 
//                 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? 
//                   <EyeSlashIcon className="h-5 w-5" /> : 
//                   <EyeIcon className="h-5 w-5" />
//                 }
//               </button>
//             </div>

//             <div className='relative mb-4'>
//               <input 
//                 onChange={(e)  => setConfirmpassword(e.target.value)} 
//                 className='w-full px-4 py-2 border rounded-md' 
//                 type={showConfirmPassword ? "text" : "password"} 
//                 placeholder='Confirmpassword' 
//               />
//               <button 
//                 type="button" 
//                 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? 
//                   <EyeSlashIcon className="h-5 w-5" /> : 
//                   <EyeIcon className="h-5 w-5" />
//                 }
//               </button>
//             </div>

//             <input onChange={(e)  => setPhone(e.target.value)} 
//             className='w-full px-4 py-2 border rounded-md mb-6' type="tel" placeholder='Tel.' maxLength="10"/>
//             <button
//                 type="submit"
//                 className="w-full bg-[#FFA6D4] text-white py-2 rounded-md hover:bg-pink-400"
//               >
//                 สมัครสมาชิก
//               </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default RegisterPage
