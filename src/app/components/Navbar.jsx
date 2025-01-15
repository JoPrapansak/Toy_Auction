import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
    <div>
      <nav className="bg-red-600 text-white py-3">
        <div className="container mx-auto">
            <div className='flex justify-between items-center'>
                
                <div className="flex-1 flex justify-center items-center">
                    <div className="text-2xl font-semibold ms-3">
                      Toy Auction
                    </div>
                    <input
                    type="text"
                    placeholder="ค้นหาสินค้า"
                    className="w-1/3 p-2 rounded ms-3"
                    />
                </div>
                <ul className='flex'>
                    <li className='ms-3'><Link href="/login">ล็อคอิน</Link></li>
                    <li className='ms-3'><Link href="/register">สมัครสมาชิก</Link></li>
                </ul>
            </div>
        </div>
      </nav>
      <nav className='bg-red-600 text-white py-3'>
        <div className='container mx-auto'>
            <div className='flex justify-center items-center'>
                <ul className='flex space-x-10'>
                    <li className='ms-3'><Link href="/">หน้าหลัก</Link></li>
                    <li className='ms-3'><Link href="/product">สินค้าประมูล</Link></li>
                    <li className='ms-3'><Link href="/asked"></Link>คำถามที่พบบ่อย</li>
                    <li className='ms-3'><Link href="/about"></Link>เกี่ยวกับเรา</li>
                </ul>
            </div>
            
        </div>
        
      </nav>
    </div>
  )
}

export default Navbar
