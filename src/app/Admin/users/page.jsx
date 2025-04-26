'use client'

import React, { useState, useEffect } from 'react'

const API_URL = "http://localhost:3111/api/v1/admin"

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`)
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/users/${id}`,{
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setUsers(users.filter((user) => user.id !== id));
      alert("✅ ลบผู้ใช้สำเร็จ");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("❌ ลบผู้ใช้ไม่สำเร็จ");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้งาน</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <input
            type="search"
            placeholder="ค้นหาผู้ใช้..."
            className="p-2 border rounded-lg w-64"
          />
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ใช้</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สมัคร</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.status}</td>
                <td className="px-6 py-4">{user.registeredAt}</td>
                <td className="px-6 py-4">
                  {/* <button className="text-blue-500 border border-blue-500 px-2 py-1 rounded">
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 border border-red-500 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}