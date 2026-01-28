import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import progressService from "../services/progress.service";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [progressItems, setProgressItems] = useState([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "—";

  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  // Fetch all course progress for the current user
  useEffect(() => {
    let isMounted = true;

    async function fetchProgress() {
      try {
        setIsLoadingProgress(true);
        const response = await progressService.getAll();
        if (!isMounted) return;
        setProgressItems(response.data || []);
      } catch (error) {
        // Errors are surfaced via the global error handler in api.js
        console.error("Failed to load dashboard progress", error);
      } finally {
        if (isMounted) {
          setIsLoadingProgress(false);
        }
      }
    }

    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  const { totalCourses, completedCourses, averageCompletion } = useMemo(() => {
    if (!progressItems.length) {
      return { totalCourses: 0, completedCourses: 0, averageCompletion: 0 };
    }

    const total = progressItems.length;
    const completed = progressItems.filter(
      (item) => item.progressPercentage === 100 || item.completedAt
    ).length;
    const avg =
      total > 0
        ? Math.round(
            progressItems.reduce(
              (sum, item) => sum + (item.progressPercentage || 0),
              0
            ) / total
          )
        : 0;

    const clampedAverage = Math.min(Math.max(avg, 0), 100);

    return {
      totalCourses: total,
      completedCourses: completed,
      averageCompletion: clampedAverage,
    };
  }, [progressItems]);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-600 font-semibold">
              Home
            </p>
            <h1 className="mt-1 text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Keep up the momentum. You&apos;re just a few focused sessions away
              from your next milestone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            Browse courses
          </button>
        </div>

        {/* Motivation banner */}
        <section className="mb-6 lg:mb-8 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4 lg:px-6 lg:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-emerald-900 leading-relaxed">
            <span className="font-semibold">
              Great effort so far{displayName !== "there" ? `, ${displayName}` : ""}!
            </span>{" "}
            Stay consistent with short, focused learning blocks and you&apos;ll
            reach your goals faster than you think.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-emerald-700">
                Member since
              </p>
              <p className="mt-0.5 font-medium text-emerald-900">{memberSince}</p>
            </div>
            <div className="h-10 w-px bg-emerald-100 hidden sm:block" />
            <button
              type="button"
              onClick={() => navigate("/my-courses")}
              className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-medium text-emerald-800 shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
            >
              Continue learning
            </button>
          </div>
        </section>

        {/* Main 2-column layout */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
          {/* Left column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Performance + quick stats */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 lg:px-6 lg:py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500">
                    Overall performance
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Course completion rate across all enrolled courses.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-slate-500">Average completion</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {averageCompletion}%
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                    Pro learner
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] items-center">
                {/* Dynamic circular progress using conic-gradient */}
                <div className="relative flex items-center justify-center py-4">
                  <div
                    className="relative h-32 w-32 rounded-full flex items-center justify-center"
                    style={{
                      backgroundImage: `conic-gradient(#10b981 0deg ${averageCompletion * 3.6}deg, #e5e7eb ${averageCompletion * 3.6}deg 360deg)`,
                    }}
                    aria-hidden="true"
                  >
                    <div className="h-24 w-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                      <p className="text-xs text-slate-500">Completed</p>
                      <p className="text-xl font-semibold text-slate-900">
                        {averageCompletion}%
                      </p>
                    </div>
                  </div>
                  <span className="sr-only">
                    {averageCompletion}% of enrolled courses completed
                  </span>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Total enrolled
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {totalCourses}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Completed
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {completedCourses}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 col-span-2 sm:col-span-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      In progress
                    </p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {Math.max(totalCourses - completedCourses, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming / active courses */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 lg:px-6 lg:py-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Active courses
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/my-courses")}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {isLoadingProgress ? (
                  <p className="text-xs text-slate-500">Loading your courses…</p>
                ) : !progressItems.length ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-xs text-slate-500 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-700">
                        You haven&apos;t started any courses yet.
                      </p>
                      <p className="mt-1">
                        Enroll in a course to see your active learning here.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/courses")}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                      Browse courses
                    </button>
                  </div>
                ) : (
                  progressItems.slice(0, 3).map((item) => {
                    const course = item.courseId || {};
                    const progress = item.progressPercentage || 0;
                    return (
                      <button
                        key={item._id}
                        type="button"
                        className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left hover:bg-slate-100 transition-colors"
                        onClick={() => navigate(`/courses/${course._id}`)}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {course.title || "Untitled course"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                              {progress === 100 ? "Completed" : "In progress"}
                            </span>
                            {item.lastAccessedAt && (
                              <span>
                                Last visited{" "}
                                {new Date(item.lastAccessedAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="ml-2 text-xs font-medium text-slate-700 whitespace-nowrap">
                          {progress}%
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Streak / habits */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 lg:px-6 lg:py-6">
              <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500 mb-4">
                Learning streak
              </h2>
              <p className="text-xs text-slate-500 mb-3">
                Build a consistent learning habit by showing up for a short
                session every day.
              </p>
              <div className="flex items-center gap-2 mb-3 text-xs">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map(
                  (day, index) => (
                    <div
                      key={day}
                      className={`flex flex-col items-center justify-center rounded-xl border px-2 py-1.5 w-10 ${
                        index < 5
                          ? "bg-amber-50 border-amber-200 text-amber-800"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="text-[11px]">{day}</span>
                      <span className="mt-0.5 text-[10px] font-semibold">
                        {index < 5 ? "🔥" : "—"}
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Streaks help you retain more over time.</span>
                <span>Even 15 minutes counts.</span>
              </div>
            </section>

            {/* Assignment card */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 lg:px-6 lg:py-6">
              <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500 mb-4">
                Suggested focus
              </h2>
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 mb-4">
                <p className="text-xs font-medium text-slate-700">
                  Pick one course and aim to move it forward by one step today.
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-700 font-medium">
                  Small, consistent progress compounds over time.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  View details
                </button>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Upload work
                </button>
              </div>
            </section>

            {/* Quick links */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-5 lg:px-6 lg:py-6">
              <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-500 mb-4">
                Quick actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/create-course")}
                  className="flex flex-col items-start rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-900">
                    Create a new course
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Turn your expertise into a guided path.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex flex-col items-start rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-900">
                    Review your profile
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Keep your details and preferences up to date.
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
