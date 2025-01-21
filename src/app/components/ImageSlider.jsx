'use client';

import React, { useState, useEffect } from 'react';
import Frame1 from '../images/1.jpg';
import Frame2 from '../images/2.jpg';
import Frame3 from '../images/3.jpg';

const images = [Frame1, Frame2, Frame3];

const Slideimage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop back to first image
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      setCurrentIndex(images.length - 2); // กลับไปที่ภาพสุดท้ายเมื่อถึงภาพแรก
    }
  };

  const nextSlide = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0); // กลับไปที่ภาพแรกเมื่อถึงภาพสุดท้าย
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      {/* Slide container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 50}%)`, // Show 2 images at a time (50%)
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`Slide ${index}`}
            className="w-1/2 h-auto flex-shrink-0 px-2 rounded-2xl p-2"
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-yellow-400 px-4 py-2"
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
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-yellow-400 px-4 py-2"
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
  );
};

export default Slideimage;

//V4
// 'use client';

// import React, { useState } from 'react';
// import Frame1 from '../images/1.jpg';
// import Frame2 from '../images/2.jpg';
// import Frame3 from '../images/3.jpg';

// const images = [
//     Frame1,
//     Frame2,
//     Frame3,
// ,
// ];

// const Slideimage = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
//   };

//   return (
//     <div className="relative w-full max-w-4xl mx-auto overflow-hidden ">
//       <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 50}%)` }}>
//         {images.map((image, index) => (
//           <img key={index} src={image.src} alt={`Slide ${index}`} className="w-1/2 h-auto flex-shrink-0 px-2 rounded-2xl p-2" />
//         ))}
//       </div>
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 text-yellow-400 px-4 py-2"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
//           <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
//         </svg>

//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-[-1rem] transform -translate-y-1/2 text-yellow-400 px-4 py-2 "
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 ">
//           <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
//         </svg>

//       </button>
//     </div>
//   );
// };

// export default Slideimage;

// V3
// 'use client';
// import { useState, useEffect } from 'react';

// export default function ImageSlider({ images }) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 5000); // ปรับเวลาเป็น 5000ms (5 วินาที)
//     return () => clearInterval(interval);
//   }, [images.length]);

//   return (
//     <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
//       {images.map((image, index) => (
//         <img
//           key={index}
//           src={image.src}
//           alt={image.alt || `Slide ${index + 1}`}
//           style={{
//             display: index === currentIndex ? "block" : "none",
//             width: "800px", 
//             height: "400px", 
//             objectFit: "cover", 
//             margin: "0 auto",
//           }}
//         />
//       ))}
//       <button
//         onClick={prevSlide}
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "20px",
//           transform: "translateY(-50%)",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           color: "#fff",
//           border: "none",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           cursor: "pointer",
//         }}
//       >
//         ‹
//       </button>
//       <button
//         onClick={nextSlide}
//         style={{
//           position: "absolute",
//           top: "50%",
//           right: "20px",
//           transform: "translateY(-50%)",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           color: "#fff",
//           border: "none",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           cursor: "pointer",
//         }}
//       >
//         ›
//       </button>
//       <div
//         style={{
//           position: "absolute",
//           bottom: "10px",
//           left: "50%",
//           transform: "translateX(-50%)",
//         }}
//       >
//         {images.map((_, index) => (
//           <span
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             style={{
//               cursor: "pointer",
//               margin: "0 5px",
//               fontSize: "20px",
//               color: currentIndex === index ? "#000" : "#ccc",
//             }}
//           >
//             •
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }


// // V2
// 'use client';
// import { useState, useEffect } from 'react';

// export default function ImageSlider({ images }) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 3000);
//     return () => clearInterval(interval);
//   }, [images.length]);

//   return (
//     <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
//       {images.map((image, index) => (
//         <img
//           key={index}
//           src={image.src}
//           alt={image.alt || `Slide ${index + 1}`}
//           style={{
//             display: index === currentIndex ? "block" : "none",
//             width: "800px", // กำหนดขนาดรูป
//             height: "400px", // กำหนดขนาดรูป
//             objectFit: "cover", // ครอบภาพให้เต็ม
//             margin: "0 auto", // จัดให้อยู่ตรงกลาง
//           }}
//         />
//       ))}
//       <button
//         onClick={prevSlide}
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "20px",
//           transform: "translateY(-50%)",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           color: "#fff",
//           border: "none",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           cursor: "pointer",
//         }}
//       >
//         ‹
//       </button>
//       <button
//         onClick={nextSlide}
//         style={{
//           position: "absolute",
//           top: "50%",
//           right: "20px",
//           transform: "translateY(-50%)",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           color: "#fff",
//           border: "none",
//           borderRadius: "50%",
//           width: "40px",
//           height: "40px",
//           cursor: "pointer",
//         }}
//       >
//         ›
//       </button>
//       <div
//         style={{
//           position: "absolute",
//           bottom: "10px",
//           left: "50%",
//           transform: "translateX(-50%)",
//         }}
//       >
//         {images.map((_, index) => (
//           <span
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             style={{
//               cursor: "pointer",
//               margin: "0 5px",
//               fontSize: "20px",
//               color: currentIndex === index ? "#000" : "#ccc",
//             }}
//           >
//             •
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }


// V1
// 'use client';
// import { useState, useEffect } from 'react';

// export default function ImageSlider({ images }) {
//     const [currentIndex, setCurrentIndex] = useState(0);
  
//     useEffect(() => {
//       const interval = setInterval(() => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//       }, 3000);
//       return () => clearInterval(interval);
//     }, [images.length]);
  
//     return (
//       <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
//         {images.map((image, index) => (
//           <img
//             key={index}
//             src={image.src}
//             alt={image.alt || `Slide ${index + 1}`}
//             style={{
//               display: index === currentIndex ? "block" : "none",
//               width: "800px", // กำหนดขนาดรูป
//               height: "400px", // กำหนดขนาดรูป
//               objectFit: "cover", // ครอบภาพให้เต็ม
//               margin: "0 auto", // จัดให้อยู่ตรงกลาง
//             }}
//           />
//         ))}
//         <div
//           style={{
//             position: "absolute",
//             bottom: "10px",
//             left: "50%",
//             transform: "translateX(-50%)",
//           }}
//         >
//           {images.map((_, index) => (
//             <span
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               style={{
//                 cursor: "pointer",
//                 margin: "0 5px",
//                 fontSize: "20px",
//                 color: currentIndex === index ? "#000" : "#ccc",
//               }}
//             >
//               •
//             </span>
//           ))}
//         </div>
//       </div>
//     );
//   }
  