'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavUser from '../components/NavUser'

const GENDER_MAP = {
  'ชาย': 'male',
  'หญิง': 'female',
  'อื่น ๆ': 'other'
}
const GENDER_REVERSE_MAP = {
  'male': 'ชาย',
  'female': 'หญิง',
  'other': 'อื่น ๆ'
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [phoneError, setPhoneError] = useState('')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3111/api/v1/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const { name, email, phone, gender, birthday, profileImage } = data.data
        setFormData({
          name: name || '',
          email: email || '',
          phone: phone || '',
          gender: GENDER_REVERSE_MAP[gender] || '',
          birthday: birthday ? birthday.slice(0, 10) : '',
        })
        setPreviewImage(profileImage)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value

    if (name === 'phone') {
      const raw = value.replace(/\D/g, '').slice(0, 10)

      if (raw.length <= 10) {
        if (raw.length <= 3) {
          newValue = raw
        }
        else if (raw.length <= 6) {
          newValue = `${raw.slice(0, 3)}-${raw.slice(3)}`
        } else {
          newValue = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`
        }
      }

      const isValid = /^0\d{9}$/.test(raw)
      setPhoneError(isValid ? '' : 'เบอร์โทรต้องขึ้นต้นด้วย 0 และมีทั้งหมด 10 ตัวเลข')

      setFormData(prev => ({ ...prev, [name]: newValue }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: newValue }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const rawPhone = formData.phone.replace(/\D/g, '')
    const isValidPhone = /^0\d{9}$/.test(rawPhone)

    if (!isValidPhone) {
      setPhoneError('เบอร์โทรต้องขึ้นต้นด้วย 0 และมีทั้งหมด 10 ตัวเลข')
      return
    }

    setPhoneError('')
    setNameError('')

    const res = await fetch('http://localhost:3111/api/v1/profile/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: formData.name,
        phone: rawPhone,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      if (result.message?.includes('เบอร์โทร')) setPhoneError(result.message)
      if (result.message?.includes('ชื่อ')) setNameError(result.message)
      return
    }

    if (profileImage) {
      const fd = new FormData()
      fd.append('image', profileImage)
      await fetch('http://localhost:3111/api/v1/profile/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
    }

    window.location.href = '/profile'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
      <NavUser />
      <div className="max-w-5xl mx-auto bg-white mt-10 p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-pink-500 mb-6 border-b pb-3">🎠 ข้อมูลของฉัน</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-5">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">ชื่อผู้ใช้</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border p-2 rounded-md transition ${
                  nameError ? 'border-red-400 focus:ring-red-300' : 'border-pink-200 focus:ring-pink-300'
                }`}
              />
              {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">อีเมล</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">หมายเลขโทรศัพท์</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border p-2 rounded-md transition ${
                  phoneError ? 'border-red-400 focus:ring-red-300' : 'border-pink-200 focus:ring-pink-300'
                }`}
              />
              {phoneError && (
                <p className="text-sm text-red-500 mt-1">{phoneError}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-fit px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
            >
              💾 บันทึก
            </button>
          </div>

          <div className="w-full md:w-1/3 text-center space-y-4">
            <img
              src={previewImage || "/image/Nullprofile.png"}
              className="w-28 h-28 rounded-full mx-auto border border-gray-300 shadow"
              alt="Profile"
            />
            <label className="block cursor-pointer">
              <span className="text-pink-500 text-sm font-medium hover:underline">เลือกรูปใหม่</span>
              <input type="file" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// const GENDER_MAP = {
//   'ชาย': 'male',
//   'หญิง': 'female',
//   'อื่น ๆ': 'other'
// }
// const GENDER_REVERSE_MAP = {
//   'male': 'ชาย',
//   'female': 'หญิง',
//   'other': 'อื่น ๆ'
// }

// export default function EditProfilePage() {

//   const [nameError, setNameError] = useState('')
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthday: '',
//   })
//   const [previewImage, setPreviewImage] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)
//   const [phoneError, setPhoneError] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:3111/api/v1/profile', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(data => {
//         const { name, email, phone, gender, birthday, profileImage } = data.data
//         setFormData({
//           name: name || '',
//           email: email || '',
//           phone: phone || '',
//         })
//         setPreviewImage(profileImage)
//       })
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;
  
//     if (name === 'phone') {
//       const raw = value.replace(/\D/g, '').slice(0, 10);
  
//       const isValid = /^0\d{9}$/.test(raw);
//       // setPhoneError(isValid ? '' : 'เบอร์โทรต้องขึ้นต้นด้วย 0 และมีทั้งหมด 10 ตัวเลข');
  
//       setFormData(prev => ({ ...prev, [name]: raw }));
//       return;
//     }
  
//     setFormData(prev => ({ ...prev, [name]: newValue }));
//   };
  

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const rawPhone = formData.phone.replace(/\D/g, '');
//     const isValidPhone = /^0\d{9}$/.test(rawPhone);

  
//     if (!isValidPhone) {
//       setPhoneError('เบอร์โทรต้องขึ้นต้นด้วย 0 และมีทั้งหมด 10 ตัวเลข');
//       return;
//     }
  
//     // อัปเดตข้อมูล
//     await fetch('http://localhost:3111/api/v1/profile/update-profile', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         name: formData.name,
//         phone: rawPhone,
//         gender: GENDER_MAP[formData.gender] || 'other',
//         birthday: formData.birthday
//       }),
//     });

//     if (!res.ok) {
//       if (result.message?.includes('เบอร์โทร')) setPhoneError(result.message)
//       if (result.message?.includes('ชื่อ')) setNameError(result.message)
//       return
//     }
    
//     if (profileImage) {
//       const fd = new FormData();
//       fd.append('image', profileImage);
//       await fetch('http://localhost:3111/api/v1/profile/upload', {
//         method: 'POST',
//         body: fd,
//         credentials: 'include',
//       });
//     }
  
//     window.location.href = '/profile';
//   };
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
//       <NavUser />
//       <div className="max-w-5xl mx-auto bg-white mt-10 p-8 rounded-2xl shadow-xl border border-gray-100">
//         <h2 className="text-2xl font-bold text-pink-500 mb-6 border-b pb-3">🎠 ข้อมูลของฉัน</h2>
        
//         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
//           <div className="flex-1 space-y-5">
//             <div>
//               <label className="block font-semibold text-gray-700 mb-1">ชื่อผู้ใช้</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//               />
//             </div>

//             <div>
//               <label className="block font-semibold text-gray-700 mb-1">อีเมล</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 readOnly
//                 className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 text-gray-600"
//               />
//             </div>

//             <div>
//               <label className="block font-semibold text-gray-700 mb-1">หมายเลขโทรศัพท์</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`w-full border p-2 rounded-md transition ${
//                   phoneError ? 'border-red-400 focus:ring-red-300' : 'border-pink-200 focus:ring-pink-300'
//                 }`}
//               />
//               {phoneError && (
//                 <p className="text-sm text-red-500 mt-1">{phoneError}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="mt-6 w-fit px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
//             >
//               💾 บันทึก
//             </button>
//           </div>

//           <div className="w-full md:w-1/3 text-center space-y-4">
//             <img
//               src={previewImage || "/image/Nullprofile.png"}
//               className="w-28 h-28 rounded-full mx-auto border border-gray-300 shadow"
//               alt="Profile"
//             />
//             <label className="block cursor-pointer">
//               <span className="text-pink-500 text-sm font-medium hover:underline">เลือกรูปใหม่</span>
//               <input type="file" className="hidden" onChange={handleImageChange} />
//             </label>
//             {/* <p className="text-xs text-gray-400 leading-snug">
//               ขนาดไฟล์: สูงสุด 1 MB<br />
//               รองรับ: .JPEG, .PNG
//             </p> */}
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'


// const GENDER_MAP = {
//   'ชาย': 'male',
//   'หญิง': 'female',
//   'อื่น ๆ': 'other'
// }
// const GENDER_REVERSE_MAP = {
//   'male': 'ชาย',
//   'female': 'หญิง',
//   'other': 'อื่น ๆ'
// }

// export default function EditProfilePage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthday: '',
//   })
//   const [previewImage, setPreviewImage] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)

//   useEffect(() => {
//     fetch('http://localhost:3111/api/v1/profile', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(data => {
//         const { name, email, phone, profileImage } = data.data
//         setFormData({
//           name: name || '',
//           email: email || '',
//           phone: phone || '',
//         })
        
//         setPreviewImage(profileImage)
//       })
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newValue = value;
  
//     if (name === 'phone') {
//       const raw = value.replace(/\D/g, '').slice(0, 10);
  
//       if (raw.length <= 10) {
//         if (raw.length <= 3) {
//           newValue = raw;
//         } else if (raw.length <= 6) {
//           newValue = `${raw.slice(0, 3)}-${raw.slice(3)}`;
//         } else {
//           newValue = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
//         }
//       }
      
//       const isValid = /^0\d{9}$/.test(raw);
//       setPhoneError(isValid ? '' : 'เบอร์โทรต้องขึ้นต้นด้วย 0 และมีทั้งหมด 10 ตัวเลข');
  
//       setFormData(prev => ({ ...prev, [name]: newValue }));
//       return;
//     }
  
//     setFormData(prev => ({ ...prev, [name]: newValue }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     await fetch('http://localhost:3111/api/v1/profile/update-profile', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         ...formData,
//         gender: GENDER_MAP[formData.gender] || 'other',
//       }),
//     })

//     if (profileImage) {
//       const fd = new FormData()
//       fd.append('image', profileImage)
//       await fetch('http://localhost:3111/api/v1/profile/upload', {
//         method: 'POST',
//         body: fd,
//         credentials: 'include',
//       })
//     }

//     router.push('/profile')
//   }

// return (
//   <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
//     <NavUser />
//     <div className="max-w-5xl mx-auto bg-white mt-10 p-8 rounded-2xl shadow-xl border border-gray-100">
//       <h2 className="text-2xl font-bold text-pink-500 mb-6 border-b pb-3">🎠 ข้อมูลของฉัน</h2>
      
//       <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
//         {/* ข้อมูลหลัก */}
//         <div className="flex-1 space-y-5">
//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">ชื่อผู้ใช้</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">อีเมล</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 readOnly
//                 className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 text-gray-600"
//               />
//               {/* <button type="button" className="text-sm text-pink-600 hover:underline">เปลี่ยน</button> */}
//             </div>
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">หมายเลขโทรศัพท์</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//                 pattern="[0-9]*"
//               />
//               {/* <button type="button" className="text-sm text-pink-600 hover:underline">เปลี่ยน</button> */}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="mt-6 w-fit px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
//           >
//             💾 บันทึก
//           </button>
//         </div>

//         {/* รูปโปรไฟล์ */}
//         <div className="w-full md:w-1/3 text-center space-y-4">
//           <img
//             src={previewImage || "/image/Nullprofile.png"}
//             className="w-28 h-28 rounded-full mx-auto border border-gray-300 shadow"
//             alt="Profile"
//           />
//           <label className="block cursor-pointer">
//             <span className="text-pink-500 text-sm font-medium hover:underline">เลือกรูปใหม่</span>
//             <input type="file" className="hidden" onChange={handleImageChange} />
//           </label>
//           {/* <p className="text-xs text-gray-400 leading-snug">
//             ขนาดไฟล์: สูงสุด 1 MB<br />
//             รองรับ: .JPEG, .PNG
//           </p> */}
//         </div>
//       </form>
//     </div>
//   </div>
// );

// }

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// export default function EditProfilePage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthday: '',
//   })
//   const [previewImage, setPreviewImage] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)

//   useEffect(() => {
//     fetch('http://localhost:3111/api/v1/profile', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(data => {
//         const { name, email, phone, gender, birthday, profileImage } = data.data
//         setFormData({
//           name: name || '',
//           email: email || '',
//           phone: phone || '',
//           gender: gender || '',
//           birthday: birthday ? birthday.slice(0, 10) : '',
//         })
//         setPreviewImage(profileImage)
//       })
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     await fetch('http://localhost:3111/api/v1/profile/update-profile', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify(formData),
//     })

//     if (profileImage) {
//       const fd = new FormData()
//       fd.append('image', profileImage)
//       await fetch('http://localhost:3111/api/v1/profile/upload', {
//         method: 'POST',
//         body: fd,
//         credentials: 'include',
//       })
//     }

//     router.push('/profile')
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <NavUser />
//       <div className="max-w-5xl mx-auto bg-white mt-8 p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-6 border-b pb-2">ข้อมูลของฉัน</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
//           {/* ข้อมูลหลัก */}
//           <div className="flex-1 space-y-4">
//             <div>
//               <label className="block font-semibold text-gray-700">ชื่อผู้ใช้</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <label className="block font-semibold text-gray-700">อีเมล</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   readOnly
//                   className="w-full border p-2 rounded bg-gray-100"
//                 />
//               </div>
//               <button type="button" className="text-blue-600 mt-6">เปลี่ยน</button>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <label className="block font-semibold text-gray-700">หมายเลขโทรศัพท์</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//               </div>
//               <button type="button" className="text-blue-600 mt-6">เปลี่ยน</button>
//             </div>

//             <div>
//               <label className="block font-semibold text-gray-700">เพศ</label>
//               <div className="flex gap-4 mt-1">
//                 <label><input type="radio" name="gender" value="ชาย" checked={formData.gender === 'ชาย'} onChange={handleChange} /> ชาย</label>
//                 <label><input type="radio" name="gender" value="หญิง" checked={formData.gender === 'หญิง'} onChange={handleChange} /> หญิง</label>
//                 <label><input type="radio" name="gender" value="อื่น ๆ" checked={formData.gender === 'อื่น ๆ'} onChange={handleChange} /> อื่น ๆ</label>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <label className="block font-semibold text-gray-700">วันเกิด</label>
//                 <input
//                   type="date"
//                   name="birthday"
//                   value={formData.birthday}
//                   onChange={handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//               </div>
//               <button type="button" className="text-blue-600 mt-6">เปลี่ยน</button>
//             </div>

//             <button
//               type="submit"
//               className="mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             >
//               บันทึก
//             </button>
//           </div>

//           {/* รูปโปรไฟล์ */}
//           <div className="w-full md:w-1/3 text-center space-y-3">
//             <img
//               src={previewImage || "/image/Nullprofile.png"}
//               className="w-24 h-24 rounded-full mx-auto border"
//               alt="Profile"
//             />
//             <label className="block">
//               <span className="text-gray-600 text-sm">เลือกรูป</span>
//               <input type="file" className="hidden" onChange={handleImageChange} />
//             </label>
//             <p className="text-xs text-gray-400">ขนาดไฟล์: สูงสุด 1 MB<br />ไฟล์ที่รองรับ: .JPEG, .PNG</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// function EditProfilePage() {
//   const router = useRouter()
//   const [profileImage, setProfileImage] = useState(null)
//   const [previewImage, setPreviewImage] = useState(null)
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' })

//   // ✅ โหลดข้อมูลโปรไฟล์จากเซิร์ฟเวอร์
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           method: 'GET',
//           credentials: 'include',
//         })
//         if (!response.ok) throw new Error('โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')
//         const data = await response.json()

//         setFormData({
//           name: data.data.name || '',
//           email: data.data.email || '',
//           phone: data.data.phone || '',
//           address: data.data.address || '',
//         })
//         setPreviewImage(data.data.profileImage) // ✅ โหลดรูปโปรไฟล์จาก API
//       } catch (error) {
//         console.error('❌ Error loading profile:', error)
//       }
//     }

//     fetchProfile()
//   }, [])

//   const handleCancel = () => {
//     router.push('/profile')
//   }

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file)) // ✅ แสดงตัวอย่างรูปที่เลือก
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     console.log("📩 Sending Data:", formData) // ✅ Debug formData ก่อนส่ง

//     try {
//       // 🔹 อัปเดตข้อมูลโปรไฟล์
//       const profileUpdateResponse = await fetch('http://localhost:3111/api/v1/profile', {
//         method: 'PUT',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       })

//       if (!profileUpdateResponse.ok) throw new Error('อัปเดตข้อมูลไม่สำเร็จ')

//       // 🔹 อัปโหลดรูปโปรไฟล์ (ถ้ามีการเปลี่ยนรูป)
//       if (profileImage) {
//         const formDataToSend = new FormData()
//         formDataToSend.append('image', profileImage)

//         const uploadResponse = await fetch('http://localhost:3111/api/v1/profile/upload', {
//           method: 'POST',
//           credentials: 'include',
//           body: formDataToSend,
//         })

//         if (!uploadResponse.ok) throw new Error('อัปโหลดรูปภาพไม่สำเร็จ')

//         // ✅ โหลดรูปใหม่หลังอัปโหลด
//         const imageData = await uploadResponse.json()
//         setPreviewImage(imageData.image)
//       }

//       router.push('/profile') // 🔄 กลับไปหน้าโปรไฟล์
//     } catch (error) {
//       console.error('❌ Error updating profile:', error)
//     }
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <NavUser />
//       <div className="container mx-auto px-4 py-10 flex flex-col items-center">
//         <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
//           <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">แก้ไขข้อมูลส่วนตัว</h1>
          
//           <form onSubmit={handleSubmit}>
//             {/* Profile Image Section */}
//             <div className="mb-6 flex flex-col items-center">
//               <img 
//                 src={previewImage || "/image/profile1.jpg"} 
//                 alt="Profile" 
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 mb-4"
//               />
//               <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                 อัพโหลดรูปภาพ
//                 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
//               </label>
//             </div>

//             {/* Personal Information */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-1">ชื่อผู้ใช้</label>
//                 <input 
//                   type="text"
//                   name="name"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อผู้ใช้"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">อีเมล</label>
//                 <input 
//                   type="email"
//                   name="email"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="example@email.com"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   readOnly // 🔹 ไม่ให้แก้ไขอีเมล
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">เบอร์โทรศัพท์</label>
//                 <input 
//                   type="tel"
//                   name="phone"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="เบอร์โทรศัพท์"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">ที่อยู่</label>
//                 <textarea 
//                   name="address"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   rows="3"
//                   placeholder="ที่อยู่"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                 ></textarea>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col space-y-4 mt-6">
//               <button 
//                 type="submit"
//                 className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
//               >
//                 บันทึก
//               </button>
//               <button 
//                 type="button"
//                 onClick={handleCancel}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
//               >
//                 ยกเลิก
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// function EditProfilePage() {
//   const router = useRouter()
//   const [profileImage, setProfileImage] = useState(null)
//   const [previewImage, setPreviewImage] = useState(null)
//   const [formData, setFormData] = useState({ name: '', phone: '', address: '' })

//   // โหลดข้อมูลโปรไฟล์จากเซิร์ฟเวอร์
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           method: 'GET',
//           credentials: 'include',
//         })
//         if (!response.ok) throw new Error('โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')
//         const data = await response.json()
//         setFormData({
//           name: data.data.profile.name || 'New User',  // ✅ ป้องกัน name ว่าง,
//           phone: data.data.profile.phone || '',
//           address: data.data.profile.address || '',
//         })
//       } catch (error) {
//         console.error('Error loading profile:', error)
//       }
//     }

//     const fetchProfileImage = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile/image', {
//           method: 'GET',
//           credentials: 'include',
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setPreviewImage(data.image) // ใช้ Base64 image
//         }
//       } catch (error) {
//         console.error('Error loading profile image:', error)
//       }
//     }

//     fetchProfile()
//     fetchProfileImage()
//   }, [])

//   const handleCancel = () => {
//     router.push('/profile')
//   }

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file)) // แสดงตัวอย่างรูปที่เลือก
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log("📩 Sending Data:", formData); // ✅ Debug formData ก่อนส่ง
  
//     try {
//       // 🔹 อัปเดตข้อมูลโปรไฟล์
//       const profileUpdateResponse = await fetch('http://localhost:3111/api/v1/profile', {
//         method: 'PUT',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
  
//       if (!profileUpdateResponse.ok) throw new Error('อัปเดตข้อมูลไม่สำเร็จ');
  
//       // 🔹 อัปโหลดรูปโปรไฟล์ (ถ้ามีการเปลี่ยนรูป)
//       if (profileImage) {
//         const formDataToSend = new FormData();
//         formDataToSend.append('image', profileImage);
  
//         const uploadResponse = await fetch('http://localhost:3111/api/v1/profile/upload', {
//           method: 'POST',
//           credentials: 'include',
//           body: formDataToSend,
//         });
  
//         if (!uploadResponse.ok) throw new Error('อัปโหลดรูปภาพไม่สำเร็จ');
//       }
  
//       router.push('/profile'); // 🔄 กลับไปหน้าโปรไฟล์
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     }
//   };
  
  

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <NavUser />
//       <div className="container mx-auto px-4 py-10 flex flex-col items-center">
//         <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
//           <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">แก้ไขข้อมูลส่วนตัว</h1>
          
//           <form onSubmit={handleSubmit}>
//             {/* Profile Image Section */}
//             <div className="mb-6 flex flex-col items-center">
//               <img 
//                 src={previewImage || "/image/profile1.jpg"} 
//                 alt="Profile" 
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300 mb-4"
//               />
//               <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
//                 อัพโหลดรูปภาพ
//                 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
//               </label>
//             </div>

//             {/* Personal Information */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-1">ชื่อผู้ใช้</label>
//                 <input 
//                   type="text"
//                   name="name"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อผู้ใช้"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">เบอร์โทรศัพท์</label>
//                 <input 
//                   type="tel"
//                   name="phone"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="เบอร์โทรศัพท์"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-1">ที่อยู่</label>
//                 <textarea 
//                   name="address"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//                   rows="3"
//                   placeholder="ที่อยู่"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                 ></textarea>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col space-y-4 mt-6">
//               <button 
//                 type="submit"
//                 className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
//               >
//                 บันทึก
//               </button>
//               <button 
//                 type="button"
//                 onClick={handleCancel}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
//               >
//                 ยกเลิก
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditProfilePage

// 'use client'

// import React from 'react'
// import Navbar from '../components/Navbar'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'

// function EditProfilePage() {
//   const router = useRouter()

//   const handleCancel = () => {
//     router.push('/profile')
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Add your form submission logic here
//     router.push('/profile')
//   }

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลส่วนตัว</h1>
          
//           <form onSubmit={handleSubmit}>
//             {/* Profile Image Section */}
//             <div className="mb-6">
//               <div className="flex flex-col items-center">
//                 <img 
//                   src="/image/profile1.jpg" 
//                   alt="Profile" 
//                   className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4"
//                 />
//                 <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
//                   <span>อัพโหลดรูปภาพ</span>
//                   <input type="file" className="hidden" accept="image/*" />
//                 </label>
//               </div>
//             </div>

//             {/* Personal Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 mb-2">ชื่อผู้ใช้</label>
//                 <input 
//                   type="text"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อผู้ใช้"
//                 />
//               </div>
              
//               {/* <div>
//                 <label className="block text-gray-700 mb-2">อีเมล</label>
//                 <input 
//                   type="email"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="อีเมล"
//                 />
//               </div> */}

//               {/* <div>
//                 <label className="block text-gray-700 mb-2">ชื่อ-นามสกุล</label>
//                 <input 
//                   type="text"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="ชื่อ-นามสกุล"
//                 />
//               </div> */}

//               <div>
//                 <label className="block text-gray-700 mb-2">เบอร์โทรศัพท์</label>
//                 <input 
//                   type="tel"
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   placeholder="เบอร์โทรศัพท์"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 mb-2">ที่อยู่</label>
//                 <textarea 
//                   className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                   rows="3"
//                   placeholder="ที่อยู่"
//                 ></textarea>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-4 mt-6">
//               <button 
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-100"
//               >
//                 ยกเลิก
//               </button>
//               <button 
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 บันทึก
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditProfilePage

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import NavUser from '../components/NavUser'


// const GENDER_MAP = {
//   'ชาย': 'male',
//   'หญิง': 'female',
//   'อื่น ๆ': 'other'
// }
// const GENDER_REVERSE_MAP = {
//   'male': 'ชาย',
//   'female': 'หญิง',
//   'other': 'อื่น ๆ'
// }

// export default function EditProfilePage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthday: '',
//   })
//   const [originalData, setOriginalData] = useState(null) // Store original data
//   const [previewImage, setPreviewImage] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)

//   useEffect(() => {
//     fetch('http://localhost:3111/api/v1/profile', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(data => {
//         const { name, email, phone, gender, birthday, profileImage } = data.data
//         const initialData = {
//           name: name || '',
//           email: email || '',
//           phone: phone || '',
//           gender: GENDER_REVERSE_MAP[gender] || '',
//           birthday: birthday ? birthday.slice(0, 10) : '',
//         }
//         setFormData(initialData)
//         setOriginalData(initialData) // Save original data
//         setPreviewImage(profileImage)
//       })
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setProfileImage(file)
//       setPreviewImage(URL.createObjectURL(file))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Check if the updated data is the same as the original data
//     if (JSON.stringify(formData) === JSON.stringify(originalData) && !profileImage) {
//       alert('ไม่มีการเปลี่ยนแปลงข้อมูล')
//       return
//     }

//     await fetch('http://localhost:3111/api/v1/profile/update-profile', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         ...formData,
//         gender: GENDER_MAP[formData.gender] || 'other',
//       }),
//     })

//     if (profileImage) {
//       const fd = new FormData()
//       fd.append('image', profileImage)
//       await fetch('http://localhost:3111/api/v1/profile/upload', {
//         method: 'POST',
//         body: fd,
//         credentials: 'include',
//       })
//     }

//     router.push('/profile')
//   }

// return (
//   <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
//     <NavUser />
//     <div className="max-w-5xl mx-auto bg-white mt-10 p-8 rounded-2xl shadow-xl border border-gray-100">
//       <h2 className="text-2xl font-bold text-pink-500 mb-6 border-b pb-3">🎠 ข้อมูลของฉัน</h2>
      
//       <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
//         {/* ข้อมูลหลัก */}
//         <div className="flex-1 space-y-5">
//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">ชื่อผู้ใช้</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">อีเมล</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 readOnly
//                 className="w-full border border-gray-200 p-2 rounded-md bg-gray-100 text-gray-600"
//               />
//               <button type="button" className="text-sm text-pink-600 hover:underline">เปลี่ยน</button>
//             </div>
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">หมายเลขโทรศัพท์</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//               />
//               <button type="button" className="text-sm text-pink-600 hover:underline">เปลี่ยน</button>
//             </div>
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">เพศ</label>
//             <div className="flex gap-5 mt-1 text-gray-700">
//               {['ชาย', 'หญิง', 'อื่น ๆ'].map(gender => (
//                 <label key={gender} className="inline-flex items-center gap-1">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value={gender}
//                     checked={formData.gender === gender}
//                     onChange={handleChange}
//                     className="accent-pink-400"
//                   />
//                   {gender}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block font-semibold text-gray-700 mb-1">วันเกิด</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="date"
//                 name="birthday"
//                 value={formData.birthday}
//                 onChange={handleChange}
//                 className="w-full border border-pink-200 p-2 rounded-md focus:ring-2 focus:ring-pink-300 transition"
//               />
//               <button type="button" className="text-sm text-pink-600 hover:underline">เปลี่ยน</button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="mt-6 w-fit px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
//           >
//             💾 บันทึก
//           </button>
//         </div>

//         {/* รูปโปรไฟล์ */}
//         <div className="w-full md:w-1/3 text-center space-y-4">
//           <img
//             src={previewImage || "/image/Nullprofile.png"}
//             className="w-28 h-28 rounded-full mx-auto border border-gray-300 shadow"
//             alt="Profile"
//           />
//           <label className="block cursor-pointer">
//             <span className="text-pink-500 text-sm font-medium hover:underline">เลือกรูปใหม่</span>
//             <input type="file" className="hidden" onChange={handleImageChange} />
//           </label>
//           <p className="text-xs text-gray-400 leading-snug">
//             ขนาดไฟล์: สูงสุด 1 MB<br />
//             รองรับ: .JPEG, .PNG
//           </p>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// }