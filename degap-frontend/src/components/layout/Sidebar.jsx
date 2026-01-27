import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "home" },
    { name: "My Learning", path: "/my-learning", icon: "book-open" },
    { name: "Browse Courses", path: "/courses", icon: "search" },
  ];

  if (user?.role === "contributor" || user?.role === "admin") {
    links.push({ name: "My Contributions", path: "/my-contributions", icon: "pencil" });
  }

  if (user?.role === "admin") {
    links.push({ name: "Admin Panel", path: "/admin", icon: "shield-check" });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:shadow-none border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <span className="text-xl font-bold text-blue-600">Degap</span>
            <button onClick={onClose} className="text-gray-500">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
              >
                {/* Simple icon placeholder - can be replaced with real icons library */}
                <span className="mr-3">
                  {/* Icon logic or placeholder */}
                  •
                </span>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full bg-gray-300"
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name}`}
                  alt={user?.name}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
