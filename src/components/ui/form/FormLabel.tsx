import React from "react";

interface FormLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, className }) => {
  return <label className={`block text-sm font-medium ${className}`}>{children}</label>;
};
