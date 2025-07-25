import { useState, useEffect, useCallback } from 'react';
import { z, type ZodType, type ZodTypeDef } from 'zod';

type FormFieldValue = string | number | boolean | File | null | undefined | string[];

type FormValues = {
  [key: string]: FormFieldValue | FormValues;
};

type FormState<T> = {
  values: T;
  errors: Record<keyof T, string | undefined>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
};

type FormOptions<T extends FormValues> = {
  initialValues: T;
  validationSchema?: ZodType<T, ZodTypeDef, T>;
  onSubmit: (values: T) => Promise<void> | void;
};

export function useForm<T extends FormValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: FormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {} as Record<keyof T, string | undefined>,
    isDirty: false,
    isValid: false,
    isSubmitting: false,
  });

  const validate = useCallback(
    async (values: T) => {
      if (!validationSchema) return {};

      try {
        await validationSchema.parseAsync(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors.reduce((acc, curr) => {
            const key = curr.path[0] as keyof T;
            return {
              ...acc,
              [key]: curr.message,
            };
          }, {} as Record<keyof T, string>);
        }
        return {};
      }
    },
    [validationSchema]
  );

  useEffect(() => {
    const checkValidity = async () => {
      const errors = await validate(state.values);
      const isValid = Object.keys(errors).length === 0;
      setState((prev) => ({
        ...prev,
        errors: errors as Record<keyof T, string | undefined>,
        isValid,
      }));
    };

    checkValidity();
  }, [state.values, validate]);

  const handleChange = useCallback(
    (name: keyof T) => (value: T[keyof T]) => {
      setState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
        isDirty: true,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      const errors = await validate(state.values);
      const isValid = Object.keys(errors).length === 0;
      
      setState((prev) => ({
        ...prev,
        errors: errors as Record<keyof T, string | undefined>,
        isDirty: true,
        isValid,
      }));

      if (!isValid) return;

      try {
        setState((prev) => ({ ...prev, isSubmitting: true }));
        await onSubmit(state.values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [onSubmit, state.values, validate]
  );

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {} as Record<keyof T, string | undefined>,
      isDirty: false,
      isValid: false,
      isSubmitting: false,
    });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    isDirty: state.isDirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue: <K extends keyof T>(name: K, value: T[K]) => {
      handleChange(name)(value);
    },
  };
}

export default useForm;
