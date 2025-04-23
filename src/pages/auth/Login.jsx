import React from 'react'

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-6">สแกน QR Code เพื่อเข้าสู่ระบบ</h1>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=login-thaiid"
          alt="QR Code"
          className="mx-auto"
        />
      </div>
    </div>
  )
}

export default Login