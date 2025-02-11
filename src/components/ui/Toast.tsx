import { useToast } from "@/hooks/useToast";

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 text-white shadow-lg ${
            toast.variant === "destructive" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
        </div>
      ))}
    </div>
  );
}
