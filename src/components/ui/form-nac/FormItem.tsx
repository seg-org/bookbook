"use client";

import React from "react";

interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export const FormItem: React.FC<FormItemProps> = ({ children, className }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};
