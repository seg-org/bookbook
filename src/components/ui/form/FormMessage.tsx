"use client";

import React from "react";

interface FormMessageProps {
  children?: React.ReactNode;
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ children, className }) => {
  return <p className={`text-sm text-red-500 ${className}`}>{children}</p>;
};
