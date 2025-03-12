"use client";

import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "success";
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant, ...props }) => {
  let variantCss =
    "rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  if (variant === "secondary")
    variantCss =
      "rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity";
  else if (variant === "success")
    variantCss =
      "rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity";
  return (
    <button className={clsx(variantCss, className)} {...props}>
      {children}
    </button>
  );
};
