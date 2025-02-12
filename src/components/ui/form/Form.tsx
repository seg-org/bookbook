/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface FormProps {
  children: React.ReactNode;
  form: UseFormReturn<any>;
  onSubmit: SubmitHandler<any>;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ children, form, onSubmit, className }) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};
