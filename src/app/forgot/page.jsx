import React from 'react'
import Navbar from '../components/Navbar'

function Forgotpage() {
  return (
    <div>
        <Navbar/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Forget Password</h2>
          <form >
            <div className="mb-4">
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Email"
                />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
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
