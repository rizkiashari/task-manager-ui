import { useState, useCallback } from "react";

export interface TaskFormData {
  title: string;
  description: string;
  end_date: string;
  start_date: string;
  pic_name: string;
}

export interface TaskFormValidation {
  isValid: boolean;
  errors: string[];
}

export const useTaskForm = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    end_date: "",
    start_date: "",
    pic_name: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation rules
  const validateForm = useCallback((): TaskFormValidation => {
    const newErrors: string[] = [];

    // Title validation
    if (!formData.title.trim()) {
      newErrors.push("Title is required");
    } else if (formData.title.trim().length < 3) {
      newErrors.push("Title must be at least 3 characters long");
    } else if (formData.title.trim().length > 100) {
      newErrors.push("Title must be less than 100 characters");
    }

    // Description validation
    if (formData.description.trim().length > 500) {
      newErrors.push("Description must be less than 500 characters");
    }

    setErrors(newErrors);
    return {
      isValid: newErrors.length === 0,
      errors: newErrors,
    };
  }, [formData]);

  // Update form field
  const updateField = useCallback(
    (field: keyof TaskFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear errors when user starts typing
      if (errors.length > 0) {
        setErrors([]);
      }
    },
    [errors]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateForm();
      if (validation.isValid) {
        setShowConfirm(true);
      }
    },
    [validateForm]
  );

  // Handle confirmation
  const handleConfirm = useCallback(
    async (
      onConfirm: (
        data: TaskFormData
      ) => Promise<{ success: boolean; error?: string }>
    ) => {
      setIsSubmitting(true);

      try {
        const result = await onConfirm(formData);

        if (result.success) {
          // Reset form on success
          setFormData({
            title: "",
            description: "",
            end_date: "",
            start_date: "",
            pic_name: "",
          });
          setShowConfirm(false);
          setErrors([]);
        } else {
          setErrors([result.error || "Failed to create task"]);
        }
      } catch {
        setErrors(["An unexpected error occurred"]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    setShowConfirm(false);
    setErrors([]);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      end_date: "",
      start_date: "",
      pic_name: "",
    });
    setErrors([]);
    setIsSubmitting(false);
    setShowConfirm(false);
  }, []);

  // Character count helpers
  const getTitleCharacterCount = useCallback(() => {
    return formData.title.length;
  }, [formData.title]);

  const getDescriptionCharacterCount = useCallback(() => {
    return formData.description.length;
  }, [formData.description]);

  const isTitleAtLimit = useCallback(() => {
    return formData.title.length >= 100;
  }, [formData.title]);

  const isDescriptionAtLimit = useCallback(() => {
    return formData.description.length >= 500;
  }, [formData.description]);

  return {
    // State
    formData,
    errors,
    isSubmitting,
    showConfirm,

    // Computed values
    titleCharacterCount: getTitleCharacterCount(),
    descriptionCharacterCount: getDescriptionCharacterCount(),
    isTitleAtLimit: isTitleAtLimit(),
    isDescriptionAtLimit: isDescriptionAtLimit(),

    // Actions
    updateField,
    handleSubmit,
    handleConfirm,
    handleCancel,
    resetForm,
    validateForm,
  };
};
