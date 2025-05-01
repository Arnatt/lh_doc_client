import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useRequestStore from '../store/request-store'

const ProtectedRouteAdmin = () => {
  const isAdmin = useRequestStore((state) => state.isAdmin)
  const token = useRequestStore((state) => state.token)

  console.log("ProtectedRouteAdmin: token", token);
  console.log("ProtectedRouteAdmin: isAdmin", isAdmin);

  if (!token || !isAdmin) {
    return <Navigate to="/login-admin" replace />

  }
  return <Outlet />
}

export default ProtectedRouteAdmin