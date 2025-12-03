import React from "react";

type DialogActionsProps = {
  children: React.ReactNode;
  columns?: 2 | 3; // por si algún modal futuro usa 3 acciones
  className?: string;
};

export default function DialogActions({ children, columns = 2, className = "" }: DialogActionsProps) {
  const cols = columns === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div className={`grid ${cols} gap-[10px] mt-[10px] ${className}`}>{children}</div>
  );
}
