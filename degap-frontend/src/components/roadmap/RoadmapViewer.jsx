import React, { useMemo } from 'react';
import StepCard from './StepCard';

export default function RoadmapViewer({
  roadmap,
  progress,
  onToggleStep,
  onCompleteCourse,
  isCourseComplete,
}) {
  if (!roadmap) return null;

  const { title, description, steps = [] } = roadmap;

  // Sort steps by stepNumber just in case
  const sortedSteps = useMemo(
    () => [...steps].sort((a, b) => a.stepNumber - b.stepNumber),
    [steps]
  );

  const completedSteps = new Set(progress?.completedSteps || []);
  const totalSteps = sortedSteps.length || 0;
  const completedCount = totalSteps
    ? sortedSteps.filter((s) => completedSteps.has(s.stepNumber)).length
    : 0;

  // Derive percentage from steps locally so that when all
  // steps are marked complete the bar always shows 100%,
  // even if the backend cached percentage is stale.
  const progressPercentage =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Roadmap Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {description && (
              <p className="text-gray-700">{description}</p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{totalSteps} Steps</span>
              <span>•</span>
              <span>
                ~{steps.reduce((acc, step) => acc + (step.estimatedTime || 0), 0)} Hours Total
              </span>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="w-full md:w-64 space-y-1.5 text-sm text-gray-700">
            <span className="font-medium block">Progress</span>
            <div className="w-full bg-white/60 rounded-full h-2.5 shadow-inner overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 block text-right">
              {completedCount}/{totalSteps} steps ({progressPercentage}%)
            </span>
            {progress && onCompleteCourse && !isCourseComplete && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onCompleteCourse}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    "border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  Mark course as done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="pl-2">
        {sortedSteps.length > 0 ? (
          sortedSteps.map((step, index) => (
            <StepCard
              key={step._id || index}
              step={step}
              isLast={index === sortedSteps.length - 1}
              isCompleted={completedSteps.has(step.stepNumber)}
              onToggle={() =>
                onToggleStep?.({
                  stepNumber: step.stepNumber,
                  completed: !completedSteps.has(step.stepNumber),
                })
              }
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No steps defined for this roadmap yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
