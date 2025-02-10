"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // ✅ ใช้ next/navigation
import axios from "axios";
import zxcvbn from "zxcvbn"; // ✅ เพิ่ม import ที่หายไป

export default function ResetPassword() {
  const searchParams = useSearchParams(); // ✅ แก้ไข ไม่ใช้ destructuring
  const token = searchParams.get("token"); // ✅ ใช้ searchParams ตรงๆ
  const router = useRouter(); // ✅ ใช้ useRouter() แทน useNavigate()

  useEffect(() => {
    console.log("Token received:", token);

    if (!token || token === "undefined" || token === "null") {
      console.error("Invalid token detected. Redirecting...");
      router.push("/forgot-password"); // ✅ ใช้ router.push() แทน navigate()
    }
  }, [token, router]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(zxcvbn(value).score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token || token === "undefined" || token === "null") {
      setMessage("❌ ไม่พบ Token กรุณาลองใหม่");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3111/api/v1/accounts/reset-password", {
        token, // ✅ ส่ง Token ไปที่ API
        newPassword: password,
      });
  
      setMessage("✅ รหัสผ่านถูกเปลี่ยนแล้ว กรุณาเข้าสู่ระบบใหม่");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">🔒 ตั้งรหัสผ่านใหม่</h2>

        {message && <p className="text-center mb-4 text-red-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่านใหม่"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-sm">
            ความแข็งแรงของรหัสผ่าน: {["❌ อ่อน", "⚠️ พอใช้", "✅ แข็งแรง"][passwordStrength]}
          </p>

          {loading && <p className="text-center text-blue-500">⏳ กำลังเปลี่ยนรหัสผ่าน...</p>}

          <button
            type="submit"
            className={`w-full py-2 text-white font-semibold rounded-md transition ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "⏳ กำลังโหลด..." : "บันทึกรหัสผ่าน"}
          </button>
        </form>

        <button
          onClick={() => router.push("/login")} // ✅ ใช้ router.push() แทน navigate()
          className="w-full mt-4 py-2 text-blue-500 font-semibold hover:underline"
        >
          🔑 กลับไปหน้า Login
        </button>
      </div>
    </div>
  );
}

// 'use client'

// import React, { useState } from 'react'
// import Navbar from '../components/Navbar'
// import { useSearchParams, useRouter } from 'next/navigation'


// function Resetpasswordpage() {
  
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [message, setMessage] = useState('')
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const token = searchParams.get('token')
  
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if ( password !== confirmPassword) {
//       setMessage('Passwords do not match')
//       return;
//     }

//     try {
//       const res = await fetch('https://nodejs-for-test-vua7.onrender.com/api/v1/accounts/password/change/%7BEmail%7D', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token, newPassword: password }),
//       })
//       if (!res.ok) {
//         const errorData = await response.json();
//         setMessage(`Error: ${errorData.msg}`);
//         return;
//       } 
//       setMessage('Password reset successful.');
//       router.push('/login');

//     } catch (error) {
//       setMessage(`Error: ${error.message}`);
//     }
//   }
  
//   return (
//     <div>
//       <main className="flex items-center justify-center py-16">
//         <form onSubmit={handleSubmit}
//         className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md bg-opacity-70 backdrop-blur-lg">
//         <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Set New Password</h1>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               New Password
//             </label>
//             <input
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               id="password"
//               required
//               className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-xl hover:bg-red-700"
//           >
//             Set Password
//           </button>
//         </form>
//       </main>
//     </div>
//   )
// }

// export default Resetpasswordpage
