import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
