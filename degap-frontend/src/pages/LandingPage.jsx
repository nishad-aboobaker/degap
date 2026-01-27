import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Master Your Learning Path with Degap
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Create, share, and track your learning roadmaps. Connect with a community of self-learners and bridge the gap to your goals.
              </p>
              <div className="flex gap-4">
                {isAuthenticated ? (
                  <Link
                    to="/courses"
                    className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    Browse Courses
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              {/* Placeholder for Hero Image */}
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-white/20 rounded"></div>
                  <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                  <div className="h-32 bg-white/10 rounded-lg mt-6"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 w-8 rounded-full bg-white/20"></div>
                    <div className="h-4 w-1/3 bg-white/20 rounded self-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Degap?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the tools you need to structure your learning journey and stay motivated.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Structured Roadmaps</h3>
              <p className="text-gray-600">
                Follow step-by-step guides curated by experts and community members to master new skills.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Mark your progress as you go. Visualize your journey and stay motivated to reach the finish line.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Learn from others, share your own roadmaps, and contribute to the community's knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start learning?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of learners who are already achieving their goals with Degap.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
