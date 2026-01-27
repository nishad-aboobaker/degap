import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courseService from "../services/course.service";
import Loading from "../components/common/Loading";
import { useToast } from "../hooks/useToast";

export default function MyCoursesPage() {
  const [myCourses, setMyCourses] = useState([]);
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [myCoursesRes, favoritesRes] = await Promise.all([
          courseService.getMyCourses(),
          courseService.getMyFavorites(),
        ]);

        if (!isMounted) return;

        setMyCourses(myCoursesRes.data || []);
        setFavoriteCourses(favoritesRes.data || []);
      } catch (error) {
        console.error(error);
        addToast("Failed to load your courses", "error");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [addToast]);

  if (loading) {
    return <Loading />;
  }

  const coursesToRender = activeTab === "created" ? myCourses : favoriteCourses;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage the courses you created and the ones you favorited.
            </p>
          </div>
          <Link
            to="/create-course"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Course
          </Link>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab("created")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === "created"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Created ({myCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === "favorites"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Favorites ({favoriteCourses.length})
            </button>
          </nav>
        </div>

        {coursesToRender.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              {activeTab === "created"
                ? "You haven't created any courses yet."
                : "You don't have any favorite courses yet."}
            </p>
            {activeTab === "created" ? (
              <Link
                to="/create-course"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Create your first course
              </Link>
            ) : (
              <Link
                to="/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse courses
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {coursesToRender.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors flex flex-col"
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-40 w-full rounded-t-lg bg-blue-50 flex items-center justify-center text-blue-200 text-4xl font-bold">
                    {course.title?.charAt(0) || "C"}
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{course.category}</span>
                    <span className="capitalize">{course.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

