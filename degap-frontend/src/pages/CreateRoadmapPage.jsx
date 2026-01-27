import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import courseService from "../services/course.service";
import roadmapService from "../services/roadmap.service";
import { useToast } from "../hooks/useToast";
import { PlusIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Validation Schema
const resourceSchema = z.object({
  type: z.enum(["article", "video", "documentation", "course", "project", "book"]),
  title: z.string().min(3, "Title is required"),
  url: z.string().url("Valid URL is required"),
  description: z.string().optional(),
});

const stepSchema = z.object({
  stepNumber: z.number().min(1),
  title: z.string().min(3, "Step title is required"),
  description: z.string().optional(),
  estimatedTime: z.number().min(0, "Time must be positive").optional(),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  resources: z.array(resourceSchema).min(1, "At least one resource is required"),
});

const roadmapSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

export default function CreateRoadmapPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(roadmapSchema),
    defaultValues: {
      title: "",
      description: "",
      steps: [
        {
          stepNumber: 1,
          title: "",
          description: "",
          estimatedTime: 0,
          difficultyLevel: "beginner",
          resources: [
            {
              type: "article",
              title: "",
              url: "",
            },
          ],
        },
      ],
    },
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps",
  });

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await courseService.getById(courseId);
        setCourse(res.data);
        // Pre-fill title if empty
        // setValue("title", `${res.data.title} Roadmap`);
      } catch (error) {
        console.error(error);
        addToast("Failed to load course details", "error");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId, navigate, addToast]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        courseId,
      };
      await roadmapService.create(payload);
      addToast("Roadmap created successfully!", "success");
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || "Failed to create roadmap", "error");
    }
  };

  // Nested Resource Field Array Component
  const ResourceFields = ({ stepIndex, control, register, errors }) => {
    const { fields, append, remove } = useFieldArray({
      control,
      name: `steps.${stepIndex}.resources`,
    });

    return (
      <div className="mt-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700">Resources</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-md">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                {...register(`steps.${stepIndex}.resources.${index}.type`)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="documentation">Documentation</option>
                <option value="course">Course</option>
                <option value="project">Project</option>
                <option value="book">Book</option>
              </select>
              <input
                {...register(`steps.${stepIndex}.resources.${index}.title`)}
                placeholder="Resource Title"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <input
                {...register(`steps.${stepIndex}.resources.${index}.url`)}
                placeholder="URL"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove Resource"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ type: "article", title: "", url: "" })}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add Resource
        </button>
        {errors.steps?.[stepIndex]?.resources && (
            <p className="text-sm text-red-600">{errors.steps[stepIndex].resources.message}</p>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Course
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Roadmap</h1>
          <p className="mt-2 text-gray-600">
            Define the learning path for <span className="font-semibold">{course?.title}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Roadmap Info */}
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Roadmap Title</label>
              <input
                type="text"
                {...register("title")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                placeholder="e.g. Full Stack Web Development Path"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                placeholder="Brief overview of this learning path..."
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Roadmap Steps</h2>
              <button
                type="button"
                onClick={() =>
                  appendStep({
                    stepNumber: stepFields.length + 1,
                    title: "",
                    description: "",
                    estimatedTime: 0,
                    difficultyLevel: "beginner",
                    resources: [{ type: "article", title: "", url: "" }],
                  })
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Add Step
              </button>
            </div>

            {stepFields.map((field, index) => (
              <div key={field.id} className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Step {index + 1}</h3>
                  {stepFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <input type="hidden" {...register(`steps.${index}.stepNumber`, { value: index + 1 })} />
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Step Title</label>
                    <input
                      {...register(`steps.${index}.title`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                      placeholder="e.g. HTML Basics"
                    />
                    {errors.steps?.[index]?.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.steps[index].title.message}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register(`steps.${index}.description`)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                    <select
                      {...register(`steps.${index}.difficultyLevel`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Est. Time (hours)</label>
                    <input
                      type="number"
                      {...register(`steps.${index}.estimatedTime`, { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                    />
                  </div>
                </div>

                <ResourceFields
                  stepIndex={index}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>
            ))}
            {errors.steps && typeof errors.steps.message === 'string' && (
                <p className="text-red-600 text-center">{errors.steps.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Roadmap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
