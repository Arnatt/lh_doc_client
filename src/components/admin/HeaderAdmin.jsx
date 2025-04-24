import React, { useState } from 'react'

const HeaderAdmin = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const adminName = 'Admin Test'

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen)
      }

  return (
    <header className='bg-white h-16 flex items-center justify-between px-6 border-b relative'>
        <div className='ml-auto relative'>
            <button 
                onClick={toggleDropdown}
                className='text-lg font-semibold hover:underline'
            >
                {adminName}
            </button>

            {dropdownOpen && (
          <div className='absolute top-12 left-0 w-40 bg-white shadow-lg border rounded z-10'>
            <button className='w-full text-left px-4 py-2 hover:bg-gray-100'>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default HeaderAdmin