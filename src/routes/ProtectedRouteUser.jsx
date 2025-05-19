import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useRequestStore from '../store/request-store'

const ProtectedRouteUser = () => {
    const userToken = useRequestStore((state) => state.userToken)

    if (!userToken) {
        return <Navigate to="/login" replace /> 
    }
  return <Outlet />
}

export default ProtectedRouteUser