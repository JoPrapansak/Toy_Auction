import React from 'react'

import Nav from '../components/Nav'

function RegisterPage() {
  return (
    <div>
      <Nav/>
      <main className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">สมัครสมาชิก</h2>
          <form>
          <div className="mb-4">
            <div className="flex items-center">
              <label htmlFor="email" className="text-gray-700 mr-4">
              <span className="text-red-500">*</span>ชื่อ:
              </label>
              <input
                type="name"
                id="name"
                className="flex-1 px-4 py-2 border rounded-md"
                placeholder="Name"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <label htmlFor="email" className="text-gray-700 mr-4">
              <span className="text-red-500">*</span>Email:
              </label>
              <input
                type="email"
                id="email"
                className="flex-1 px-4 py-2 border rounded-md"
                placeholder="Email"
              />
            </div>
          </div>
            <div className="mb-4">
              <div className="flex items-center">
                <label htmlFor="password" className="text-gray-700 mr-4">
                <span className="text-red-500">*</span>Password:
                </label>
                <input
                  type="password"
                  id="password"
                  className="flex-1 px-4 py-2 border rounded-md"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center">
                <label htmlFor="password" className="text-gray-700 mr-4">
                <span className="text-red-500">*</span>ยืนยันรหัสผ่าน:
                </label>
                <input
                  type="confirmpassword"
                  id="confirmpassword"
                  className="flex-1 px-4 py-2 border rounded-md"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

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

// import React from 'react'

// import Nav from '../components/Nav'

// function RegisterPage() {
//   return (
//     <div>
//       <Nav/>
//       <main className="flex items-center justify-center py-16">
//         <div className="w-full max-w-md bg-gray-100 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">เข้าสู่ระบบ</h2>
//           <form>
//             <div className="mb-4">
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Email"
//               />
//             </div>
//             <div className="mb-6">
//               <input
//                 type="password"
//                 id="password"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Password"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
//             >
//               เข้าสู่ระบบ
//             </button>
//           </form>
//           <div className="text-center mt-4 space-x-4">
//             <a href="/register" className="text-blue-500 hover:underline">
//               สมัครสมาชิก
//             </a>
//             <a href="#" className="text-blue-500 hover:underline">
//               ลืมรหัสผ่าน
//             </a>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default RegisterPage
