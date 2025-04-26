'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavUser from '../components/NavUser';

import provinces from '../../../data/provinces.json';
import amphures from '../../../data/amphures.json';
import districts from '../../../data/districts.json';


const API_URL = 'http://localhost:3111/api/v1';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedAmphure, setSelectedAmphure] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [zipcode, setZipcode] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
      const data = await res.json();
      setProfile(data.data);
    } catch (err) {
      // setError('ไม่สามารถโหลดโปรไฟล์ได้');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async () => {
    if (!newLabel && !newName && !newPhone && !newAddress && !selectedProvince && !selectedAmphure && !selectedDistrict) {
      alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
      return;
    }
    if (!newLabel) {
      alert('กรุณากรอกชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน');
      return;
    }
    if (!newName) {
      alert('กรุณากรอกชื่อผู้รับ');
      return;
    }
    if (!newPhone) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    if (!newAddress) {
      alert('กรุณากรอกรายละเอียดที่อยู่');
      return;
    }
    if (!selectedProvince) {
      alert('กรุณาเลือกจังหวัด');
      return;
    }
    if (!selectedAmphure) {
      alert('กรุณาเลือกอำเภอ');
      return;
    }
    if (!selectedDistrict) {
      alert('กรุณาเลือกตำบล');
      return;
    }
  
    const provinceName = provinces.find(p => p.id === Number(selectedProvince))?.name_th || '';
    const amphureName = amphures.find(a => a.id === Number(selectedAmphure))?.name_th || '';
    const districtName = districts.find(d => d.id === Number(selectedDistrict))?.name_th || '';

    const fullAddr = `${newAddress}, ต.${districtName}, อ.${amphureName}, จ.${provinceName} ${zipcode}`;

    const res = await fetch(`${API_URL}/profile/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        label: newLabel,
        fullAddress: fullAddr,
        name: newName,
        phone: newPhone
      }),
    });
    const data = await res.json();
    if (data.success) {
      setNewLabel('');
      setNewAddress('');
      setNewName('');
      setNewPhone('');
      setSelectedProvince('');
      setSelectedAmphure('');
      setSelectedDistrict('');
      setZipcode('');
      setRefresh(!refresh);
    }
  };

  const deleteAddress = async (id) => {
    await fetch(`${API_URL}/profile/addresses/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    setRefresh(!refresh);
  };

  const setDefault = async (id) => {
    await fetch(`${API_URL}/profile/addresses/default/${id}`, {
      method: 'PATCH',
      credentials: 'include'
    });
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchProfile();
  }, [refresh]);

  useEffect(() => {
    const district = districts.find(d => d.id === Number(selectedDistrict));
    if (district) setZipcode(district.zip_code.toString());
  }, [selectedDistrict]);

  const amphureOptions = amphures.filter(a => a.province_id === Number(selectedProvince));
  const districtOptions = districts.filter(d => d.amphure_id === Number(selectedAmphure));

  if (loading) return <div className="text-center py-6 text-gray-500">⏳ กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-pink-50 min-h-screen">
      <NavUser />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          {/* Profile */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={profile?.profileImage || "/image/Nullprofile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-pink-300 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-pink-600">{profile?.name}</h2>
              <p className="text-gray-600">📧 {profile?.email}</p>
              <p className="text-gray-600">📞 {profile?.phone}</p>
              <p className="text-sm text-gray-400 mt-1">
                สมัครเมื่อ {new Date(profile?.createdAt).toLocaleDateString('th-TH')}
              </p>
              <Link href="/editprofile">
                <button className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition shadow">
                  ✏️ แก้ไขข้อมูลส่วนตัว
                </button>
              </Link>
            </div>
          </div>
  
          {/* Address Section */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">ที่อยู่ของฉัน</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className={`px-4 py-2 rounded-full transition-all font-medium shadow-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600`}
              >
               + เพิ่มที่อยู่ใหม่
              </button>
            </div>
  
            {profile?.addresses?.length === 0 && (
              <p className="text-sm text-gray-500 mb-4">คุณยังไม่มีที่อยู่จัดส่ง 📨</p>
            )}
  
            {profile?.addresses?.map((addr, index) => (
              <div key={index} className="border border-pink-200 p-5 rounded-xl mb-4 bg-pink-50 shadow-sm">
                <p className="font-bold text-lg text-pink-600">{addr.label}</p>
                <p className="text-sm text-gray-700">👤 {addr.name}</p>
                <p className="text-sm text-gray-700">📞 {addr.phone}</p>
                <p className="text-sm text-gray-700">📮 {addr.fullAddress}</p>
  
                <div className="mt-3 flex gap-4 text-sm">
                  {addr.isDefault ? (
                    <span className="text-green-600 font-medium border px-2 py-0.5 rounded border-green-500">ค่าเริ่มต้น</span>
                  ) : (
                    <button onClick={() => setDefault(addr._id)} className="text-blue-500 hover:underline">⭐ ตั้งเป็นค่าหลัก</button>
                  )}
                  <button onClick={() => deleteAddress(addr._id)} className="text-red-500 hover:underline">🗑 ลบ</button>
                </div>
              </div>
            ))}
  
            {/* 🎯 New Address Form */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl shadow-lg w-full max-w-xl animate-fade-in-down relative">
                  <button
                    onClick={() => setShowForm(false)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                  >
                    ❌
                  </button>
                  <h4 className="text-lg font-semibold mb-4 text-yellow-700">🧸 เพิ่มที่อยู่ใหม่</h4>

                  <input
                    type="text"
                    placeholder="🎯 ชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-orange-300"
                  />
                  <input
                    type="text"
                    placeholder="👤 ชื่อผู้รับ"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-orange-300"
                  />
                  <input
                    type="text"
                    placeholder="📱 เบอร์โทรศัพท์"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-orange-300"
                  />
                  <textarea
                    placeholder="🏠 บ้านเลขที่, ซอย, ถนน"
                    rows={2}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg mb-3 focus:ring-2 focus:ring-orange-300"
                  />

                  {/* Dropdowns */}
                    <select className="w-full border px-4 py-2 rounded-lg mb-3" value={selectedProvince} onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedAmphure('');
                      setSelectedDistrict('');
                      setZipcode('');
                    }}>
                      <option value="">-- 🏞 เลือกจังหวัด --</option>
                      {provinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name_th}</option>
                      ))}
                    </select>
      
                    <select className="w-full border px-4 py-2 rounded-lg mb-3" value={selectedAmphure} onChange={(e) => {
                      setSelectedAmphure(e.target.value);
                      setSelectedDistrict('');
                      setZipcode('');
                    }}>
                      <option value="">-- 🏡 เลือกอำเภอ --</option>
                      {amphureOptions.map(a => (
                        <option key={a.id} value={a.id}>{a.name_th}</option>
                      ))}
                    </select>

                    <select className="w-full border px-4 py-2 rounded-lg mb-3" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                      <option value="">-- 🏘 เลือกตำบล --</option>
                      {districtOptions.map(d => (
                        <option key={d.id} value={d.id}>{d.name_th}</option>
                      ))}
                    </select>
      
                    <input
                      type="text"
                      className="w-full border px-4 py-2 rounded-lg mb-3 bg-gray-100"
                      readOnly
                      placeholder="📮 รหัสไปรษณีย์"
                      value={zipcode}
                    />

                  <button
                    onClick={() => {
                      addAddress();
                      alert("🎉 เพิ่มที่อยู่เรียบร้อยแล้ว!");
                      window.location.reload();
                    }}
                    className="mt-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
                  >
                    ✅ บันทึกที่อยู่นี้
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
  
}

export default ProfilePage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import NavUser from '../components/NavUser';

// const API_URL = 'http://localhost:3111/api/v1';

// function ProfilePage() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [showForm, setShowForm] = useState(false);

//   // ฟอร์มเพิ่มที่อยู่ใหม่
//   const [newLabel, setNewLabel] = useState('');
//   const [newName, setNewName] = useState('');
//   const [newPhone, setNewPhone] = useState('');
//   const [newAddress, setNewAddress] = useState('');

//   const fetchProfile = async () => {
//     try {
//       const res = await fetch(`${API_URL}/profile`, { credentials: 'include' });
//       const data = await res.json();
//       setProfile(data.data);
//     } catch (err) {
//       setError('ไม่สามารถโหลดโปรไฟล์ได้');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addAddress = async () => {
//     const res = await fetch(`${API_URL}/profile/addresses`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({
//         label: newLabel,
//         fullAddress: newAddress,
//         name: newName,
//         phone: newPhone
//       }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setNewLabel('');
//       setNewAddress('');
//       setNewName('');
//       setNewPhone('');
//       setRefresh(!refresh);
//     }
//   };

//   const deleteAddress = async (id) => {
//     await fetch(`${API_URL}/profile/addresses/${id}`, {
//       method: 'DELETE',
//       credentials: 'include'
//     });
//     setRefresh(!refresh);
//   };

//   const setDefault = async (id) => {
//     await fetch(`${API_URL}/profile/addresses/default/${id}`, {
//       method: 'PATCH',
//       credentials: 'include'
//     });
//     setRefresh(!refresh);
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, [refresh]);

//   if (loading) return <div className="text-center py-6 text-gray-500">⏳ กำลังโหลดข้อมูล...</div>;
//   if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

//   return (
//     <div>
//       <NavUser />
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col md:flex-row gap-6 items-start">
//             <img
//               src={profile?.profileImage || "/image/Nullprofile.png"}
//               alt="Profile"
//               className="w-24 h-24 rounded-full border"
//             />
//             <div>
//               <h2 className="text-xl font-bold">{profile?.name}</h2>
//               <p className="text-gray-600">📧 {profile?.email}</p>
//               <p className="text-gray-600">📞 {profile?.phone}</p>
//                 <div className="mt-2 flex gap-4 text-sm">
//                   {addr.isDefault && (
//                     <span className="text-green-600 font-medium border px-2 py-0.5 rounded border-green-500">ค่าเริ่มต้น</span>
//                   )}
//                   {!addr.isDefault && (
//                     <button onClick={() => setDefault(addr._id)} className="text-blue-600 hover:underline">ตั้งเป็นค่าเริ่มต้น</button>
//                   )}
//                   <button onClick={() => deleteAddress(addr._id)} className="text-red-600 hover:underline">ลบ</button>
//                 </div>
//               </div>
//             ))}

//             {showForm && (
//               <div className="mt-4">
//                 <input
//                   type="text"
//                   placeholder="ชื่อที่อยู่ เช่น บ้าน, ที่ทำงาน"
//                   value={newLabel}
//                   onChange={(e) => setNewLabel(e.target.value)}
//                   className="w-full border px-3 py-2 rounded mb-2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="ชื่อผู้รับ"
//                   value={newName}
//                   onChange={(e) => setNewName(e.target.value)}
//                   className="w-full border px-3 py-2 rounded mb-2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="เบอร์โทรผู้รับ"
//                   value={newPhone}
//                   onChange={(e) => setNewPhone(e.target.value)}
//                   className="w-full border px-3 py-2 rounded mb-2"
//                 />
//                 <textarea
//                   placeholder="รายละเอียดที่อยู่"
//                   rows={3}
//                   value={newAddress}
//                   onChange={(e) => setNewAddress(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                 />
//                 <button
//                   onClick={addAddress}
//                   className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                   ✅ บันทึกที่อยู่
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* ✅ แสดงรูปโปรไฟล์ */}
//             <div className="relative">
//               <img 
//                 src={profile?.profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>

//             {/* ✅ แสดงชื่อและอีเมล */}
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                   {profile?.name || 'ไม่ระบุ'}
//                 </h1>
//                 <Link href="/editprofile">
//                   <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
//                     Edit profile
//                   </button>
//                 </Link>
//               </div>
//               <p className="text-gray-500">📧 {profile?.email || 'ไม่ระบุอีเมล'}</p>
//               <p className="text-gray-500">📞 {profile?.phone || 'ไม่ระบุเบอร์โทร'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>

//               {/* 🔥 Profile Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
//                     <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🔥 Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
//               </div>
//             </div>
//           </div>

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดโปรไฟล์ใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* ✅ แสดงรูปโปรไฟล์ */}
//             <div className="relative">
//               <img 
//                 src={profile?.profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>

//             {/* ✅ แสดงชื่อและอีเมล */}
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                   {profile?.name || 'ไม่ระบุ'}
//                 </h1>
//                 <Link href="/editprofile">
//                   <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
//                     Edit profile
//                   </button>
//                 </Link>
//               </div>
//               <p className="text-gray-500">📧 {profile?.email || 'ไม่ระบุอีเมล'}</p>
//               <p className="text-gray-500">📞 {profile?.phone || 'ไม่ระบุเบอร์โทร'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>

//               {/* 🔥 Profile Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
//                     <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 🔥 Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
//               </div>
//             </div>
//           </div>

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           {/* <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดโปรไฟล์ใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div> */}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchProfileImage = async () => {
//       try {
//         const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//           credentials: 'include'
//         })
        
//         if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")

//         const data = await res.json()
//         setProfileImage(data.image) // ใช้ Base64 Image
//       } catch (err) {
//         console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//       }
//     }

//     fetchProfile()
//     fetchProfileImage()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             <div className="relative">
//               <img 
//                 src={profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center space-x-4">
//                 <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                   {profile?.profile?.name || 'ไม่ระบุ'}
//                 </h1>
//                 <Link href="/editprofile">
//                   <button className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 transition-all">
//                     Edit profile
//                   </button>
//                 </Link>
//               </div>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>

//               {/* Profile Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่ชนะ</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//                     <h3 className="font-semibold text-sm">การประมูลที่เข้าร่วม</h3>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <p className="text-xl font-bold text-purple-600">{profile?.listedItems || 0}</p>
//                     <h3 className="font-semibold text-sm">สินค้าที่ลงขาย</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <div className="flex-1">
//               <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{profile?.profile?.name || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div> */}
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 {/* <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p> */}
//               </div>
//             </div>
//           </div>

//           {/* <div className="mt-6">
//             <Link href="/editprofile">
//               <button 
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
//               >
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div> */}

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           {/* <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดรูปใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div> */}

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [profileImage, setProfileImage] = useState(null)
//   const [refresh, setRefresh] = useState(false) // ใช้ state แทน timestamp

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })

//         if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')

//         const data = await response.json()
//         setProfile(data.data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchProfileImage = async () => {
//       try {
//         const res = await fetch(`http://localhost:3111/api/v1/profile/image`, { 
//           credentials: 'include'
//         })
        
//         if (!res.ok) throw new Error("โหลดรูปภาพไม่สำเร็จ")

//         const data = await res.json()
//         setProfileImage(data.image) // ใช้ Base64 Image
//       } catch (err) {
//         console.error("ไม่สามารถโหลดรูปภาพโปรไฟล์ได้", err)
//       }
//     }

//     fetchProfile()
//     fetchProfileImage()
//   }, [refresh]) // ดึงข้อมูลใหม่เมื่อกดรีเฟรช

//   if (loading) return <div className="text-center py-8 text-gray-500">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <NavUser />
//       <div className="container mx-auto px-4 py-10 flex flex-col items-center">
//         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="relative">
//               <img 
//                 src={profileImage || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-300"
//               />
//             </div>
//             <div className="text-center">
//               <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{profile?.profile?.name || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-500">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 สมาชิกตั้งแต่: {profile?.profile?.createdAt ? new Date(profile.profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <Link href="/editprofile">
//               <button 
//                 className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
//               >
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div>

//           {/* 🔄 ปุ่มรีเฟรชโปรไฟล์ */}
//           <div className="mt-4 text-center">
//             <button 
//               onClick={() => setRefresh(!refresh)} // กดเพื่อโหลดรูปใหม่
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
//             >
//               รีเฟรชโปรไฟล์
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage


// 'use client'

// import React, { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3111/api/v1/profile', {
//           credentials: 'include'
//         })
        
//         if (!response.ok) {
//           throw new Error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้')
//         }

//         const data = await response.json()
//         setProfile(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [])

//   if (loading) return <div className="text-center py-8">กำลังโหลด...</div>
//   if (error) return <div className="text-center py-8 text-red-500">{error}</div>

//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* Profile Header */}
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* Profile Image */}
//             <div className="relative">
//               <img 
//                 src={profile?.image || "/image/profile1.jpg"}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-gray-200"
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">{profile?.username || 'ไม่ระบุ'}</h1>
//               <p className="text-gray-600">{profile?.email || 'ไม่ระบุ'}</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 สมาชิกตั้งแต่: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
//               </p>
//             </div>
//           </div>

//           {/* Profile Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่ชนะ</h3>
//               <p className="text-2xl font-bold text-blue-600">{profile?.wonAuctions || 0}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่เข้าร่วม</h3>
//               <p className="text-2xl font-bold text-green-600">{profile?.participatedAuctions || 0}</p>
//             </div>
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-gray-600">เบอร์โทร: {profile?.phone || 'ไม่ระบุ'}</p>
//                 <p className="text-gray-600">ที่อยู่: {profile?.address || 'ไม่ระบุ'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Edit Profile Button */}
//           <div className="mt-8">
//             <Link href="/editprofile">
//               <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//                 แก้ไขข้อมูลส่วนตัว
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

// 'use client'
// import React from 'react'
// import Navbar from '../components/Navbar'
// import Link from 'next/link'
// import NavUser from '../components/NavUser'

// function ProfilePage() {
//   return (
//     <div>
//       <NavUser/>
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-6">
//           {/* Profile Header */}
//           <div className="flex flex-col items-center md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
//             {/* Profile Image */}
//             <div className="relative">
//               <img 
//                 src="/image/profile1.jpg" 
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full border-4 border-gray-200"
//               />
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">ชื่อผู้ใช้</h1>
//               <p className="text-gray-600">example@email.com</p>
//               <p className="text-sm text-gray-500 mt-2">สมาชิกตั้งแต่: January 2024</p>
//             </div>
//           </div>

//           {/* Profile Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่ชนะ</h3>
//               <p className="text-2xl font-bold text-blue-600">0</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">การประมูลที่เข้าร่วม</h3>
//               <p className="text-2xl font-bold text-green-600">0</p>
//             </div>
//             {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
//               <h3 className="font-semibold">สินค้าที่ลงขาย</h3>
//               <p className="text-2xl font-bold text-purple-600">0</p>
//             </div> */}
//           </div>

//           {/* Personal Information */}
//           <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">ข้อมูลส่วนตัว</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 {/* <p className="text-gray-600">ชื่อ-นามสกุล: John Doe</p> */}
//                 <p className="text-gray-600">เบอร์โทร: xxx-xxx-xxxx</p>
//                 <p className="text-gray-600">ที่อยู่: xxxxxxxxx</p>
//               </div>
//             </div>
//           </div>

//           {/* Edit Profile Button */}
//           <div className="mt-8">
//             <Link href="/editprofile">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//                 แก้ไขข้อมูลส่วนตัว
//             </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage
