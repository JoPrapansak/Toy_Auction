"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NavUser from "../components/NavUser";

const API_URL = "http://localhost:3111/api/v1";

const categories = [
  { key: "designer_toys", name: "Designer Toys" },
  { key: "vinyl_figures", name: "Vinyl Figures" },
  { key: "resin_figures", name: "Resin Figures" },
  { key: "blind_box", name: "Blind Box Toys" },
  { key: "anime_figures", name: "Anime Figures" },
  { key: "movie_game_collectibles", name: "Movie & Game Collectibles" },
  { key: "robot_mecha", name: "Robot & Mecha Toys" },
  { key: "soft_vinyl", name: "Soft Vinyl (Sofubi)" },
  { key: "kaiju_monsters", name: "Kaiju & Monsters" },
  { key: "diy_custom", name: "DIY & Custom Toys" },
  { key: "retro_vintage", name: "Retro & Vintage Toys" },
  { key: "limited_edition", name: "Limited Edition & Exclusive" },
  { key: "gunpla_models", name: "Gunpla & Mecha Models" },
  { key: "plastic_models", name: "Plastic Model Kits" }
];

export default function CategoriesPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryKey = searchParams.get("category");
  const category = categories.find(c => c.key === categoryKey);

  useEffect(() => {
    if (!categoryKey) return;
    
    async function fetchAuctions() {
      try {
        const res = await fetch(`${API_URL}/auction/search?category=${categoryKey}`);
        const data = await res.json();
        setAuctions(data.data || []);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAuctions();
  }, [categoryKey]);

  if (loading) return <p className="text-center text-lg animate-pulse font-mali">⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4fc79] via-[#ffffff] to-[#a18cd1] text-gray-800 font-mali">
      <NavUser />
      <div className="container mx-auto px-6 py-10">
        {category ? (
          <>
            <h1 className="text-4xl font-bold text-center mb-12 text-[#FF6B6B] drop-shadow-lg">{category.name}</h1>
            {auctions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {auctions.map((auction) => (
                  <Link key={auction._id} href={`/productdetails/${auction._id}`} className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105">
                    <img src={auction.image?.[0] || "/default-image.jpg"} alt={auction.name} className="w-full h-40 object-cover" />
                    <div className="p-4 text-center">
                      <p className="text-lg font-semibold text-[#374151]">{auction.name}</p>
                      <p className="text-gray-500 text-sm mt-1">💰 ราคา: {auction.currentPrice} บาท</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic mt-6 text-center">❌ ไม่มีสินค้าในหมวดหมู่นี้</p>
            )}
          </>
        ) : (
          <h1 className="text-4xl font-bold text-center mb-12 text-[#FF6B6B] drop-shadow-lg">เลือกหมวดหมู่เพื่อดูสินค้า</h1>
        )}
      </div>
    </div>
  );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import NavUser from "../components/NavUser"; // ✅ ใช้ NavUser ที่แก้ไขแล้ว

// const API_URL = "http://localhost:3111/api/v1";

// const categories = [
//   { key: "designer_toys", name: "Designer Toys" },
//   { key: "vinyl_figures", name: "Vinyl Figures" },
//   { key: "resin_figures", name: "Resin Figures" },
//   { key: "blind_box", name: "Blind Box Toys" },
//   { key: "anime_figures", name: "Anime Figures" },
//   { key: "movie_game_collectibles", name: "Movie & Game Collectibles" },
//   { key: "robot_mecha", name: "Robot & Mecha Toys" },
// ];

// export default function CategoriesPage() {
//   const [auctions, setAuctions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchAuctions() {
//       const fetchedAuctions = {};
//       for (const category of categories) {
//         const res = await fetch(`${API_URL}/auction/search?category=${category.key}`);
//         const data = await res.json();
//         fetchedAuctions[category.key] = data.data || [];
//       }
//       setAuctions(fetchedAuctions);
//       setLoading(false);
//     }
//     fetchAuctions();
//   }, []);

//   if (loading) return <p className="text-center text-lg">⏳ กำลังโหลดข้อมูล...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">หมวดหมู่สินค้า</h1>
//         {categories.map((category) => (
//           <div key={category.key} className="mb-8">
//             <h2 className="text-xl font-semibold">{category.name}</h2>
//             {auctions[category.key] && auctions[category.key].length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
//                 {auctions[category.key].map((auction) => (
//                   <Link key={auction._id} href={`/productdetails/${auction._id}`} className="border p-4 rounded-lg hover:shadow-lg transition bg-white">
//                     <img src={auction.image?.[0] || "/default-image.jpg"} alt={auction.name} className="w-full h-80 object-cover rounded" />
//                     <p className="text-md mt-2 font-medium">{auction.name}</p>
//                     <div className="flex justify-between">
//                       <p className="text-md text-gray-600">ราคา: {auction.currentPrice} บาท</p>
//                       <p className="text-md text-red-500 font-semibold">เวลา</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 italic mt-2">ไม่มีสินค้าในหมวดหมู่นี้</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }