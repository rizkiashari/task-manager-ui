"use client";

import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import jsPDF from "jspdf";

const PDFReport: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { tasks } = useTaskStore();

  const generatePDF = async () => {
    if (tasks.length === 0) {
      alert("No tasks available to generate report.");
      return;
    }

    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      // Add header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Task Management Report", 20, 20);

      // Add timestamp
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

      // Add app name
      doc.text("Task Manager Dashboard", 20, 40);

      // Add summary
      const completedTasks = tasks.filter((task) => task.completed).length;
      const totalTasks = tasks.length;
      const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 55);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Tasks: ${totalTasks}`, 20, 65);
      doc.text(`Completed: ${completedTasks}`, 20, 75);
      doc.text(`Completion Rate: ${completionRate}%`, 20, 85);

      // Add tasks list
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Task Details", 20, 105);

      let yPosition = 115;
      const lineHeight = 8;
      const maxWidth = 170;

      tasks.forEach((task, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");

        // Task title with status indicator
        const status = task.completed ? "✓" : "○";
        const title = `${status} ${task.title}`;
        doc.text(title, 20, yPosition);

        yPosition += lineHeight;

        // Task description
        if (task.description) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");

          // Split description into multiple lines if needed
          const words = task.description.split(" ");
          let currentLine = "";

          for (const word of words) {
            const testLine = currentLine + word + " ";
            const testWidth = doc.getTextWidth(testLine);

            if (testWidth > maxWidth && currentLine !== "") {
              doc.text(currentLine, 25, yPosition);
              yPosition += lineHeight;
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }
          }

          if (currentLine) {
            doc.text(currentLine, 25, yPosition);
            yPosition += lineHeight;
          }
        }

        // Task metadata
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const metadata = `Created: ${new Date(
          task.createdAt
        ).toLocaleDateString()}`;
        doc.text(metadata, 25, yPosition);

        yPosition += lineHeight + 2;

        // Add separator line
        if (index < tasks.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition, 190, yPosition);
          yPosition += 5;
        }
      });

      // Save the PDF
      const fileName = `task-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Generate Report
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Download a PDF report of all your tasks
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">
            Total Tasks: <span className="font-semibold">{tasks.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            Completed:{" "}
            <span className="font-semibold text-green-600">
              {tasks.filter((task) => task.completed).length}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        disabled={isGenerating || tasks.length === 0}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Generating Report...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
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
            Download Report
          </>
        )}
      </button>

      {tasks.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-2">
          No tasks available for report generation
        </p>
      )}
    </div>
  );
};

export default PDFReport;
