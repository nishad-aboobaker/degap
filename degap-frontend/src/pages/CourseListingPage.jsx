import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import courseService from "../services/course.service";
import CourseCard from "../components/courses/CourseCard";
import FilterSidebar from "../components/courses/FilterSidebar";
import Loading from "../components/common/Loading";
import { useToast } from "../hooks/useToast";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "-viewCount", label: "Most Popular" },
  { value: "-favoriteCount", label: "Most Favorited" },
  { value: "title", label: "Alphabetical (A-Z)" },
  { value: "-title", label: "Alphabetical (Z-A)" },
];

export default function CourseListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const technology = searchParams.get("technology") || "";
  const sort = searchParams.get("sort") || "-createdAt";

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAll({
        page,
        limit: 12,
        search,
        category,
        difficulty,
        technology,
        sort,
      });
      setCourses(data.data);
      setTotalPages(data.pagination.pages);
    } catch {
      setError("Failed to load courses. Please try again.");
      addToast("Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty, technology, sort, addToast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    
    // Preserve other filters but reset page
    const newParams = {
      ...Object.fromEntries(searchParams),
      search: query,
      page: 1
    };
    
    // Remove empty search
    if (!query) delete newParams.search;
    
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    // Clean up empty filters
    const cleanedFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});
    
    setSearchParams(cleanedFilters);
  };

  const handlePageChange = (newPage) => {
    const newParams = { ...Object.fromEntries(searchParams), page: newPage };
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const newParams = { ...Object.fromEntries(searchParams), sort: newSort, page: 1 };
    setSearchParams(newParams);
  };

  const activeFiltersCount = [category, difficulty, technology].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
            <p className="text-gray-600 mt-1">Discover the best learning paths for you</p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search courses..."
              className="flex-grow md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <ArrowsUpDownIcon className="h-4 w-4 text-gray-500" />
              <select
                value={sort}
                onChange={handleSortChange}
                className="text-sm border-none focus:ring-0 text-gray-700 font-medium bg-transparent cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={{ category, difficulty, technology, search, sort }}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Filter Drawer (Overlay) */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
                <FilterSidebar
                  filters={{ category, difficulty, technology, search, sort }}
                  onFilterChange={(filters) => {
                    handleFilterChange(filters);
                    // Optional: Close sidebar on selection if desired, but keeping open allows multiple selects
                  }}
                  onClose={() => setIsMobileFiltersOpen(false)}
                  className="h-full rounded-none border-none shadow-none"
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Sort & Result Count */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? "Loading..." : `Showing ${courses.length} results`}
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">Sort by:</label>
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="pl-3 pr-8 py-1.5 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                    <div className="flex items-center px-4 font-medium text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm">
                      Page {page} of {totalPages}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
