import React from "react";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className, ...props }) => {
  return (
    <div className={`text-muted-foreground text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};
