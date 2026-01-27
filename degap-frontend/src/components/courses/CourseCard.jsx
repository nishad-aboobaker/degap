import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  const {
    _id,
    title,
    description,
    thumbnail,
    difficulty,
    category,
    duration,
    author,
    rating = 0,
    totalStudents = 0,
  } = course;

  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
              difficultyColor[difficulty] || "bg-gray-100 text-gray-800"
            }`}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <svg
              className="w-4 h-4 mr-1 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating.toFixed(1)} ({totalStudents})
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t mt-auto">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 truncate max-w-[100px]">
              {author?.name || "Instructor"}
            </span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {duration}
          </div>
        </div>
        
        <Link
          to={`/courses/${_id}`}
          className="mt-4 block w-full text-center bg-gray-50 hover:bg-gray-100 text-blue-600 font-semibold py-2 rounded-md transition-colors border border-blue-200 hover:border-blue-300"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
