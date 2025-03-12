"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
};
