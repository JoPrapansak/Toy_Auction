'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavAdmin from '../components/NavAdmin'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/Admin/dashboard')
  }, [router])

  return 
}

// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'

// export default function AdminPage() {
//   const router = useRouter()

//   useEffect(() => {
//     router.push('/Admin')
//   }, [router])

//   return null
// }

// import React from 'react'
// import NavAdmin from '../components/NavAdmin'

// function page() {
//   return (
//     <div>
//       <NavAdmin />
//     </div>
//   )
// }

// export default page

