import React from "react";

export const NotificationSkeleton: React.VFC = () => {
  return (
    <div className="flex px-4 py-3 animate-pulse">
      <div className="flex-grow mr-4">
        <div className="w-3/4 h-4 bg-gray-300 rounded" />
        <div className="w-full h-3 mt-2 bg-gray-300 rounded" />
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <div className="w-10 h-3 bg-gray-300 rounded" />
        <div className="w-16 h-4 mt-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}