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
import DetailRequest from '../pages/user/DetailRequest'
import HomeUser from '../pages/user/HomeUser'
import CheckRequest from '../pages/user/CheckRequest'
import EditRequest from '../pages/admin/EditRequest'
import ProtectedRouteAdmin from './ProtectedRouteAdmin'
import ProtectedRouteUser from './ProtectedRouteUser'


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
    element: <ProtectedRouteUser />,
    children: [
      {
        element: <LayoutUser />,
        children: [
          { index: true, element: <HomeUser /> },
          { path: 'form-request', element: <Request /> },
          { path: 'detail-request', element: <DetailRequest /> },
          { path: 'check-request', element: <CheckRequest /> }
        ]
      }
    ]

  },

  {
    path: '/admin',
    element: <ProtectedRouteAdmin />, // ครอบ layout ที่ต้องการป้องกัน
    children: [
      {
        element: <LayoutAdmin />, // Layout นี้จะโหลดหลังผ่าน ProtectedRouteAdmin แล้ว
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'requests', element: <ManageRequest /> },
          { path: 'request/:id', element: <EditRequest /> },
        ]
      }
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