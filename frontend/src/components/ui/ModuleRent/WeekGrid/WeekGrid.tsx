import React from "react";
import type { DayKey, SlotId, SlotState, Availability } from "@/pages/ModuleRent/moduleRentTypes";
import { rentColors, rentBackgrounds } from "@/components/ui";

type Props = {
  days: DayKey[];
  dayLabels: Record<DayKey, string>;
  hours: string[];
  availability: Availability;
  selected: Set<SlotId>;
  isSelectable: (s: SlotState) => boolean;
  onClickSlot: (id: SlotId) => void;
  add60: (hhmm: string) => string;
};

export const WeekGrid: React.FC<Props> = ({
  days,
  dayLabels,
  hours,
  availability,
  selected,
  isSelectable,
  onClickSlot,
  add60,
}) => {
  const gridCols =
    "grid-cols-[72px_repeat(6,minmax(110px,1fr))] md:grid-cols-[80px_repeat(6,minmax(120px,1fr))]";

  const styleFor = (state: SlotState, isSel: boolean): React.CSSProperties => {
    let bg = rentBackgrounds.unavailable;
    let border = rentColors.unavailable;
    let text = "#213547";

    switch (state) {
      case "available":
        bg = rentBackgrounds.available;
        border = rentColors.available;
        break;
      case "mine":
        bg = rentBackgrounds.mine;
        border = rentColors.mine;
        text = "#0f3d40";
        break;
      case "reserved":
        bg = rentBackgrounds.reserved;
        border = rentColors.reserved;
        text = "#5f3b00";
        break;
      default:
        bg = rentBackgrounds.unavailable;
        border = rentColors.unavailable;
        text = "#6b7280"; 
        break;
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      color: text,
      outline: isSel ? `2px solid ${rentColors.outline}` : undefined,
      outlineOffset: isSel ? -2 : undefined,
    };
  };

  const baseClasses =
    "relative grid place-items-center rounded-lg border transition select-none text-[12px] px-2 py-2";

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className={`grid ${gridCols}`}>
        <div className="sticky top-0 left-0 z-10 bg-white" />
        {days.map((d) => (
          <div
            key={d}
            className="sticky top-0 z-10 bg-white grid place-items-center font-semibold text-[13px] px-2 py-3"
          >
            {dayLabels[d]}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className={`grid ${gridCols}`}>
        {hours.map((h) => (
          <React.Fragment key={h}>
            {/* Columna de hora */}
            <div className="sticky left-0 z-10 bg-white grid place-items-center text-[12px] text-gray-600 px-2 py-2">
              {h}
            </div>

            {/* Celdas por día */}
            {days.map((d) => {
              const state = availability[d][h];
              const id: SlotId = `${d}-${h}`;
              const selectable = isSelectable(state);
              const isSel = selected.has(id);

              return (
                <button
                  key={id}
                  type="button"
                  className={`${baseClasses} ${selectable ? "cursor-pointer" : "cursor-not-allowed opacity-90"}`}
                  style={styleFor(state, isSel)}
                  onClick={() => onClickSlot(id)}
                  disabled={!selectable}
                >
                  <span className="opacity-70 text-[11px]">
                    {h} - {add60(h)}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

