import React from 'react'
import { Link } from 'react-router-dom'

const MainNav = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
    {/* Logo */}
    <Link to="/home" className="text-2xl font-bold text-blue-600">
      ขอประวัติการรักษาออนไลน์
    </Link>

    {/* Login button */}
    <Link
      to="/login-admin"
      className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
    >
      ลงชื่อเจ้าหน้าที่
    </Link>
  </nav>
  )
}

export default MainNav