import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/public/login" replace state={{ from: location.pathname }} />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
