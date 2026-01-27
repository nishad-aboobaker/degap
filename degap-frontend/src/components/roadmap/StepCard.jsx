import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, BoltIcon } from '@heroicons/react/24/outline';
import ResourceLink from './ResourceLink';

export default function StepCard({ step, isLast }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    stepNumber,
    title,
    description,
    estimatedTime,
    difficultyLevel,
    resources = [],
    exercises = []
  } = step;

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex gap-4 relative">
      {/* Timeline Connector */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm z-10 shrink-0">
          {stepNumber}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-grow bg-gray-200 my-2 absolute top-8 bottom-0 -z-0"></div>
        )}
      </div>

      {/* Content Card */}
      <div className="flex-grow pb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
          {/* Header */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left p-5 flex items-start justify-between bg-white hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <div className="flex items-center gap-3 mt-2">
                {estimatedTime > 0 && (
                  <span className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="w-3.5 h-3.5 mr-1" />
                    {estimatedTime} hours
                  </span>
                )}
                {difficultyLevel && (
                  <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyColor(difficultyLevel)} capitalize`}>
                    {difficultyLevel}
                  </span>
                )}
              </div>
            </div>
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="px-5 pb-5 border-t border-gray-100">
              {description && (
                <div className="mt-4 prose prose-sm max-w-none text-gray-600">
                  <p>{description}</p>
                </div>
              )}

              {/* Resources */}
              {resources.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Learning Resources
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                    {resources.map((resource, idx) => (
                      <ResourceLink key={idx} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises */}
              {exercises.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
                    <BoltIcon className="w-4 h-4 mr-1 text-yellow-500" />
                    Exercises & Projects
                  </h4>
                  <div className="space-y-3">
                    {exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-900 text-sm">{exercise.title}</h5>
                        {exercise.description && (
                          <p className="text-xs text-gray-600 mt-1">{exercise.description}</p>
                        )}
                        {exercise.url && (
                          <a 
                            href={exercise.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-blue-600 hover:underline font-medium"
                          >
                            View Exercise →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
