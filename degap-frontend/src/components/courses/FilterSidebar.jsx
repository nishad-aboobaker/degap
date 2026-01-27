import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cybersecurity",
  "Cloud Computing",
  "Game Development",
];

const TECHNOLOGIES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "AWS",
  "MongoDB",
  "SQL",
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function FilterSidebar({ filters, onFilterChange, onClose, className = "" }) {
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? "" : category,
      page: 1 // Reset page on filter change
    });
  };

  const handleDifficultyChange = (difficulty) => {
    onFilterChange({
      ...filters,
      difficulty: filters.difficulty === difficulty ? "" : difficulty,
      page: 1
    });
  };

  const handleTechnologyChange = (tech) => {
    onFilterChange({
      ...filters,
      technology: filters.technology === tech ? "" : tech,
      page: 1
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: filters.search || "", // Keep search
      sort: filters.sort || "-createdAt", // Keep sort
      page: 1
    });
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          Filters
        </h3>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Difficulty Section */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Difficulty</h4>
        <div className="space-y-2">
          {DIFFICULTIES.map((diff) => (
            <label key={diff.value} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.difficulty === diff.value}
                  onChange={() => handleDifficultyChange(diff.value)}
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {diff.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.category === cat}
                onChange={() => handleCategoryChange(cat)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Technology</h4>
        <div className="flex flex-wrap gap-2">
          {TECHNOLOGIES.map((tech) => (
            <button
              key={tech}
              onClick={() => handleTechnologyChange(tech)}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                filters.technology === tech
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
