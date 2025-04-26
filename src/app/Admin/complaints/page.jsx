'use client'

import React from 'react'
import NavAdmin from '../../components/NavAdmin'

export default function ComplaintsPage() {
  return (
    <div>
      {/* <NavAdmin /> */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">จัดการคำร้องเรียน</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <input
              type="search"
              placeholder="ค้นหาคำร้องเรียน..."
              className="p-2 border rounded-lg w-64"
            />
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ร้องเรียน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หัวข้อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add complaint rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}