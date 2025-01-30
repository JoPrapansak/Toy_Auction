'use client'

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
// import { set } from 'mongoose'

function Forgotpage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://nodejs-for-test-vua7.onrender.com/api/v1/accounts/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setMessage('Reset link has been sent to your email')
      } else {
        setMessage('Something went wrong')
      }
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div>
        <Navbar/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Forget Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
              onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Email"
                />
            </div>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-xl hover:bg-red-700"
              >
              Send Reset Link
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Forgotpage
