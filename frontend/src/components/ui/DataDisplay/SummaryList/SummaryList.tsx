import React from "react";

type SummaryItem = { label: string; value: string };
type SummaryListProps = { items: SummaryItem[] };

export default function SummaryList({ items }: SummaryListProps) {
  return (
    <ul className="list-none p-0 m-0 grid gap-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-[#213547]">
          <strong className="font-semibold">{item.label}:</strong> {item.value}
        </li>
      ))}
    </ul>
  );
}
