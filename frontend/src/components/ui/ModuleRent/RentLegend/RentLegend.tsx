import React from "react";
import { rentColors } from "@/components/ui";

export const RentLegend: React.FC = () => {
  const Item = ({ color, label }: { color: string; label: string }) => (
    <span className="inline-flex items-center gap-2">
      <i
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: "0 0 0 1px rgba(0,0,0,.08)",
        }}
      />
      {label}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 text-[12px] text-gray-700">
      <Item color={rentColors.available}   label="Disponible" />
      <Item color={rentColors.mine}        label="Alquilado por vos" />
      <Item color={rentColors.reserved}    label="Ocupado por otro" />
      <Item color={rentColors.unavailable} label="No disponible" />
    </div>
  );
};

export default RentLegend;


