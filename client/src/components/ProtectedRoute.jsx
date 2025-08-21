import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, allowedRole, children }) {
  if (!role) return <Navigate to="/login" />;
  if (role !== allowedRole) return <p>Access Denied</p>;
  return children;
}

