import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user?.name}!</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h3 className="font-semibold text-blue-900 mb-2">Profile Information</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                                    <p><span className="font-medium">Role:</span> {user?.role}</p>
                                    <p>
                                        <span className="font-medium">Email Verified:</span>{" "}
                                        {user?.emailVerified ? (
                                            <span className="text-green-600">✓ Verified</span>
                                        ) : (
                                            <span className="text-red-600">✗ Not Verified</span>
                                        )}
                                    </p>
                                    <p><span className="font-medium">Member Since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-6">
                                <h3 className="font-semibold text-green-900 mb-2">Quick Stats</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Courses Started:</span> 0</p>
                                    <p><span className="font-medium">Courses Completed:</span> 0</p>
                                    <p><span className="font-medium">Learning Streak:</span> 0 days</p>
                                </div>
                            </div>
                        </div>

                        {!user?.emailVerified && (
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Please verify your email address to access all features.
                                    Check your inbox for the verification link.
                                </p>
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-4xl mb-2">📚</div>
                                    <h4 className="font-medium text-gray-900">Browse Courses</h4>
                                    <p className="text-sm text-gray-600 mt-1">Explore learning roadmaps</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-4xl mb-2">✏️</div>
                                    <h4 className="font-medium text-gray-900">Create Course</h4>
                                    <p className="text-sm text-gray-600 mt-1">Share your knowledge</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center">
                                    <div className="text-4xl mb-2">📊</div>
                                    <h4 className="font-medium text-gray-900">Track Progress</h4>
                                    <p className="text-sm text-gray-600 mt-1">Monitor your learning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
