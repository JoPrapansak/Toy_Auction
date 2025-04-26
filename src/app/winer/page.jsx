'use client';

import React, { useState, useEffect } from 'react';
import NavContact from '../components/NavContact';
import Navbar from '../components/Navbar';

const API_URL = "http://localhost:3111/api/v1";

function WinnerPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAuctions();

    // ✅ อัปเดตข้อมูลอัตโนมัติทุก 10 วินาที
    const interval = setInterval(fetchAuctions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`${API_URL}/auction/closed-auctions`, { credentials: 'include' });
      const data = await response.json();
      if (data.status === 'success') {
        setAuctions(data.data);
      } else {
        setError('❌ ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      setError('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* <div className="flex justify-between items-center"> */}
          <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600 drop-shadow-md"style={{ fontFamily: "'Mali',sans-serif" }}>
            🏆 ประกาศผู้ชนะและผู้บิดสูงสุด 🏆
          </h1>
          {/* <button
            onClick={fetchAuctions}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            🔄 {refreshing ? "กำลังรีเฟรช..." : "รีเฟรช"}
          </button> */}
        {/* </div> */}

        {loading ? (
          <div className="text-center text-gray-600 animate-pulse text-lg mt-6">⏳ กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg mt-6">{error}</div>
        ) : auctions.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-6">❌ ไม่มีการประมูลที่สิ้นสุดในขณะนี้</div>
        ) : (
          <>
            {/* 🔴 การประมูลที่สิ้นสุดแล้ว */}
            <h2 className="text-2xl font-semibold text-red-500 mt-8">📌 การประมูลที่จบแล้ว</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {auctions.map((auction) => (
                <div key={auction._id} className="bg-white p-5 rounded-lg shadow-xl border border-red-400 hover:scale-105 transition transform duration-300">
                  <div className="relative">
                    <img 
                      src={auction.image && auction.image.length > 0 ? auction.image[0] : '/default-image.jpg'}
                      alt={auction.name}
                      className="w-full h-48 object-cover rounded-md shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-bold mt-3 text-gray-800">{auction.name}</h3>
                  <p className="text-gray-600 mt-1">
                    🎉 ผู้ชนะ: 
                    <span className={`font-bold ${auction.highestBidderName ? "text-green-600" : "text-red-500"}`}>
                      {auction.highestBidderName || "❌ ไม่มีข้อมูล"}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    💰 ราคาสุดท้าย: <span className="font-bold">{auction.winningBid || "❌ ไม่พบราคา"} บาท</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    📅 ปิดประมูลเมื่อ: 
                    <span className="font-medium">
                      {auction.expiresAt ? new Date(auction.expiresAt).toLocaleString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "❌ ไม่พบข้อมูล"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <NavContact />
    </div>
  );
}

export default WinnerPage;
