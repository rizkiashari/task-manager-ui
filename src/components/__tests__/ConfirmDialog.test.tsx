import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Test Dialog",
    message: "Are you sure?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render when isOpen is true", () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when cancel button is clicked", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it("should use custom button text", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
      />
    );

    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("No, Keep")).toBeInTheDocument();
  });

  it("should apply danger styles by default", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-red-600");
  });

  it("should apply success styles when type is success", () => {
    render(<ConfirmDialog {...defaultProps} type="success" />);

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-green-600");
  });

  it("should apply warning styles when type is warning", () => {
    render(<ConfirmDialog {...defaultProps} type="warning" />);

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveClass("bg-yellow-600");
  });

  it("should display the correct message with task title", () => {
    const message = 'Are you sure you want to delete the task "Test Task"?';
    render(<ConfirmDialog {...defaultProps} message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("should have proper button structure", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    const cancelButton = screen.getByText("Cancel");

    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("should close dialog after confirmation", () => {
    render(<ConfirmDialog {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
