'use client'

import React from 'react'
import Navbar from '../components/Navbar';
import NavUser from '../components/NavUser';
import ImageSlider from '../components/ImageSlider';
// import Product from '../products/page';
import Productuser from '../components/Productuser';
import { useSession } from 'next-auth/react';
import Contact from '../components/Contact';
import NavContact from '../components/NavContact';

function HomeUserpage() {
    const {data: session} = useSession()
    console.log(session);

// const images = [
//     { src: "/image/1.jpg" },
//     { src: "/image/2.jpg" },
//     { src: "/image/3.jpg" },
//   ]
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
      <NavUser session={session}/>
      
        <div className="flex-grow container mx-auto px-4">
            {/* <h3 className='text-2xl my-3'>หมวดหมู่สินค้า</h3> */}
            <ImageSlider/>
        </div>
        <div className='container mx-auto px-4 mb-16'>
            <Productuser/>
        </div>
        <div className="mt-auto">
            <NavContact/>
        </div>
    </div>
  )
}

export default HomeUserpage


// 'use client'

// import React from 'react'
// import Navbar from '../components/Navbar';
// import NavUser from '../components/NavUser';
// import ImageSlider from '../components/ImageSlider';
// // import Product from '../products/page';
// import Productuser from '../components/Productuser';
// import { useSession } from 'next-auth/react';
// import Contact from '../components/Contact';
// import NavContact from '../components/NavContact';

// function HomeUserpage() {
//     const {data: session} = useSession()
//     console.log(session);

// // const images = [
// //     { src: "/image/1.jpg" },
// //     { src: "/image/2.jpg" },
// //     { src: "/image/3.jpg" },
// //   ]
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">
//       <NavUser session={session}/>
      
//         <div className='container mx-auto px-4'>
//             {/* <h3 className='text-2xl my-3'>หมวดหมู่สินค้า</h3> */}
//             <ImageSlider/>
//         </div>
//         <div className='container mx-auto px-4 mb-16'>
//             <Productuser/>
//         </div>
//         <NavContact/>
//     </div>
//   )
// }

// export default HomeUserpage
