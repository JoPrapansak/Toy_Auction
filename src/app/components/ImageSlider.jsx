'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Frame1 from '../images/1.jpg';
import Frame2 from '../images/2.jpg';
import Frame3 from '../images/3.jpg';
// import Frame4 from '../images/Gunpla Models.jpg';

const images = [Frame1, Frame2, Frame3];

const Slideimage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleImageClick = () => {
    router.push('/category');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // เมื่อถึงรูปสุดท้าย วนกลับไปรูปแรก
        const maxIndex = images.length - 2; // -2 เพราะแสดง 2 รูปพร้อมกัน
        if (prevIndex >= maxIndex) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = images.length - 2;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  return (
    <div className="container mx-auto px-4">
      <h3 className="text-2xl my-3" style={{ fontFamily: "'Mali',sans-serif" }}>หมวดหมู่สินค้า</h3>

      <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 50}%)`,
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Slide ${index}`}
              className="w-1/2 h-auto flex-shrink-0 px-2 rounded-2xl p-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleImageClick}
            />
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slideimage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Image1 from '../images/Gunpla Models.jpg';
// // import Image2 from '@/public/images/2.jpg';
// // import Image3 from '@/public/images/3.jpg';

// const images = [
//   { src: Image1, caption: "Gunpla" },
//   // { src: Image2, caption: "Figure Nendoroid" },
//   // { src: Image3, caption: "Art Toy" }
// ];

// const Slideimage = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       (prevIndex + 1) % images.length
//     );
//   };

//   return (
//     <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
//       {/* Slide container */}
//       <div
//         className="flex transition-transform duration-500 ease-in-out"
//         style={{
//           transform: `translateX(-${currentIndex * 50}%)`, // Show 2 images at a time (50%)
//         }}
//       >
//         {images.map((image, index) => (
//           <div key={index} className="w-1/2 flex-shrink-0 px-2">
//             <div className="relative rounded-2xl p-2">
//               <Image
//                 src={image.src}
//                 alt={image.caption}
//                 width={500}
//                 height={300}
//                 className="w-full h-auto rounded-2xl"
//                 priority={index === 0}
//                 quality={100}
//               />
//               <div className="text-center mt-2 text-gray-700 font-medium">
//                 {image.caption}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Previous Button */}
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="size-10"
//         >
//           <path
//             fillRule="evenodd"
//             d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>

//       {/* Next Button */}
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           className="size-10"
//         >
//           <path
//             fillRule="evenodd"
//             d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default Slideimage;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Frame1 from '../images/1.jpg';
// import Frame2 from '../images/2.jpg';
// import Frame3 from '../images/3.jpg';
// // import Frame4 from '../images/Gunpla Models.jpg';

// const images = [Frame1, Frame2, Frame3];

// const Slideimage = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => {
//         // เมื่อถึงรูปสุดท้าย วนกลับไปรูปแรก
//         const maxIndex = images.length - 2; // -2 เพราะแสดง 2 รูปพร้อมกัน
//         if (prevIndex >= maxIndex) {
//           return 0;
//         }
//         return prevIndex + 1;
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => {
//       const maxIndex = images.length - 2;
//       return prevIndex >= maxIndex ? 0 : prevIndex + 1;
//     });
//   };

//   return (
//     <div className="container mx-auto px-4">
//     <h3 className="text-2xl my-3"style={{ fontFamily: "'Mali',sans-serif"}}>หมวดหมู่สินค้า</h3>

//       <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
//         {/* Slide container */}
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{
//             transform: `translateX(-${currentIndex * 50}%)`, // Show 2 images at a time (50%)
//           }}
//         >
//           {images.map((image, index) => (
//             <img
//               key={index}
//               src={image.src}
//               alt={`Slide ${index}`}
//               className="w-1/2 h-auto flex-shrink-0 px-2 rounded-2xl p-2"
//             />
//           ))}
//         </div>

//         {/* Previous Button */}
//         <button
//           onClick={prevSlide}
//           className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="size-10"
//           >
//             <path
//               fillRule="evenodd"
//               d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>

//         {/* Next Button */}
//         <button
//           onClick={nextSlide}
//           className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400 px-4 py-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="size-10"
//           >
//             <path
//               fillRule="evenodd"
//               d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Slideimage;