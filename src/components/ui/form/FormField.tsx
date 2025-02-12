import React from "react";
import { Controller, ControllerRenderProps, FieldValues, Path, useFormContext } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  render: (props: { field: ControllerRenderProps<T, Path<T>> }) => React.ReactNode;
}

export const FormField = <T extends FieldValues>({ name, render }: FormFieldProps<T>) => {
  const { control } = useFormContext<T>();

  return <Controller name={name} control={control} render={({ field }) => render({ field })} />;
};
