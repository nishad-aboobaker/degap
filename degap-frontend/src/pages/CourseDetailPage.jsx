import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import courseService from "../services/course.service";
import progressService from "../services/progress.service";
import favoriteService from "../services/favorite.service";
import Loading from "../components/common/Loading";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import RoadmapViewer from "../components/roadmap/RoadmapViewer";
import { 
  HeartIcon as HeartOutline, 
  ShareIcon, 
  PlayIcon,
  ArrowRightIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = [courseService.getById(id)];
      if (isAuthenticated) {
        promises.push(progressService.getByCourseId(id).catch(() => ({ data: null })));
      }

      const [courseRes, progressRes] = await Promise.all(promises);
      
      setCourse(courseRes.data);
      
      if (progressRes && progressRes.data) {
        setProgress(progressRes.data);
      }
      
      // Ideally backend should return `isFavorite` in course details for auth users
      if (courseRes.data.isFavorite) {
         setIsFavorite(true);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load course details.");
      addToast("Failed to load course details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, addToast]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleStartCourse = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setActionLoading(true);
      if (progress) {
        // Continue course - scroll to roadmap
        const el = document.getElementById('roadmap-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Start course
        const res = await progressService.startCourse(id);
        setProgress(res.data);
        addToast("Course started! Good luck.", "success");
        // Scroll to roadmap
        setTimeout(() => {
            const el = document.getElementById('roadmap-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to start course", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStep = async ({ stepNumber, completed }) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    const activeRoadmapId = (activeRoadmap && activeRoadmap._id) || progress?.roadmapId;
    if (!activeRoadmapId) return;

    try {
      const res = await progressService.updateStep({
        courseId: id,
        roadmapId: activeRoadmapId,
        stepNumber,
        completed,
      });
      setProgress(res.data);
    } catch (err) {
      console.error(err);
      addToast("Failed to update step progress", "error");
    }
  };

  const handleCompleteCourse = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    const roadmapId = (activeRoadmap && activeRoadmap._id) || progress?.roadmapId;
    const steps = activeRoadmap?.steps || [];

    if (!roadmapId || steps.length === 0) {
      addToast("This course does not have a roadmap to complete yet.", "info");
      return;
    }

    try {
      setActionLoading(true);

      const stepNumbers = steps.map((s) => s.stepNumber);

      await Promise.all(
        stepNumbers.map((stepNumber) =>
          progressService.updateStep({
            courseId: id,
            roadmapId,
            stepNumber,
            completed: true,
          })
        )
      );

      // Refresh overall progress from the server
      const refreshed = await progressService
        .getByCourseId(id)
        .catch(() => null);
      if (refreshed?.data) {
        setProgress(refreshed.data);
      }

      addToast("Course marked as completed.", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to mark course as completed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    try {
      // Optimistic update
      setIsFavorite(!isFavorite);
      const res = await favoriteService.toggleFavorite(id);
      
      // Update with actual server state if available
      if (res && typeof res.isFavorite !== 'undefined') {
        setIsFavorite(res.isFavorite);
      }
      
      addToast(isFavorite ? "Removed from favorites" : "Added to favorites", "success");
    } catch {
      setIsFavorite(!isFavorite);
      addToast("Failed to update favorites", "error");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: course?.title || 'Degap Course',
      text: `Check out this course: ${course?.title}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error sharing", error);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast("Link copied to clipboard!", "success");
      } catch {
        addToast("Failed to copy link", "error");
      }
    }
  };

  if (loading) return <Loading />;
  
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-600 text-lg mb-4">{error || "Course not found"}</p>
        <Link to="/courses" className="text-blue-600 hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const {
    title,
    description,
    thumbnail,
    difficulty,
    category,
    duration,
    author,
    rating = 0,
    totalStudents = 0,
    roadmaps = [], 
  } = course;

  const activeRoadmap = roadmaps?.[0] || course.roadmap;
  const isCourseComplete = progress?.progressPercentage === 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header / Hero */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-2/5 relative h-64 md:h-auto bg-gray-200">
               {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
            </div>
            <div className="p-8 md:w-3/5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                 <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase">
                    {category}
                 </span>
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                    difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                 }`}>
                    {difficulty}
                 </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600 mb-6 flex-grow">{description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating.toFixed(1)}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {totalStudents} students
                  </div>
                   <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button 
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 border border-gray-200"
                    title="Share Course"
                  >
                    <ShareIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleFavorite}
                    className={`p-2 transition-colors rounded-full border border-gray-200 ${
                        isFavorite 
                        ? "text-red-500 bg-red-50 border-red-200" 
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    {isFavorite ? (
                        <HeartSolid className="w-6 h-6" />
                    ) : (
                        <HeartOutline className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={handleStartCourse}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {actionLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : progress ? (
                        <>
                            <span>Continue Learning</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-5 h-5" />
                            <span>Start Learning</span>
                        </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="grid md:grid-cols-3 gap-8">
           {/* Main Content: Roadmap / Syllabus */}
           <div className="md:col-span-2 space-y-8" id="roadmap-section">
              <section>
                 {activeRoadmap ? (
                    <RoadmapViewer
                      roadmap={activeRoadmap}
                      progress={progress}
                      onToggleStep={handleToggleStep}
                      onCompleteCourse={handleCompleteCourse}
                      isCourseComplete={isCourseComplete}
                    />
                 ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                       <p className="text-gray-500 italic mb-4">No roadmap details available yet.</p>
                       {isAuthenticated && (user?.id === course.createdBy?._id || user?.id === course.createdBy) && (
                          <button
                            onClick={() => navigate(`/courses/${id}/create-roadmap`)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                          >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create Roadmap
                          </button>
                       )}
                    </div>
                 )}
              </section>
           </div>

           {/* Sidebar: Instructor info, etc */}
           <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
                 <div className="flex items-center gap-4 mb-4">
                    <img 
                       src={author?.profilePicture || `https://ui-avatars.com/api/?name=${author?.name || "Instructor"}`} 
                       alt={author?.name} 
                       className="w-12 h-12 rounded-full bg-gray-200"
                    />
                    <div>
                       <p className="font-medium text-gray-900">{author?.name || "Unknown Instructor"}</p>
                       <p className="text-xs text-gray-500">{author?.email}</p>
                    </div>
                 </div>
                 <Link to={`/profile/${author?._id}`} className="block w-full text-center py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
                    View Profile
                 </Link>
              </div>

               {/* Tags / Meta */}
               <div className="bg-white rounded-xl shadow-sm p-6">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                 <div className="flex flex-wrap gap-2">
                    {course?.tags?.map((tag, i) => (
                       <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                       </span>
                    ))}
                    {!course?.tags?.length && <span className="text-gray-500 text-sm italic">No tags</span>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
