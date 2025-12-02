import React from "react";

type TableProps = {
  headers: string[];
  children: React.ReactNode; // filas <tr>
};

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-cyan-50">
            {headers.map((h) => (
              <th key={h} className="text-left font-bold text-[#213547] px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[#213547]">{children}</tbody>
      </table>
    </div>
  );
}
