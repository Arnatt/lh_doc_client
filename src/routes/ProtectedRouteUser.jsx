import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useRequestStore from '../store/request-store'

const ProtectedRouteUser = () => {
    const token = useRequestStore((state) => state.token)

    if (!token) {
        return <Navigate to="/login" replace /> 
    }
  return <Outlet />
}

export default ProtectedRouteUser