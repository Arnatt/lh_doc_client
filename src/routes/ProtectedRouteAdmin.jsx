import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useRequestStore from '../store/request-store';

const ProtectedRouteAdmin = () => {
  const { adminToken, isAdmin, fetchCurrentAdmin, loading } = useRequestStore();

  useEffect(() => {
    if (adminToken) {
      fetchCurrentAdmin();
    }
  }, [adminToken]);

  if (loading) {
    return <div>Loading...</div>; // หรือ spinner
  }

  if (!adminToken || !isAdmin) {
    return <Navigate to="/login-admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;