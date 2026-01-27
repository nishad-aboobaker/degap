import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Degap
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "contributor" || user?.role === "admin" ? (
                  <Link
                    to="/create-course"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Create Course
                  </Link>
                ) : null}
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

