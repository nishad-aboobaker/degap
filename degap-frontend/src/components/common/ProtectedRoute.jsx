import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loading from "./Loading";

export default function ProtectedRoute({ children, requireAdmin = false, requireContributor = false }) {
  const { loading, isAuthenticated, isAdmin, isContributor } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireContributor && !isContributor) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
