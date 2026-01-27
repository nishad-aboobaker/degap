import ProtectedRoute from "./ProtectedRoute";

export default function AdminRoute({ children }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}
