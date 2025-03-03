'use client'

import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import { signIn } from 'next-auth/react'
import  { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'



function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  
  const {data: session} = useSession()
  if(session){
    router.replace('/')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      const res = await fetch('http://localhost:3111/api/v1/auth/login', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "BusinessId": "1234567890",
          "device-fingerprint" : "unique-device-123456",
        },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 200) {
        window.location.href = '/homeuser'
      } else {
        const errorData = await res.json()
        setError(errorData.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
    }
  }

  return (
    <div>
      <Navbar/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit}>
            
            {/* Show error message if exists */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Email"
                />
            </div>
            <div className="mb-6 relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Password"
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
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
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
