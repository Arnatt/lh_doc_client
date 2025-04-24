import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderUser from '../components/user/HeaderUser'

const LayoutUser = () => {
  return (
    <div>
        <HeaderUser />
        <main className='h-full px-4 mt-2 mx-auto'>
            <Outlet />
        </main>
    </div>
  )
}

export default LayoutUser