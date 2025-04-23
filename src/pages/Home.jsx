import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate()

    const handleLoginClick = () => {
        navigate('/login')
      }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <button 
      onClick={handleLoginClick}
      className="bg-blue-600 text-white text-xl px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition">
        เข้าสู่ระบบด้วย ThaiID
      </button>
    </div>
  )
}

export default Home