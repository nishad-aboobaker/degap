import React from 'react';
import StepCard from './StepCard';

export default function RoadmapViewer({ roadmap }) {
  if (!roadmap) return null;

  const { title, description, steps = [] } = roadmap;

  // Sort steps by stepNumber just in case
  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="space-y-8">
      {/* Roadmap Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-700">{description}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">{steps.length} Steps</span>
          <span>•</span>
          <span>
            ~{steps.reduce((acc, step) => acc + (step.estimatedTime || 0), 0)} Hours Total
          </span>
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
