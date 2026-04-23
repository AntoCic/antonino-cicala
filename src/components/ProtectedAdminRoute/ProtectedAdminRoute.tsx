import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../db/auth/useAuth';

const ProtectedAdminRoute = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const isAdmin =
    userProfile?.permissions?.includes('ADMIN') ||
    userProfile?.permissions?.includes('SUPERADMIN');

  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedAdminRoute;
