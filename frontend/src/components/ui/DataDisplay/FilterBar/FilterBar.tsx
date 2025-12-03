import React from "react";
import { Card } from "@/components/ui"; 

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-end">
        {children}
      </div>
    </Card>
  );
}

