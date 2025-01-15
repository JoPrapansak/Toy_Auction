'use client'

import React from 'react'
import Nav from '../components/Nav'
import Link from 'next/link'

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://nodejs-for-test-vua7.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "BusinessId": "1234567890",
          "device-fingerprint" : "unique-device-123456",
        },
        body: JSON.stringify({ email, password }),
      })
      if (res.status === 200) {
        window.location.href = '/'
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div>
      <Nav/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
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
            <div className="mb-6">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Password"
              />
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
            <a href="#" className="text-blue-500 hover:underline">
              ลืมรหัสผ่าน
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage


// 'use client'
// import React from 'react'

// import Nav from '../components/Nav'
// import {login} from './action'
// function loginPage() {
//   return (
//     <div>
//       <Nav/>
//       <form action={login}>
//         <div>
//           Email<input type="text" name='email'/>
//         </div>
//         <div>
//           Password<input type="password" name='password'/>
//         </div>
//         <button>Login</button>
//       </form>
//     </div>
//   )
// }

// export default loginPage

