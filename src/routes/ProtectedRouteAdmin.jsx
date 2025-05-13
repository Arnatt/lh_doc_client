import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useRequestStore from '../store/request-store';

const ProtectedRouteAdmin = () => {
  const { token, isAdmin, fetchCurrentAdmin, loading } = useRequestStore();

  useEffect(() => {
    if (token) {
      fetchCurrentAdmin();
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // หรือ spinner
  }

  if (!token || !isAdmin) {
    return <Navigate to="/login-admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;