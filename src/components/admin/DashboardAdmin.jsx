import React from 'react'

const DashboardAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
          <p className="text-gray-600">ยินดีต้อนรับ เจ้าหน้าที่</p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">คำร้องรอดำเนินการ</h2>
            <p className="text-4xl text-blue-600 mt-2">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">คำร้องทั้งหมด</h2>
            <p className="text-4xl text-green-600 mt-2">125</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold text-gray-800">ผู้ใช้ทั้งหมด</h2>
            <p className="text-4xl text-purple-600 mt-2">42</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin