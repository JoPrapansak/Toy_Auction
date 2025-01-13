import React from 'react'
import Link from 'next/link'

function NavUser() {
  return (
      <div className="bg-[#d53e40]">
        <div className="flex z-[10] gap-10 w-[100%] p-4 mb-5">
          ชื่อผู้ใช้
        </div>

        <div className="flex z-[10] gap-10 w-[100%] p-4 mb-5">
          <Link href="/">หน้าหลัก</Link>
          <Link href="/product">สินค้า</Link>
          <Link href="/asked">คำถามที่พบบ่อย</Link>
          <Link href="/about">เกี่ยวกับเรา</Link>
        </div>
      </div>
    
  )
}

export default NavUser