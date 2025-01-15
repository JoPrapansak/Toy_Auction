'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'

function RegisterPage() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    
    try {
      if (!email || !email.includes("@")) {
        setError("Invalid email format.");
        return;
      }
      if (!name) {
        setError("Name is required.");
        return;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      const res = await fetch(
        "https://nodejs-for-test-vua7.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "BusinessId": "1234567890",
          },
          body: JSON.stringify({
            name,
            email,
            password,  
            confirmpassword,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An error occurred during registration.");
        return;
      }

      alert("สมัครสมาชิกเรียบร้อย กรุณายืนยันอีเมลของคุณ.");
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar/>
      <div className='container mx-auto py-5 items-center justify-center'>
        <h3>สมัครสมาชิก</h3>
        <form onSubmit={handleSubmit}>

          {error && (
            <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
              {error}
            </div>
          )}

          <input onChange={(e)  => setName(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="text" placeholder='ชื่อName' />
          <input onChange={(e)  => setEmail(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="email" placeholder='อีเมลEmail' />
          
          <div className='relative'>
            <input 
              onChange={(e)  => setPassword(e.target.value)} 
              className='block bg-gray--300 p-2 my-2 rounded-md w-full' 
              type={showPassword ? "text" : "password"} 
              placeholder='รหัสผ่านPassword' 
            />
            <button 
              type="button" 
              className='absolute right-2 top-3 text-sm text-gray-600'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "ซ่อน" : "ดู"}
            </button>
          </div>

          <div className='relative'>
            <input 
              onChange={(e)  => setConfirmpassword(e.target.value)} 
              className='block bg-gray--300 p-2 my-2 rounded-md w-full' 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder='ยืนยันรหัสผ่านConfirmpassword' 
            />
            <button 
              type="button" 
              className='absolute right-2 top-3 text-sm text-gray-600'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "ซ่อน" : "ดู"}
            </button>
          </div>

          <input onChange={(e)  => setPhone(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="tel" placeholder='เบอร์โทรTel.' />
          <button
              type="submit"
              className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              สมัครสมาชิก
            </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage


// 'use client'

// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'

// function RegisterPage() {

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmpassword, setConfirmpassword] = useState('')
//   const [phone, setPhone] = useState('')
//   const [error, setError] = useState('')

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // เคลียร์ข้อผิดพลาดก่อนเริ่มต้น
//     try {
//       // ตรวจสอบ Validation เบื้องต้น
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
  
//       // ส่งคำขอไปยัง API
//       const res = await fetch(
//         "http://localhost:3111/api/v1/auth/register",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
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
  
//       // ตรวจสอบสถานะผลลัพธ์
//       if (!res.ok) {
//         setError(data.message || "An error occurred during registration.");
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
//       <div className='container mx-auto py-5 items-center justify-center'>
//         <h3>สมัครสมาชิก</h3>
//         <form onSubmit={handleSubmit}>

//           {error && (
//             <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
//               {error}
//             </div>
//           )}

//           <input onChange={(e)  => setName(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="text" placeholder='ชื่อName' />
//           <input onChange={(e)  => setEmail(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="email" placeholder='อีเมลEmail' />
//           <input onChange={(e)  => setPassword(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="password" placeholder='รหัสผ่านPassword' />
//           <input onChange={(e)  => setConfirmpassword(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="password" placeholder='ยืนยันรหัสผ่านConfirmpassword' />
//           <input onChange={(e)  => setPhone(e.target.value)} className='block bg-gray--300 p-2 my-2 rounded-md' type="tel" placeholder='เบอร์โทรTel.' />
//           <button
//               type="submit"
//               className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
//             >
//               สมัครสมาชิก
//             </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default RegisterPage


// import React from 'react'

// import Nav from '../components/Nav'

// function RegisterPage() {
//   return (
//     <div>
//       <Nav/>
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
//           <form>
//           <div className="mb-4">
//             <div className="flex items-center">
//               <label htmlFor="email" className="text-gray-700 mr-4">
//               <span className="text-red-500">*</span>ชื่อ:
//               </label>
//               <input
//                 type="name"
//                 id="name"
//                 className="flex-1 px-4 py-2 border rounded-md"
//                 placeholder="Name"
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <div className="flex items-center">
//               <label htmlFor="email" className="text-gray-700 mr-4">
//               <span className="text-red-500">*</span>อีเมล:
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="flex-1 px-4 py-2 border rounded-md"
//                 placeholder="Email"
//               />
//             </div>
//           </div>
//             <div className="mb-4">
//               <div className="flex items-center">
//                 <label htmlFor="password" className="text-gray-700 mr-4">
//                 <span className="text-red-500">*</span>รหัสผ่าน:
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   className="flex-1 px-4 py-2 border rounded-md"
//                   placeholder="Password"
//                 />
//               </div>
//             </div>
//             <div className="mb-6">
//               <div className="flex items-center">
//                 <label htmlFor="password" className="text-gray-700 mr-4">
//                 <span className="text-red-500">*</span>ยืนยันรหัสผ่าน:
//                 </label>
//                 <input
//                   type="confirmpassword"
//                   id="confirmpassword"
//                   className="flex-1 px-4 py-2 border rounded-md"
//                   placeholder="Confirm Password"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
//             >
//               สมัครสมาชิก
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default RegisterPage

// // import React from 'react'

// // import Nav from '../components/Nav'

// // function RegisterPage() {
// //   return (
// //     <div>
// //       <Nav/>
// //       <main className="flex items-center justify-center py-16">
// //         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
// //           <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
// //           <form>
// //             <div className="mb-4">
// //               <input
// //                 type="email"
// //                 id="email"
// //                 className="w-full px-4 py-2 border rounded-md"
// //                 placeholder="Email"
// //               />
// //             </div>
// //             <div className="mb-6">
// //               <input
// //                 type="password"
// //                 id="password"
// //                 className="w-full px-4 py-2 border rounded-md"
// //                 placeholder="Password"
// //               />
// //             </div>
// //             <button
// //               type="submit"
// //               className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
// //             >
// //               เข้าสู่ระบบ
// //             </button>
// //           </form>
// //           <div className="text-center mt-4 space-x-4">
// //             <a href="/register" className="text-blue-500 hover:underline">
// //               สมัครสมาชิก
// //             </a>
// //             <a href="#" className="text-blue-500 hover:underline">
// //               ลืมรหัสผ่าน
// //             </a>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }

// // export default RegisterPage
