'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSearchParams, useRouter } from 'next/navigation'


function Resetpasswordpage() {
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if ( password !== confirmPassword) {
      setMessage('Passwords do not match')
      return;
    }
    if (!token){
      setMessage('Invalid token')
      return;
    }
    try {
      const res = await fetch('https://nodejs-for-test-vua7.onrender.com/api/v1/accounts/password/change/%7BEmail%7D', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          confirmPassword,
          resetPasswordToken: searchParams.get('token'),
        }),
      })
      if (res.ok) {
        setMessage('Password has been reset')
        router.push('/login')
      } else {
        setMessage('Something went wrong')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }
  
  return (
    <div>
      <main className="flex items-center justify-center py-16">
        <form onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md bg-opacity-70 backdrop-blur-lg">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Set New Password</h1>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-xl hover:bg-red-700"
          >
            Set Password
          </button>
        </form>
      </main>
    </div>
  )
}

export default Resetpasswordpage
