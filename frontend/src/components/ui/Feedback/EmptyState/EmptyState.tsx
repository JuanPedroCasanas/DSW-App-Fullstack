import React from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-cyan-300 rounded-xl p-7 text-center grid gap-3 bg-white">
      {icon && <div className="mx-auto">{icon}</div>}
      <h2 className="text-xl font-semibold text-[#213547]">{title}</h2>
      <p className="text-gray-600">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
