import { useState } from "react";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (toast: Toast) => {
    setToast(toast);
    setTimeout(() => setToast(null), 3000); // Auto-dismiss after 3 seconds
  };

  return { toast, showToast };
};
