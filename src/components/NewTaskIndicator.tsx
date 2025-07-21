import React from "react";

interface NewTaskIndicatorProps {
  count: number;
}

export const NewTaskIndicator: React.FC<NewTaskIndicatorProps> = ({
  count,
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
        <span className="text-lg font-medium text-blue-700">
          New Tasks ({count})
        </span>
      </div>
      <div className="flex-1 border-t border-blue-200 ml-3"></div>
    </div>
  );
};
