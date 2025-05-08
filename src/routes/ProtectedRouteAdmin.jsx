import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useRequestStore from '../store/request-store'

const ProtectedRouteAdmin = () => {
  const {
    token,
    isAdmin,
    currentAdmin,
    fetchCurrentAdmin,
    loading,
  } = useRequestStore();

  // ดึงข้อมูล admin เมื่อมี token แต่ currentAdmin ยังไม่มี
  useEffect(() => {
    if (token && !currentAdmin) {
      fetchCurrentAdmin();
    }
  }, [token, currentAdmin, fetchCurrentAdmin]);

  if (loading) {
    return <div>Loading...</div>; // Spinner หรือ Skeleton ก็ได้
  }

  if (!token || !isAdmin || !currentAdmin) {
    return <Navigate to="/login-admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;