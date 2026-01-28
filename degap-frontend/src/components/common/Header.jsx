import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isCourses = location.pathname.startsWith("/courses");
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="bg-white/90 backdrop-blur border-b sticky top-0 z-30">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            Degap
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`transition-colors ${
                  isDashboard
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/courses"
              className={`transition-colors ${
                isCourses
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Courses
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={logout}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-900 text-xs font-semibold text-white"
                title={user?.name}
              >
                {getInitials(user?.name) || "U"}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white text-xs font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
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
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-b bg-white/95 backdrop-blur px-4 pb-4 space-y-3">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="block text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/courses"
            className="block text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(false)}
          >
            Courses
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {getInitials(user?.name) || "U"}
                </span>
                <span className="truncate max-w-[140px]">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-3 pt-2 text-sm">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-900 hover:text-white text-xs font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

