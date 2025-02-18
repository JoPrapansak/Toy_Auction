'use client'

import React, { useState } from 'react'
import NavUser from '../components/NavUser'

function CreateAuctionPage() {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    category: '', // Add category to form data
    startPrice: '',
    minBid: '',
    endDate: '',
    endTime: ''
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categories = [
    { id: 'gundam', name: 'Gundam' },
    { id: 'arttoy', name: 'Art Toy' },
    { id: 'figure', name: 'ฟิกเกอร์' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }))
    setIsDropdownOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log(formData)
  }

  return (
    <div>
      <NavUser/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* ชื่อสินค้า */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อสินค้า
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* รูปภาพ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพสินค้า
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* หมวดหมู่สินค้า */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่สินค้า
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-2 border rounded-lg flex items-center justify-between bg-white"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="text-gray-700">
                    {formData.category 
                      ? categories.find(cat => cat.id === formData.category)?.name 
                      : 'เลือกหมวดหมู่'}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ราคาเริ่มต้น */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ราคาเริ่มต้น (บาท)
              </label>
              <input
                type="number"
                name="startPrice"
                value={formData.startPrice}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* บิดขั้นต่ำ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บิดขั้นต่ำ (บาท)
              </label>
              <input
                type="number"
                name="minBid"
                value={formData.minBid}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* วันและเวลาปิดประมูล */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่ปิดประมูล
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เวลาปิดประมูล
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                สร้างการประมูล
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAuctionPage

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'

// function CreateAuctionPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     image: null,
//     startPrice: '',
//     minBid: '',
//     endDate: '',
//     endTime: ''
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     setFormData(prev => ({
//       ...prev,
//       image: file
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Add your form submission logic here
//     console.log(formData)
//   }

//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>
        
//         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//           <div className="bg-white rounded-lg shadow p-6 space-y-6">
//             {/* ชื่อสินค้า */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ชื่อสินค้า
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* รูปภาพ */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 รูปภาพสินค้า
//               </label>
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* ราคาเริ่มต้น */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ราคาเริ่มต้น (บาท)
//               </label>
//               <input
//                 type="number"
//                 name="startPrice"
//                 value={formData.startPrice}
//                 onChange={handleChange}
//                 min="0"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* บิดขั้นต่ำ */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 บิดขั้นต่ำ (บาท)
//               </label>
//               <input
//                 type="number"
//                 name="minBid"
//                 value={formData.minBid}
//                 onChange={handleChange}
//                 min="0"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             {/* วันและเวลาปิดประมูล */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   วันที่ปิดประมูล
//                 </label>
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   เวลาปิดประมูล
//                 </label>
//                 <input
//                   type="time"
//                   name="endTime"
//                   value={formData.endTime}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* ปุ่มบันทึก */}
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
//               >
//                 สร้างการประมูล
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreateAuctionPage
