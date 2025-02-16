import React, { useState } from "react";

export function Select({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <select
      className="border rounded-lg px-3 py-2 w-full"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onValueChange(e.target.value);
      }}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <div className="border p-2 rounded-md">{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 border rounded-md p-2">{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}