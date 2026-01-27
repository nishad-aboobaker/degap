import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ children, requireAdmin = false, requireContributor = false }) {
  const { user, loading, isAuthenticated, isAdmin, isContributor } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireContributor && !isContributor) {
    return <Navigate to="/" replace />;
  }

  return children;
}

