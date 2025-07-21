import { renderHook, act } from "@testing-library/react";
import { useTaskForm } from "../useTaskForm";

describe("useTaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with empty form data", () => {
    const { result } = renderHook(() => useTaskForm());

    expect(result.current.formData).toEqual({
      title: "",
      description: "",
    });
  });

  it("should update form fields", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "New Task");
    });

    expect(result.current.formData.title).toBe("New Task");
    expect(result.current.titleCharacterCount).toBe(8);
  });

  it("should update description field", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("description", "New Description");
    });

    expect(result.current.formData.description).toBe("New Description");
    expect(result.current.descriptionCharacterCount).toBe(15);
  });

  it("should clear errors when updating fields", () => {
    const { result } = renderHook(() => useTaskForm());

    // First, trigger an error by submitting empty form
    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.errors.length).toBeGreaterThan(0);

    // Then update a field to clear errors
    act(() => {
      result.current.updateField("title", "New Task");
    });

    expect(result.current.errors).toHaveLength(0);
  });

  it("should validate required title", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.errors).toContain("Title is required");
    expect(result.current.showConfirm).toBe(false);
  });

  it("should validate title minimum length", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Te");
    });

    // Call validateForm directly to test validation logic
    let validation;
    act(() => {
      validation = result.current.validateForm();
    });
    expect(validation!.errors).toContain(
      "Title must be at least 3 characters long"
    );
  });

  it("should validate title maximum length", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "a".repeat(101));
    });

    // Call validateForm directly to test validation logic
    let validation;
    act(() => {
      validation = result.current.validateForm();
    });
    expect(validation!.errors).toContain(
      "Title must be less than 100 characters"
    );
  });

  it("should validate description maximum length", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Valid Title");
      result.current.updateField("description", "a".repeat(501));
    });

    // Call validateForm directly to test validation logic
    let validation;
    act(() => {
      validation = result.current.validateForm();
    });
    expect(validation!.errors).toContain(
      "Description must be less than 500 characters"
    );
  });

  it("should show confirmation dialog for valid form", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Valid Title");
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.showConfirm).toBe(true);
    expect(result.current.errors).toHaveLength(0);
  });

  it("should handle successful confirmation", async () => {
    const { result } = renderHook(() => useTaskForm());
    const mockOnConfirm = jest.fn().mockResolvedValue({ success: true });

    act(() => {
      result.current.updateField("title", "Valid Title");
      result.current.updateField("description", "Valid Description");
    });

    await act(async () => {
      await result.current.handleConfirm(mockOnConfirm);
    });

    expect(mockOnConfirm).toHaveBeenCalledWith({
      title: "Valid Title",
      description: "Valid Description",
    });
    expect(result.current.formData.title).toBe("");
    expect(result.current.formData.description).toBe("");
    expect(result.current.showConfirm).toBe(false);
    expect(result.current.errors).toHaveLength(0);
  });

  it("should handle failed confirmation", async () => {
    const { result } = renderHook(() => useTaskForm());
    const mockOnConfirm = jest.fn().mockResolvedValue({
      success: false,
      error: "Failed to create task",
    });

    act(() => {
      result.current.updateField("title", "Valid Title");
    });

    await act(async () => {
      await result.current.handleConfirm(mockOnConfirm);
    });

    expect(result.current.errors).toContain("Failed to create task");
    expect(result.current.formData.title).toBe("Valid Title"); // Should not reset on failure
  });

  it("should handle confirmation error", async () => {
    const { result } = renderHook(() => useTaskForm());
    const mockOnConfirm = jest
      .fn()
      .mockRejectedValue(new Error("Network error"));

    act(() => {
      result.current.updateField("title", "Valid Title");
    });

    await act(async () => {
      await result.current.handleConfirm(mockOnConfirm);
    });

    expect(result.current.errors).toContain("An unexpected error occurred");
  });

  it("should cancel confirmation", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Valid Title");
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.showConfirm).toBe(true);

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.showConfirm).toBe(false);
    expect(result.current.errors).toHaveLength(0);
  });

  it("should reset form", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Test Title");
      result.current.updateField("description", "Test Description");
    });

    expect(result.current.formData.title).toBe("Test Title");
    expect(result.current.formData.description).toBe("Test Description");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.title).toBe("");
    expect(result.current.formData.description).toBe("");
    expect(result.current.errors).toHaveLength(0);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.showConfirm).toBe(false);
  });

  it("should track character limits correctly", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "a".repeat(100));
      result.current.updateField("description", "a".repeat(500));
    });

    expect(result.current.isTitleAtLimit).toBe(true);
    expect(result.current.isDescriptionAtLimit).toBe(true);
    expect(result.current.titleCharacterCount).toBe(100);
    expect(result.current.descriptionCharacterCount).toBe(500);
  });

  it("should not be at limit for normal text", () => {
    const { result } = renderHook(() => useTaskForm());

    act(() => {
      result.current.updateField("title", "Normal Title");
      result.current.updateField("description", "Normal Description");
    });

    expect(result.current.isTitleAtLimit).toBe(false);
    expect(result.current.isDescriptionAtLimit).toBe(false);
  });
});
