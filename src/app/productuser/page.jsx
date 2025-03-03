'use client';

import React from 'react'
import Navbar from '../components/Navbar';
// import Product from '../products/page';
import Product from '../components/Productuser'
import NavUser from '../components/NavUser';
import NavContact from '../components/NavContact';

// const products = [
//     { id: 1, name: 'Bandai กันพลา กันดั้ม RG 1/144 GUNDAM EXIA', image: '/image/Product1.png', price: 1200},
//     { id: 2, name: 'โมเดลฟิเกอร์ PVC ONE PUNCH-MAN Bald Saitama', image: '/image/Product2.jpg', price: 950},
//     { id: 3, name: 'ตุ๊กตาคาปิบาร่า ขี้เซา', image: '/image/Product3.jpg', price: 450},
//     { id: 4, name: 'Joker นั่ง Mafex Action Figure ทีมฆ่าตัวตาย Joker Supervillain', image: '/image/Product4.jpg', price: 800},
// ]

function productuser() {
  return (
    <div>
      <NavUser/>
      <Product/>
      <NavContact/>
    </div>
  )
}

export default productuser
