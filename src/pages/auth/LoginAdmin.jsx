import React from 'react'

const LoginAdmin = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-8">LOGIN ADMIN</h2>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginAdmin