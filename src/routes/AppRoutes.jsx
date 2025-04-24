import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import LoginAdmin from '../pages/auth/LoginAdmin'
import LayoutAdmin from '../layouts/LayoutAdmin'
import Dashboard from '../pages/admin/Dashboard'
import ManageRequest from '../pages/admin/ManageRequest'
import LayoutUser from '../layouts/LayoutUser'
import Request from '../pages/user/Request'


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },       // http://localhost:5173/
          { path: 'home', element: <Home /> },      // http://localhost:5173/home
          { path: 'login', element: <Login /> },
          { path: 'login-admin', element: <LoginAdmin /> }
        ]
    },

    {
      path: '/user',
      element: <LayoutUser />,
      children: [
        { path: 'form-request', element: <Request /> },
      ]
    },
    
    {
      path: '/admin',
      element: <LayoutAdmin />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'manage-request', element: <ManageRequest /> }
      ]
    }
])



const AppRoutes = () => {
  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default AppRoutes