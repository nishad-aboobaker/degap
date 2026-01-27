import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import courseService from "../services/course.service";
import { useToast } from "../hooks/useToast";
import { PhotoIcon } from "@heroicons/react/24/outline";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnail: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  prerequisites: z.string().optional(), // We'll parse this to array
  estimatedDuration: z.number().min(0, "Duration must be positive"),
});

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Design",
  "Business",
  "Other"
];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "beginner",
      thumbnail: "",
      prerequisites: "",
      estimatedDuration: 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Transform data
      const courseData = {
        ...data,
        prerequisites: data.prerequisites
          ? data.prerequisites.split(",").map((p) => p.trim()).filter(Boolean)
          : [],
      };

      const res = await courseService.create(courseData);
      addToast("Course created successfully!", "success");
      
      // Navigate to course detail or builder
      // For now, go to detail page
      navigate(`/courses/${res.data._id}`);
      
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || "Failed to create course", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Create New Course
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your knowledge with the world.
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="title"
                  {...register("title")}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border ${
                    errors.title ? "border-red-300" : ""
                  }`}
                  placeholder="e.g. Advanced React Patterns"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border ${
                    errors.description ? "border-red-300" : ""
                  }`}
                  placeholder="What will students learn in this course?"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    {...register("category")}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  Difficulty Level
                </label>
                <div className="mt-1">
                  <select
                    id="difficulty"
                    {...register("difficulty")}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estimated Duration */}
             <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                Estimated Duration (Hours)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="estimatedDuration"
                  {...register("estimatedDuration", { valueAsNumber: true })}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border ${
                    errors.estimatedDuration ? "border-red-300" : ""
                  }`}
                />
                {errors.estimatedDuration && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedDuration.message}</p>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                Thumbnail URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  <PhotoIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="thumbnail"
                  {...register("thumbnail")}
                  className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 border ${
                     errors.thumbnail ? "border-red-300" : ""
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>
              )}
            </div>

            {/* Prerequisites */}
            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
                Prerequisites (comma separated)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="prerequisites"
                  {...register("prerequisites")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  placeholder="e.g. Basic JavaScript, HTML/CSS"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
