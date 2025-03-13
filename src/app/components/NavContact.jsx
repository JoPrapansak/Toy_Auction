import React from 'react'
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { SiLine } from "react-icons/si"

function NavContact() {
  return (
    <div className="bg-[#FFA6D4]">
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-6 text-white">ติดต่อเรา</h2>
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                {/* <h2 className="font-semibold">อีเมล</h2> */}
                <p className="text-white font-semibold">support@toyauction.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <div>
                {/* <h2 className="font-semibold">เบอร์โทรศัพท์</h2> */}
                <p className="text-white font-semibold">02-123-4567</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-6">
              {/* Facebook */}
              <div className="flex items-center space-x-4">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <FaFacebook className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  {/* <h2 className="font-semibold">Facebook</h2> */}
                  <p className="text-white font-semibold">Toy Auction</p>
                </div>
              </div>

              {/* Line */}
              <div className="flex items-center space-x-4">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <SiLine className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  {/* <h2 className="font-semibold">Line</h2> */}
                  <p className="text-white font-semibold">@toyauction</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-center space-x-4">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <FaInstagram className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  {/* <h2 className="font-semibold">Instagram</h2> */}
                  <p className="text-white font-semibold">@toyauction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavContact
