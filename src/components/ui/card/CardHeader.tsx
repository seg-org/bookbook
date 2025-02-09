import React from "react";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={`mb-4 border-b pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
};
