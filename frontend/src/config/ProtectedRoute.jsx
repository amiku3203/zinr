import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { token, user } = useSelector((state) => state.auth);

  // If not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → show child route
  return <Outlet />;
}
