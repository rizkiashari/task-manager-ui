import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddTaskForm } from "../AddTaskForm";
import { useTaskForm } from "../../hooks/useTaskForm";
import { useTasks } from "../../hooks/useTasks";

// Mock the hooks
jest.mock("../../hooks/useTaskForm");
jest.mock("../../hooks/useTasks");

const mockUseTaskForm = useTaskForm as jest.MockedFunction<typeof useTaskForm>;
const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>;

describe("AddTaskForm", () => {
  const mockCreateTask = jest.fn();
  const mockUpdateField = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleConfirm = jest.fn();
  const mockHandleCancel = jest.fn();
  const mockResetForm = jest.fn();
  const mockValidateForm = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    mockUseTasks.mockReturnValue({
      createTask: mockCreateTask,
    } as unknown as ReturnType<typeof useTasks>);

    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "",
        description: "",
      },
      errors: [],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 0,
      descriptionCharacterCount: 0,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });
  });

  it("renders form with title and description fields", () => {
    render(<AddTaskForm />);

    expect(screen.getByLabelText(/Title \*/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Description \(Optional\)/)
    ).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("updates character count when typing", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Test",
        description: "Test Description",
      },
      errors: [],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 4,
      descriptionCharacterCount: 15,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(screen.getByText("4/100 characters")).toBeInTheDocument();
    expect(screen.getByText("15/500 characters")).toBeInTheDocument();
  });

  it("shows error when title is too short", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Te",
        description: "",
      },
      errors: ["Title must be at least 3 characters long"],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 2,
      descriptionCharacterCount: 0,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(
      screen.getByText("Title must be at least 3 characters long")
    ).toBeInTheDocument();
  });

  it("shows error when description is too long", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Valid Title",
        description: "a".repeat(501),
      },
      errors: ["Description must be less than 500 characters"],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 11,
      descriptionCharacterCount: 501,
      isTitleAtLimit: false,
      isDescriptionAtLimit: true,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(
      screen.getByText("Description must be less than 500 characters")
    ).toBeInTheDocument();
  });

  it("calls createTask when confirmed", async () => {
    mockCreateTask.mockResolvedValue({ success: true });
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Test Task",
        description: "Test Description",
      },
      errors: [],
      isSubmitting: false,
      showConfirm: true,
      titleCharacterCount: 9,
      descriptionCharacterCount: 15,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    // Use getAllByText to get the confirmation button specifically
    const confirmButtons = screen.getAllByText("Create Task");
    const confirmButton = confirmButtons[2]; // The confirmation dialog button
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockHandleConfirm).toHaveBeenCalledWith(mockCreateTask);
    });
  });

  it("shows confirmation dialog when form is submitted", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Test Task",
        description: "Test Description",
      },
      errors: [],
      isSubmitting: false,
      showConfirm: true,
      titleCharacterCount: 9,
      descriptionCharacterCount: 15,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    // Check for the confirmation dialog content
    expect(
      screen.getByText('Are you sure you want to create the task "Test Task"?')
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows loading state when submitting", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "Test Task",
        description: "Test Description",
      },
      errors: [],
      isSubmitting: true,
      showConfirm: false,
      titleCharacterCount: 9,
      descriptionCharacterCount: 15,
      isTitleAtLimit: false,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows maximum length warning when title reaches limit", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "a".repeat(100),
        description: "",
      },
      errors: [],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 100,
      descriptionCharacterCount: 0,
      isTitleAtLimit: true,
      isDescriptionAtLimit: false,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(screen.getByText("Character limit reached")).toBeInTheDocument();
  });

  it("shows maximum length warning when description reaches limit", () => {
    mockUseTaskForm.mockReturnValue({
      formData: {
        title: "",
        description: "a".repeat(500),
      },
      errors: [],
      isSubmitting: false,
      showConfirm: false,
      titleCharacterCount: 0,
      descriptionCharacterCount: 500,
      isTitleAtLimit: false,
      isDescriptionAtLimit: true,
      updateField: mockUpdateField,
      handleSubmit: mockHandleSubmit,
      handleConfirm: mockHandleConfirm,
      handleCancel: mockHandleCancel,
      resetForm: mockResetForm,
      validateForm: mockValidateForm,
    });

    render(<AddTaskForm />);

    expect(screen.getByText("Character limit reached")).toBeInTheDocument();
  });

  it("calls updateField when input changes", () => {
    render(<AddTaskForm />);

    const titleInput = screen.getByLabelText(/Title \*/);
    const descriptionInput = screen.getByLabelText(/Description \(Optional\)/);

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });

    expect(mockUpdateField).toHaveBeenCalledWith("title", "New Title");
    expect(mockUpdateField).toHaveBeenCalledWith(
      "description",
      "New Description"
    );
  });

  it("renders submit button", () => {
    render(<AddTaskForm />);

    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });
});
