import React from "react";

const LoadingSkeleton = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-gray-700 rounded";

  if (variant === "card") {
    return (
      <div className={`p-6 border border-gray-800 rounded-xl ${baseClasses} ${className}`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded w-32"></div>
            <div className="h-3 bg-gray-600 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-600 rounded"></div>
          <div className="h-3 bg-gray-600 rounded w-3/4"></div>
        </div>
        <div className="flex space-x-2 mt-4">
          <div className="h-6 bg-gray-600 rounded w-16"></div>
          <div className="h-6 bg-gray-600 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className="h-4 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className={`p-6 border border-gray-800 rounded-xl ${baseClasses} ${className}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gray-600 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-24 mb-4"></div>
          <div className="h-16 bg-gray-600 rounded w-full mb-4"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-600 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default skeleton
  return <div className={`${baseClasses} ${className}`}></div>;
};

export default LoadingSkeleton;