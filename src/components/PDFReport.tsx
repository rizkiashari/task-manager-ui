import React from "react";
import { Task } from "../types/task";
import { usePDFReport } from "../hooks/usePDFReport";
import { SpinnerIcon, DownloadIcon } from "./icons";

interface PDFReportProps {
  tasks: Task[];
}

export const PDFReport: React.FC<PDFReportProps> = ({ tasks }) => {
  const {
    isGenerating,
    options,
    generatePDF,
    updateOptions,
    resetOptions,
    canGenerateReport,
  } = usePDFReport();

  const handleGeneratePDF = async () => {
    const result = await generatePDF(tasks);
    if (result.success) {
      // PDF generated successfully
      console.log("PDF generated successfully");
    } else {
      console.error("Failed to generate PDF:", result.error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">📊 PDF Report</h3>
        <button
          onClick={resetOptions}
          className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          Reset Options
        </button>
      </div>

      {/* Report Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeStatistics}
            onChange={(e) =>
              updateOptions({ includeStatistics: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include Statistics</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeTaskList}
            onChange={(e) =>
              updateOptions({ includeTaskList: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include Task List</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeTimestamps}
            onChange={(e) =>
              updateOptions({ includeTimestamps: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Include Timestamps</span>
        </label>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Sort By</label>
          <select
            value={options.sortBy}
            onChange={(e) =>
              updateOptions({
                sortBy: e.target.value as
                  | "created"
                  | "updated"
                  | "title"
                  | "status",
              })
            }
            className="w-full px-3 py-1 text-sm border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created">Created Date</option>
            <option value="updated">Updated Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGeneratePDF}
        disabled={isGenerating || !canGenerateReport(tasks)}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
          isGenerating || !canGenerateReport(tasks)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        }`}
      >
        {isGenerating ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Generating PDF...
          </>
        ) : (
          <>
            <DownloadIcon className="-ml-1 mr-2 h-4 w-4" />
            Generate PDF Report
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="mt-2 text-xs text-gray-500 text-center">
        {tasks.length === 0
          ? "No tasks available for report"
          : `Report will include ${tasks.length} task${
              tasks.length !== 1 ? "s" : ""
            }`}
      </p>
    </div>
  );
};
