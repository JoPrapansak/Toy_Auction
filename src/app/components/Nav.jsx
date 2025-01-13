import React from 'react'

import Link from 'next/link'

function Nav() {
  return (
    <div>
      <header className="bg-red-600 text-white py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <input
              type="text"
              placeholder="ค้นหาสินค้า"
              className="px-20 py-2 rounded-md text-black"
            />
          </div>
          <div className="space-x-4">
            <Link href="/register" className="hover:underline">
              สมัครสมาชิก
            </Link>
            <Link href="/login" className="hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </header>
      <header className="bg-red-600 text-white py-3">
        <div className="container mx-auto flex justify-center items-center">
          <div className="space-x-6">
            <Link href="/" className="hover:underline">
              หน้าแรก
            </Link>
            <Link href="/product" className="hover:underline">
              สินค้าประมูล
            </Link>
            <Link href="/asked" className="hover:underline">
              คำถามที่พบบ่อย
            </Link>
            <Link href="/about" className="hover:underline">
              เกี่ยวกับเรา
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Nav


// import React from 'react'
// import Link from 'next/link' 

// function Nav() {
//   return (
//       <div className="bg-[#d53e40]">
//         <div className="flex z-[10] gap-10 w-[100%] p-4 mb-5">
//           <Link href="/register">สมัครสามชิก</Link>
//           <Link href="/login">เข้าสู่ระบบ</Link>
//         </div>

//         <div className="flex z-[10] gap-10 w-[100%] p-4 mb-5">
//           <Link href="/">หน้าหลัก</Link>
//           <Link href="/product">สินค้า</Link>
//           <Link href="/asked">คำถามที่พบบ่อย</Link>
//           <Link href="/about">เกี่ยวกับเรา</Link>
//         </div>
//       </div>
    
//   )
// }

// export default Nav

// import React from 'react'
// import Link from 'next/link'

// function Nav() {
//   return (
//     <div>
//       <div><Link href="/">Home</Link></div>
//       <div><Link href="/">Home</Link></div>
//       <div><Link href="/">Home</Link></div>
//       <div><Link href="/">Home</Link></div>
//     </div>
//   )
// }

// export default Nav
