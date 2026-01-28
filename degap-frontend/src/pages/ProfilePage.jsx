import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/user.service";
import courseService from "../services/course.service";
import { useToast } from "../hooks/useToast";

export default function ProfilePage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const res = await userService.getProfile();
        const data = res.data;
        if (!isMounted) return;

        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setProfilePicture(data.profilePicture || "");
      } catch (err) {
        console.error(err);
        addToast("Failed to load profile", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadMyCourses() {
      try {
        setLoadingCourses(true);
        const res = await courseService.getMyCourses();
        if (!isMounted) return;
        setMyCourses(res.data || []);
      } catch (err) {
        console.error(err);
        addToast("Failed to load your courses", "error");
      } finally {
        if (isMounted) setLoadingCourses(false);
      }
    }

    loadProfile();
    loadMyCourses();
    return () => {
      isMounted = false;
    };
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        profilePicture: profilePicture.trim() || undefined,
      });
      setProfile((prev) => ({ ...(prev || {}), ...res.data }));
      addToast("Profile updated successfully", "success");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error?.message || "Failed to update profile";
      addToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : null;

  const filteredCourses =
    statusFilter === "all"
      ? myCourses
      : myCourses.filter((c) => c.status === statusFilter);

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "taken_down", label: "Taken down" },
  ];

  const statusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "draft":
        return "bg-gray-50 text-gray-700 border border-gray-200";
      case "submitted":
      case "under_review":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      case "taken_down":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the course "${title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await courseService.delete(courseId);
      setMyCourses((prev) => prev.filter((c) => c._id !== courseId));
      addToast("Course deleted", "success");
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.error?.message || "Failed to delete course",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and how others see you on Degap.
          </p>
        </header>

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
            <p className="text-gray-500 text-sm">Loading profile…</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
              {/* Overview card */}
              <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold mb-3">
                    {profilePicture ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img
                        src={profilePicture}
                        alt={profile?.name || "Profile"}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      (profile?.name || "U")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase())
                        .join("")
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {profile?.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>

                  <div className="mt-4 w-full space-y-2 text-sm text-gray-600">
                    {joinedDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Member since</span>
                        <span>{joinedDate}</span>
                      </div>
                    )}
                    {profile?.role && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Role</span>
                        <span className="capitalize">{profile.role}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Email verified</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200">
                        {profile?.emailVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Edit form */}
              <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">
                  Edit profile
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="Tell others a bit about your background, interests, or learning goals."
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Up to 500 characters.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="profilePicture"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Profile picture URL
                    </label>
                    <input
                      id="profilePicture"
                      type="url"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="https://"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Optional. Use a square image for best results.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </form>
              </section>
            </div>

            {/* My Courses section */}
            <section className="mt-8 bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                    My courses
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Quick overview of the courses you’ve created and their status.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs text-gray-700 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Link
                    to="/create-course"
                    className="hidden sm:inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-900 hover:text-white"
                  >
                    Create course
                  </Link>
                </div>
              </div>

              {loadingCourses ? (
                <p className="text-sm text-gray-500">Loading courses…</p>
              ) : filteredCourses.length === 0 ? (
                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <span>
                    {statusFilter === "all"
                      ? "You haven’t created any courses yet."
                      : "No courses match the selected status."}
                  </span>
                  <Link
                    to="/create-course"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-900 hover:text-white"
                  >
                    Create your first course
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredCourses.map((course) => (
                    <li
                      key={course._id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
                    >
                      <div className="min-w-0">
                        <Link
                          to={`/courses/${course._id}`}
                          className="font-medium text-gray-900 hover:underline truncate block"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {course.category} •{" "}
                          <span className="capitalize">{course.difficulty}</span> •{" "}
                          {course.estimatedDuration
                            ? `${course.estimatedDuration}h`
                            : "Duration N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(
                            course.status
                          )}`}
                        >
                          {course.status?.replace("_", " ") || "unknown"}
                        </span>
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-xs font-medium text-gray-500 hover:text-gray-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/courses/${course._id}/edit`}
                          className="text-xs font-medium text-gray-500 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCourse(course._id, course.title)
                          }
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

