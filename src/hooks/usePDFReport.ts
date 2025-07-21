import { useState, useCallback } from "react";
import { Task } from "../types/task";
import moment from "moment";

export interface PDFReportOptions {
  includeStatistics: boolean;
  includeTaskList: boolean;
  includeTimestamps: boolean;
  sortBy: "created" | "updated" | "title" | "status";
}

export const usePDFReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<PDFReportOptions>({
    includeStatistics: true,
    includeTaskList: true,
    includeTimestamps: true,
    sortBy: "created",
  });

  // Generate PDF report
  const generatePDF = useCallback(
    async (tasks: Task[]) => {
      setIsGenerating(true);

      try {
        // Dynamic import for jsPDF to avoid SSR issues
        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;

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

        let currentY = 45;

        // Statistics section
        if (options.includeStatistics) {
          const stats = calculateStatistics(tasks);
          doc.setFontSize(14);
          doc.text("Summary Statistics", 20, currentY);
          doc.setFontSize(10);
          currentY += 10;
          doc.text(`Total Tasks: ${stats.total}`, 20, currentY);
          currentY += 7;
          doc.text(`Completed: ${stats.completed}`, 20, currentY);
          currentY += 7;
          doc.text(`Pending: ${stats.pending}`, 20, currentY);
          currentY += 7;
          doc.text(`Completion Rate: ${stats.completionRate}%`, 20, currentY);
          currentY += 15;
        }

        // Task list section
        if (options.includeTaskList && tasks.length > 0) {
          const sortedTasks = sortTasksForReport(tasks, options.sortBy);
          const tableData = sortedTasks.map((task) => {
            const row = [
              task.title,
              task.description || "-",
              task.completed ? "Completed" : "Pending",
            ];

            if (options.includeTimestamps) {
              row.push(moment(task.createdAt).format("MMM DD, YYYY"));
            }

            return row;
          });

          const headers = ["Title", "Description", "Status"];
          if (options.includeTimestamps) {
            headers.push("Created");
          }

          autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: currentY,
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
              3: { cellWidth: 30 }, // Created (if included)
            },
          });
        }

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
        const filename = getReportFilename();
        doc.save(filename);

        return { success: true };
      } catch (error) {
        console.error("Error generating PDF:", error);
        return { success: false, error: "Failed to generate PDF" };
      } finally {
        setIsGenerating(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options]
  );

  // Update report options
  const updateOptions = useCallback((newOptions: Partial<PDFReportOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // Reset options to default
  const resetOptions = useCallback(() => {
    setOptions({
      includeStatistics: true,
      includeTaskList: true,
      includeTimestamps: true,
      sortBy: "created",
    });
  }, []);

  // Calculate report statistics
  const calculateStatistics = useCallback((tasks: Task[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }, []);

  // Sort tasks for report
  const sortTasksForReport = useCallback(
    (tasks: Task[], sortBy: PDFReportOptions["sortBy"]) => {
      return [...tasks].sort((a, b) => {
        switch (sortBy) {
          case "created":
            return (
              moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
            );
          case "updated":
            return (
              moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()
            );
          case "title":
            return a.title.localeCompare(b.title);
          case "status":
            if (a.completed === b.completed) {
              return (
                moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
              );
            }
            return a.completed ? 1 : -1;
          default:
            return 0;
        }
      });
    },
    []
  );

  // Format task for report
  const formatTaskForReport = useCallback((task: Task) => {
    return {
      title: task.title,
      description: task.description || "No description",
      status: task.completed ? "Completed" : "Pending",
      created: moment(task.createdAt).format("MMM DD, YYYY"),
      updated: moment(task.updatedAt).format("MMM DD, YYYY"),
    };
  }, []);

  // Check if report can be generated
  const canGenerateReport = useCallback(
    (tasks: Task[]) => {
      return (
        tasks.length > 0 &&
        (options.includeStatistics || options.includeTaskList)
      );
    },
    [options.includeStatistics, options.includeTaskList]
  );

  // Get report filename
  const getReportFilename = useCallback(() => {
    return `task-report-${moment().format("YYYY-MM-DD-HH-mm-ss")}.pdf`;
  }, []);

  return {
    // State
    isGenerating,
    options,

    // Actions
    generatePDF,
    updateOptions,
    resetOptions,

    // Utilities
    calculateStatistics,
    sortTasksForReport,
    formatTaskForReport,
    canGenerateReport,
    getReportFilename,
  };
};
