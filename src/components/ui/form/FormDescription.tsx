import React from "react";

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({ children, className }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};
