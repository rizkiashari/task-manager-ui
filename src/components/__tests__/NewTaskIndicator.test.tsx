import React from "react";
import { render, screen } from "@testing-library/react";
import { NewTaskIndicator } from "../NewTaskIndicator";

describe("NewTaskIndicator", () => {
  it("should render with correct count", () => {
    render(<NewTaskIndicator count={3} />);

    expect(screen.getByText("New Tasks (3)")).toBeInTheDocument();
  });

  it("should render with count of 1", () => {
    render(<NewTaskIndicator count={1} />);

    expect(screen.getByText("New Tasks (1)")).toBeInTheDocument();
  });

  it("should render with count of 0", () => {
    render(<NewTaskIndicator count={0} />);

    expect(screen.getByText("New Tasks (0)")).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    render(<NewTaskIndicator count={2} />);

    const indicator = screen.getByText("New Tasks (2)");
    const container = indicator.closest("div");

    expect(container).toHaveClass("flex", "items-center");
  });

  it("should have animated pulse indicator", () => {
    render(<NewTaskIndicator count={1} />);

    const pulseElement =
      screen.getByText("New Tasks (1)").previousElementSibling;
    expect(pulseElement).toHaveClass("animate-pulse");
  });

  it("should have blue color scheme", () => {
    render(<NewTaskIndicator count={1} />);

    const textElement = screen.getByText("New Tasks (1)");
    expect(textElement).toHaveClass("text-blue-700");
  });

  it("should be accessible", () => {
    render(<NewTaskIndicator count={2} />);

    const indicator = screen.getByText("New Tasks (2)");
    expect(indicator).toBeInTheDocument();
  });

  it("should handle large numbers", () => {
    render(<NewTaskIndicator count={999} />);

    expect(screen.getByText("New Tasks (999)")).toBeInTheDocument();
  });

  it("should maintain consistent layout", () => {
    const { rerender } = render(<NewTaskIndicator count={1} />);

    expect(screen.getByText("New Tasks (1)")).toBeInTheDocument();

    rerender(<NewTaskIndicator count={10} />);

    expect(screen.getByText("New Tasks (10)")).toBeInTheDocument();
  });
});
