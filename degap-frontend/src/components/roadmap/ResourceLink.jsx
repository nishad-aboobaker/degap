import React from 'react';
import { 
  BookOpenIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  AcademicCapIcon, 
  CodeBracketIcon, 
  LinkIcon 
} from '@heroicons/react/24/outline';

const getResourceIcon = (type) => {
  switch (type) {
    case 'video':
      return <VideoCameraIcon className="w-5 h-5" />;
    case 'article':
    case 'documentation':
      return <DocumentTextIcon className="w-5 h-5" />;
    case 'course':
      return <AcademicCapIcon className="w-5 h-5" />;
    case 'project':
      return <CodeBracketIcon className="w-5 h-5" />;
    case 'book':
      return <BookOpenIcon className="w-5 h-5" />;
    default:
      return <LinkIcon className="w-5 h-5" />;
  }
};

const getResourceLabel = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ResourceLink({ resource }) {
  const { type, title, url, description } = resource;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      <div className="mt-0.5 text-gray-500 group-hover:text-blue-600 transition-colors">
        {getResourceIcon(type)}
      </div>
      <div>
        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
          {title}
          <span className="ml-2 text-xs font-normal text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded bg-white">
            {getResourceLabel(type)}
          </span>
        </h4>
        {description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </a>
  );
}
