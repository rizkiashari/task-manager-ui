import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { Task, Priority } from "../types/task";

// Extend jsPDF type to include lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface PDFReportProps {
  tasks: Task[];
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PDFReport: React.FC<PDFReportProps> = ({
  tasks,
  onGenerate,
  isGenerating,
}) => {
  const generatePDF = async () => {
    onGenerate();

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("Task Management Report", 20, 20);

      // Date
      doc.setFontSize(12);
      doc.text(
        `Generated on: ${moment().format("MMMM DD, YYYY [at] h:mm A")}`,
        20,
        30
      );

      // Statistics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.completed).length;
      const pendingTasks = totalTasks - completedTasks;

      doc.setFontSize(14);
      doc.text("Summary Statistics", 20, 45);
      doc.setFontSize(10);
      doc.text(`Total Tasks: ${totalTasks}`, 20, 55);
      doc.text(`Completed: ${completedTasks}`, 20, 62);
      doc.text(`Pending: ${pendingTasks}`, 20, 69);

      // Task Table
      const tableData = tasks.map((task) => [
        task.title,
        task.description || "-",
        task.completed ? "Completed" : "Pending",
        moment(task.createdAt).format("MMM DD, YYYY"),
      ]);

      autoTable(doc, {
        head: [["Title", "Description", "Status", "Created"]],
        body: tableData,
        startY: 80,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [59, 130, 246], // Blue color
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Light gray
        },
        columnStyles: {
          0: { cellWidth: 50 }, // Title
          1: { cellWidth: 50 }, // Description
          2: { cellWidth: 25 }, // Status
          3: { cellWidth: 30 }, // Created
        },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }

      // Download the PDF
      doc.save(`task-report-${moment().format("YYYY-MM-DD HH:mm:ss")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">📊 PDF Report</h3>
          <p className="text-sm text-gray-600">
            Generate a comprehensive PDF report of all tasks
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Total Tasks: <span className="font-semibold">{tasks.length}</span>
          </div>
          <div className="text-sm text-gray-500">
            Completed:{" "}
            <span className="font-semibold text-green-600">
              {tasks.filter((t) => t.completed).length}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        disabled={isGenerating || tasks.length === 0}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isGenerating || tasks.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        }`}
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF Report
          </>
        )}
      </button>

      {tasks.length === 0 && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          No tasks available to generate report
        </p>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>📋 Report includes:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Task summary and statistics</li>
          <li>Complete task list with title and description</li>
          <li>Task status (completed/pending)</li>
          <li>Creation dates</li>
        </ul>
      </div>
    </div>
  );
};
