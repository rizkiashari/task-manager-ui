import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PDFReport } from "../PDFReport";

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

jest.mock("moment", () => {
  const originalMoment = jest.requireActual("moment");
  const mockMoment = (date?: string | Date) => {
    if (date === "2024-01-15T10:00:00Z") {
      return {
        format: () => "Jan 15, 2024",
      };
    }
    return {
      format: () => "Jan 15, 2024",
    };
  };

  Object.setPrototypeOf(mockMoment, originalMoment);
  Object.assign(mockMoment, originalMoment);

  return mockMoment;
});

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

  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders PDF report component", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={false}
      />
    );

    expect(screen.getByText("📊 PDF Report")).toBeInTheDocument();
    expect(
      screen.getByText("Generate a comprehensive PDF report of all tasks")
    ).toBeInTheDocument();
    expect(screen.getByText("Download PDF Report")).toBeInTheDocument();
  });

  it("displays task statistics", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={false}
      />
    );

    expect(screen.getByText(/Total Tasks:/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/Completed:/)).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles empty task list gracefully", () => {
    render(
      <PDFReport tasks={[]} onGenerate={mockOnGenerate} isGenerating={false} />
    );

    expect(screen.getByText(/Total Tasks:/)).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.getByText(/Completed:/)).toBeInTheDocument();
    // Remove this line since there are multiple "0" elements
    // expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows loading state when generating", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={true}
      />
    );

    expect(screen.getByText("Generating PDF...")).toBeInTheDocument();
    expect(screen.queryByText("Download PDF Report")).not.toBeInTheDocument();
  });

  it("disables button when generating", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={true}
      />
    );

    const button = screen.getByText("Generating PDF...");
    expect(button).toBeDisabled();
  });

  it("disables button when no tasks available", () => {
    render(
      <PDFReport tasks={[]} onGenerate={mockOnGenerate} isGenerating={false} />
    );

    const button = screen.getByText("Download PDF Report");
    expect(button).toBeDisabled();
  });

  it("calls onGenerate when button is clicked", async () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={false}
      />
    );

    const button = screen.getByText("Download PDF Report");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalled();
    });
  });

  it("shows message when no tasks available", () => {
    render(
      <PDFReport tasks={[]} onGenerate={mockOnGenerate} isGenerating={false} />
    );

    expect(
      screen.getByText("No tasks available to generate report")
    ).toBeInTheDocument();
  });

  it("displays report features list", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={false}
      />
    );

    expect(screen.getByText("📋 Report includes:")).toBeInTheDocument();
    expect(screen.getByText("Task summary and statistics")).toBeInTheDocument();
    expect(
      screen.getByText("Complete task list with title and description")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Task status (completed/pending)")
    ).toBeInTheDocument();
    expect(screen.getByText("Creation dates")).toBeInTheDocument();
  });

  it("does not display priority-related features", () => {
    render(
      <PDFReport
        tasks={mockTasks}
        onGenerate={mockOnGenerate}
        isGenerating={false}
      />
    );

    expect(screen.queryByText("Priority breakdown")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Creation and due dates")
    ).not.toBeInTheDocument();
  });
});
