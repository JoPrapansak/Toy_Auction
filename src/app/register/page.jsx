'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function RegisterPage() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const { data: session } = useSession();
  if (session) redirect("/");

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
        "http://localhost:3111/api/v1/auth/register",
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
        setSuccess('registration successfully ');
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
      <main className="flex items-center justify-center py-16">
        <div className='w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md'>
          <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit}>

            {error && (
              <div className='bg-red-500 text-white p-2 my-2 rounded-md'>
                {error}
              </div>
            )}

            {success && (
              <div className='bg-green-500 text-white p-2 my-2 rounded-md'>
                {success}
              </div>
            )}

            <input onChange={(e)  => setName(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="text" placeholder='Name' />
            <input onChange={(e)  => setEmail(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-4' type="email" placeholder='Email' />
            
            <div className='relative mb-4'>
              <input 
                onChange={(e)  => setPassword(e.target.value)} 
                className='w-full px-4 py-2 border rounded-md' 
                type={showPassword ? "text" : "password"} 
                placeholder='Password' 
              />
              <button 
                type="button" 
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeSlashIcon className="h-5 w-5" /> : 
                  <EyeIcon className="h-5 w-5" />
                }
              </button>
            </div>

            <div className='relative mb-4'>
              <input 
                onChange={(e)  => setConfirmpassword(e.target.value)} 
                className='w-full px-4 py-2 border rounded-md' 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder='Confirmpassword' 
              />
              <button 
                type="button" 
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 
                  <EyeSlashIcon className="h-5 w-5" /> : 
                  <EyeIcon className="h-5 w-5" />
                }
              </button>
            </div>

            <input onChange={(e)  => setPhone(e.target.value)} className='w-full px-4 py-2 border rounded-md mb-6' type="tel" placeholder='Tel.' />
            <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
              >
                สมัครสมาชิก
              </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage
