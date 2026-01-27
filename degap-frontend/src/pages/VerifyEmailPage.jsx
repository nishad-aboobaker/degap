import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                setStatus("success");
                setMessage(response.data.message);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err) {
                setStatus("error");
                setMessage(err.response?.data?.error?.message || "Email verification failed");
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                {status === "verifying" && (
                    <>
                        <div className="mb-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
                        <p className="text-gray-600">Please wait while we verify your email address.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to login page...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
