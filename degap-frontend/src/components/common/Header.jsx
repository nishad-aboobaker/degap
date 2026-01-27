import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Degap
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-courses"
                  className="text-gray-700 hover:text-blue-600"
                >
                  My Courses
                </Link>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              to="/courses"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-courses"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Courses
                </Link>
                {user?.role === "contributor" || user?.role === "admin" ? (
                  <Link
                    to="/create-course"
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Course
                  </Link>
                ) : null}
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

