'use client'

import React, { useState } from 'react'
import NavUser from '../components/NavUser'
import { useRouter } from 'next/navigation'
import Input from '../components/Input'

function CreateAuctionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    images: [],
    category: '',
    description: '',
    startPrice: '',
    minBid: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [previewImages, setPreviewImages] = useState([])

  const categories = [
    { id: "designer_toys", name: "Designer Toys" },
    { id: "vinyl_figures", name: "Vinyl Figures" },
    { id: "resin_figures", name: "Resin Figures" },
    { id: "blind_box", name: "Blind Box" },
    { id: "anime_figures", name: "Anime Figures" },
    { id: "movie_game_collectibles", name: "Movie/Game Collectibles" },
    { id: "robot_mecha", name: "Robot Mecha" },
    { id: "soft_vinyl", name: "Soft Vinyl" },
    { id: "kaiju_monsters", name: "Kaiju Monsters" },
    { id: "diy_custom", name: "DIY Custom" },
    { id: "retro_vintage", name: "Retro Vintage" },
    { id: "limited_edition", name: "Limited Edition" },
    { id: "gunpla_models", name: "Gunpla Models" },
    { id: "plastic_models", name: "Plastic Models" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + formData.images.length > 5) {
      setMessage({ type: 'error', text: 'สามารถอัปโหลดรูปภาพได้ไม่เกิน 5 รูป' })
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))

    const previewURLs = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...previewURLs])
  }

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    const updatedPreviews = [...previewImages]
    updatedPreviews.splice(index, 1)

    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }))
    setPreviewImages(updatedPreviews)
  }

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('startingPrice', formData.startPrice)
      formDataToSend.append('minimumBidIncrement', formData.minBid)

      formData.images.forEach(image => {
        formDataToSend.append('image', image)
      })

      const response = await fetch('http://localhost:3111/api/v1/auction', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

      setMessage({ type: 'success', text: 'สร้างการประมูลสำเร็จ!' })
      setTimeout(() => router.push('/my-auctions'), 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavUser />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {message && (
              <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message.text}
              </div>
            )}

            <Input label="ชื่อสินค้า" type="text" name="name" value={formData.name} onChange={handleChange} required />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสินค้า (สูงสุด 5 รูป)</label>
              <input type="file" multiple onChange={handleImageChange} accept="image/*" className="w-full p-2 border rounded-lg" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img src={src} alt="Preview" className="w-full h-20 object-cover rounded-lg border" />
                    <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveImage(index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่สินค้า</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Input label="รายละเอียดสินค้า" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
            <Input label="ราคาเริ่มต้น (บาท)" type="text" name="startPrice" value={formData.startPrice} onChange={handleChange} required />
            <Input label="บิดขั้นต่ำ (บาท)" type="text" name="minBid" value={formData.minBid} onChange={handleChange} required />

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
                {loading ? 'กำลังสร้าง...' : 'สร้างการประมูล'}
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
// import { useRouter } from 'next/navigation'
// import Input from '../components/Input'


// function CreateAuctionPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     images: [],
//     category: '',
//     description: '',
//     startPrice: '',
//     minBid: '',
//     endDate: '',
//     endTime: ''
//   })
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState(null)
//   const [previewImages, setPreviewImages] = useState([])

//   const categories = [
//     { id: "designer_toys", name: "Designer Toys" },
//     { id: "vinyl_figures", name: "Vinyl Figures" },
//     { id: "resin_figures", name: "Resin Figures" },
//     { id: "blind_box", name: "Blind Box" },
//     { id: "anime_figures", name: "Anime Figures" },
//     { id: "movie_game_collectibles", name: "Movie/Game Collectibles" },
//     { id: "robot_mecha", name: "Robot Mecha" },
//     { id: "soft_vinyl", name: "Soft Vinyl" },
//     { id: "kaiju_monsters", name: "Kaiju Monsters" },
//     { id: "diy_custom", name: "DIY Custom" },
//     { id: "retro_vintage", name: "Retro Vintage" },
//     { id: "limited_edition", name: "Limited Edition" },
//     { id: "gunpla_models", name: "Gunpla Models" },
//     { id: "plastic_models", name: "Plastic Models" }
//   ];
  
  

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files)

//     if (files.length + formData.images.length > 5) {
//       setMessage({ type: 'error', text: 'สามารถอัปโหลดรูปภาพได้ไม่เกิน 5 รูป' })
//       return
//     }

//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }))

//     const previewURLs = files.map(file => URL.createObjectURL(file))
//     setPreviewImages(prev => [...prev, ...previewURLs])
//   }

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.images]
//     updatedImages.splice(index, 1)

//     const updatedPreviews = [...previewImages]
//     updatedPreviews.splice(index, 1)

//     setFormData(prev => ({
//       ...prev,
//       images: updatedImages
//     }))
//     setPreviewImages(updatedPreviews)
//   }

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       category: categoryId
//     }))
//     setIsDropdownOpen(false)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage(null)

//     try {
//       const formDataToSend = new FormData()
//       formDataToSend.append('name', formData.name)
//       formDataToSend.append('category', formData.category)
//       formDataToSend.append('description', formData.description)
//       formDataToSend.append('startingPrice', formData.startPrice)
//       formDataToSend.append('minimumBidIncrement', formData.minBid)
//       formDataToSend.append('expiresAt', `${formData.endDate}T${formData.endTime}:00Z`)

//       formData.images.forEach(image => {
//         formDataToSend.append('images', image)
//       })

//       const response = await fetch('http://localhost:3111/api/v1/auction', {
//         method: 'POST',
//         body: formDataToSend,
//         credentials: 'include'
//       })

//       const result = await response.json()

//       if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

//       setMessage({ type: 'success', text: 'สร้างการประมูลสำเร็จ!' })
//       setTimeout(() => router.push('/my-auctions'), 2000)
//     } catch (err) {
//       setMessage({ type: 'error', text: err.message })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>

//         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//           <div className="bg-white rounded-lg shadow p-6 space-y-6">
//             {message && (
//               <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                 {message.text}
//               </div>
//             )}

//             <Input label="ชื่อสินค้า" type="text" name="name" value={formData.name} onChange={handleChange} required />

//             {/* รูปภาพ (รองรับหลายรูป) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสินค้า (สูงสุด 5 รูป)</label>
//               <input type="file" multiple onChange={handleImageChange} accept="image/*" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
//               <div className="mt-3 grid grid-cols-3 gap-2">
//                 {previewImages.map((src, index) => (
//                   <div key={index} className="relative">
//                     <img src={src} alt="Preview" className="w-full h-20 object-cover rounded-lg border" />
//                     <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveImage(index)}>✕</button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* หมวดหมู่สินค้า */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่สินค้า</label>
//               <div className="relative">
//                 <button type="button" className="w-full p-2 border rounded-lg flex items-center justify-between bg-white" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//                   <span className="text-gray-700">{formData.category ? categories.find(cat => cat.id === formData.category)?.name : 'เลือกหมวดหมู่'}</span>
//                   <span className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>&#9662;</span>
//                 </button>

//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
//                     {categories.map((category) => (
//                       <button key={category.id} type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleCategorySelect(category.id)}>
//                         {category.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Input label="รายละเอียดสินค้า" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
//             <Input label="ราคาเริ่มต้น (บาท)" type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} min="0" required />
//             <Input label="บิดขั้นต่ำ (บาท)" type="number" name="minBid" value={formData.minBid} onChange={handleChange} min="0" required />

//             <div className="flex justify-end">
//               <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
//                 {loading ? 'กำลังสร้าง...' : 'สร้างการประมูล'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreateAuctionPage

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'
// import { useRouter } from 'next/navigation'
// import Input from '../components/Input.jsx'


// function CreateAuctionPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     images: [],
//     category: '',
//     description: '',
//     startPrice: '',
//     minBid: '',
//     endDate: '',
//     endTime: ''
//   })
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState(null)
//   const [previewImages, setPreviewImages] = useState([])

//   const categories = [
//     { id: "designer_toys", name: "Designer Toys" },
//     { id: "vinyl_figures", name: "Vinyl Figures" },
//     { id: "resin_figures", name: "Resin Figures" },
//     { id: "blind_box", name: "Blind Box" },
//     { id: "anime_figures", name: "Anime Figures" },
//     { id: "movie_game_collectibles", name: "Movie/Game Collectibles" },
//     { id: "robot_mecha", name: "Robot Mecha" },
//     { id: "soft_vinyl", name: "Soft Vinyl" },
//     { id: "kaiju_monsters", name: "Kaiju Monsters" },
//     { id: "diy_custom", name: "DIY Custom" },
//     { id: "retro_vintage", name: "Retro Vintage" },
//     { id: "limited_edition", name: "Limited Edition" },
//     { id: "gunpla_models", name: "Gunpla Models" },
//     { id: "plastic_models", name: "Plastic Models" }
//   ];
  
  

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files)

//     if (files.length + formData.images.length > 5) {
//       setMessage({ type: 'error', text: 'สามารถอัปโหลดรูปภาพได้ไม่เกิน 5 รูป' })
//       return
//     }

//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }))

//     const previewURLs = files.map(file => URL.createObjectURL(file))
//     setPreviewImages(prev => [...prev, ...previewURLs])
//   }

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.images]
//     updatedImages.splice(index, 1)

//     const updatedPreviews = [...previewImages]
//     updatedPreviews.splice(index, 1)

//     setFormData(prev => ({
//       ...prev,
//       images: updatedImages
//     }))
//     setPreviewImages(updatedPreviews)
//   }

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       category: categoryId
//     }))
//     setIsDropdownOpen(false)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage(null)

//     try {
//       const formDataToSend = new FormData()
//       formDataToSend.append('name', formData.name)
//       formDataToSend.append('category', formData.category)
//       formDataToSend.append('description', formData.description)
//       formDataToSend.append('startingPrice', formData.startPrice)
//       formDataToSend.append('minimumBidIncrement', formData.minBid)
//       formDataToSend.append('expiresAt', `${formData.endDate}T${formData.endTime}:00Z`)

//       formData.images.forEach(image => {
//         formDataToSend.append('images', image)
//       })

//       const response = await fetch('http://localhost:3111/api/v1/auction', {
//         method: 'POST',
//         body: formDataToSend,
//         credentials: 'include'
//       })

//       const result = await response.json()

//       if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด')

//       setMessage({ type: 'success', text: 'สร้างการประมูลสำเร็จ!' })
//       setTimeout(() => router.push('/my-auctions'), 2000)
//     } catch (err) {
//       setMessage({ type: 'error', text: err.message })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">สร้างการประมูล</h1>

//         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//           <div className="bg-white rounded-lg shadow p-6 space-y-6">
//             {message && (
//               <div className={`p-3 mb-4 text-sm rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                 {message.text}
//               </div>
//             )}

//             <Input label="ชื่อสินค้า" type="text" name="name" value={formData.name} onChange={handleChange} required />

//             {/* รูปภาพ (รองรับหลายรูป) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสินค้า (สูงสุด 5 รูป)</label>
//               <input type="file" multiple onChange={handleImageChange} accept="image/*" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
//               <div className="mt-3 grid grid-cols-3 gap-2">
//                 {previewImages.map((src, index) => (
//                   <div key={index} className="relative">
//                     <img src={src} alt="Preview" className="w-full h-20 object-cover rounded-lg border" />
//                     <button type="button" className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveImage(index)}>✕</button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* หมวดหมู่สินค้า */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่สินค้า</label>
//               <div className="relative">
//                 <button type="button" className="w-full p-2 border rounded-lg flex items-center justify-between bg-white" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
//                   <span className="text-gray-700">{formData.category ? categories.find(cat => cat.id === formData.category)?.name : 'เลือกหมวดหมู่'}</span>
//                   <span className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>&#9662;</span>
//                 </button>

//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
//                     {categories.map((category) => (
//                       <button key={category.id} type="button" className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleCategorySelect(category.id)}>
//                         {category.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Input label="รายละเอียดสินค้า" type="textarea" name="description" value={formData.description} onChange={handleChange} required />
//             <Input label="ราคาเริ่มต้น (บาท)" type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} min="0" required />
//             <Input label="บิดขั้นต่ำ (บาท)" type="number" name="minBid" value={formData.minBid} onChange={handleChange} min="0" required />

//             {/* <div className="grid grid-cols-2 gap-4">
//               <Input label="วันที่ปิดประมูล" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
//               <Input label="เวลาปิดประมูล" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
//             </div> */}

//             <div className="flex justify-end">
//               <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
//                 {loading ? 'กำลังสร้าง...' : 'สร้างการประมูล'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreateAuctionPage

// 'use client'

// import React, { useState } from 'react'
// import NavUser from '../components/NavUser'

// function CreateAuctionPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     image: null,
//     category: '', // Add category to form data
//     description: '', // Add this line
//     startPrice: '',
//     minBid: '',
//     endDate: '',
//     endTime: ''
//   })

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   const categories = [
//     { id: 'gundam', name: 'Gundam' },
//     { id: 'arttoy', name: 'Art Toy' },
//     { id: 'figure', name: 'ฟิกเกอร์' },
//   ]

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

//   const handleCategorySelect = (categoryId) => {
//     setFormData(prev => ({
//       ...prev,
//       category: categoryId
//     }))
//     setIsDropdownOpen(false)
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

//             {/* หมวดหมู่สินค้า */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 หมวดหมู่สินค้า
//               </label>
//               <div className="relative">
//                 <button
//                   type="button"
//                   className="w-full p-2 border rounded-lg flex items-center justify-between bg-white"
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                   <span className="text-gray-700">
//                     {formData.category 
//                       ? categories.find(cat => cat.id === formData.category)?.name 
//                       : 'เลือกหมวดหมู่'}
//                   </span>
//                   <svg 
//                     className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {isDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
//                     {categories.map((category) => (
//                       <button
//                         key={category.id}
//                         type="button"
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handleCategorySelect(category.id)}
//                       >
//                         {category.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
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

//             {/* รายละเอียดสินค้า */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 รายละเอียดสินค้า
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="กรุณากรอกรายละเอียดสินค้า"
//                 required
//               />
//             </div>

//             {/* วันและเวลาปิดประมูล */}
//             {/* <div className="grid grid-cols-2 gap-4">
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
//             </div> */}

//               <p className="text-red-500 text-sm mt-1">
//                   *เวลาปิดประมูลจะให้ระบบเซตเอง*
//               </p>

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
