import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PDFReport } from "../PDFReport";
import { usePDFReport } from "../../hooks/usePDFReport";

// Mock the hook
jest.mock("../../hooks/usePDFReport");

const mockUsePDFReport = usePDFReport as jest.MockedFunction<
  typeof usePDFReport
>;

// Mock jsPDF and jspdf-autotable
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
    getNumberOfPages: jest.fn(() => 1),
    setPage: jest.fn(),
    internal: {
      pageSize: {
        width: 210,
        height: 297,
      },
    },
    lastAutoTable: {
      finalY: 100,
    },
  }));
});

jest.mock("jspdf-autotable", () => jest.fn());

describe("PDFReport", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      completed: false,
      priority: "medium" as const,
      dueDate: undefined,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      completed: true,
      priority: "high" as const,
      dueDate: undefined,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
  ];

  const mockGeneratePDF = jest.fn();
  const mockUpdateOptions = jest.fn();
  const mockResetOptions = jest.fn();
  const mockCanGenerateReport = jest.fn();
  const mockCalculateStatistics = jest.fn();
  const mockSortTasksForReport = jest.fn();
  const mockFormatTaskForReport = jest.fn();
  const mockGetReportFilename = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementation
    mockUsePDFReport.mockReturnValue({
      isGenerating: false,
      options: {
        includeStatistics: true,
        includeTaskList: true,
        includeTimestamps: true,
        sortBy: "created",
      },
      generatePDF: mockGeneratePDF,
      updateOptions: mockUpdateOptions,
      resetOptions: mockResetOptions,
      canGenerateReport: mockCanGenerateReport,
      calculateStatistics: mockCalculateStatistics,
      sortTasksForReport: mockSortTasksForReport,
      formatTaskForReport: mockFormatTaskForReport,
      getReportFilename: mockGetReportFilename,
    });
  });

  it("renders PDF report component", () => {
    mockCanGenerateReport.mockReturnValue(true);

    render(<PDFReport tasks={mockTasks} />);

    expect(screen.getByText("📊 PDF Report")).toBeInTheDocument();
    expect(screen.getByText("Generate PDF Report")).toBeInTheDocument();
  });

  it("displays task count information", () => {
    mockCanGenerateReport.mockReturnValue(true);

    render(<PDFReport tasks={mockTasks} />);

    expect(screen.getByText("Report will include 2 tasks")).toBeInTheDocument();
  });

  it("handles empty task list gracefully", () => {
    mockCanGenerateReport.mockReturnValue(false);

    render(<PDFReport tasks={[]} />);

    expect(
      screen.getByText("No tasks available for report")
    ).toBeInTheDocument();
  });

  it("shows loading state when generating", () => {
    mockUsePDFReport.mockReturnValue({
      isGenerating: true,
      options: {
        includeStatistics: true,
        includeTaskList: true,
        includeTimestamps: true,
        sortBy: "created",
      },
      generatePDF: mockGeneratePDF,
      updateOptions: mockUpdateOptions,
      resetOptions: mockResetOptions,
      canGenerateReport: mockCanGenerateReport,
      calculateStatistics: mockCalculateStatistics,
      sortTasksForReport: mockSortTasksForReport,
      formatTaskForReport: mockFormatTaskForReport,
      getReportFilename: mockGetReportFilename,
    });
    mockCanGenerateReport.mockReturnValue(false);

    render(<PDFReport tasks={mockTasks} />);

    expect(screen.getByText("Generating PDF...")).toBeInTheDocument();
    expect(screen.queryByText("Generate PDF Report")).not.toBeInTheDocument();
  });

  it("disables button when generating", () => {
    mockUsePDFReport.mockReturnValue({
      isGenerating: true,
      options: {
        includeStatistics: true,
        includeTaskList: true,
        includeTimestamps: true,
        sortBy: "created",
      },
      generatePDF: mockGeneratePDF,
      updateOptions: mockUpdateOptions,
      resetOptions: mockResetOptions,
      canGenerateReport: mockCanGenerateReport,
      calculateStatistics: mockCalculateStatistics,
      sortTasksForReport: mockSortTasksForReport,
      formatTaskForReport: mockFormatTaskForReport,
      getReportFilename: mockGetReportFilename,
    });
    mockCanGenerateReport.mockReturnValue(false);

    render(<PDFReport tasks={mockTasks} />);

    const button = screen.getByText("Generating PDF...");
    expect(button).toBeDisabled();
  });

  it("disables button when no tasks available", () => {
    mockCanGenerateReport.mockReturnValue(false);

    render(<PDFReport tasks={[]} />);

    const button = screen.getByText("Generate PDF Report");
    expect(button).toBeDisabled();
  });

  it("calls generatePDF when button is clicked", async () => {
    mockCanGenerateReport.mockReturnValue(true);
    mockGeneratePDF.mockResolvedValue({ success: true });

    render(<PDFReport tasks={mockTasks} />);

    const button = screen.getByText("Generate PDF Report");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGeneratePDF).toHaveBeenCalledWith(mockTasks);
    });
  });

  it("shows message when no tasks available", () => {
    mockCanGenerateReport.mockReturnValue(false);

    render(<PDFReport tasks={[]} />);

    expect(
      screen.getByText("No tasks available for report")
    ).toBeInTheDocument();
  });

  it("displays report options", () => {
    mockCanGenerateReport.mockReturnValue(true);

    render(<PDFReport tasks={mockTasks} />);

    expect(screen.getByText("Include Statistics")).toBeInTheDocument();
    expect(screen.getByText("Include Task List")).toBeInTheDocument();
    expect(screen.getByText("Include Timestamps")).toBeInTheDocument();
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("calls updateOptions when checkbox is changed", () => {
    mockCanGenerateReport.mockReturnValue(true);

    render(<PDFReport tasks={mockTasks} />);

    const statisticsCheckbox = screen.getByLabelText("Include Statistics");
    fireEvent.click(statisticsCheckbox);

    expect(mockUpdateOptions).toHaveBeenCalledWith({
      includeStatistics: false,
    });
  });

  it("calls resetOptions when reset button is clicked", () => {
    mockCanGenerateReport.mockReturnValue(true);

    render(<PDFReport tasks={mockTasks} />);

    const resetButton = screen.getByText("Reset Options");
    fireEvent.click(resetButton);

    expect(mockResetOptions).toHaveBeenCalled();
  });
});
