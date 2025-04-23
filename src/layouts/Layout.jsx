import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const Layout = () => {
  return (
    <>
      <MainNav />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  )
}

export default Layout