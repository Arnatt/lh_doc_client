import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import LoginAdmin from '../pages/auth/LoginAdmin'


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