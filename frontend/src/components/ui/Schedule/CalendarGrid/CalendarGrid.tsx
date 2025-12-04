import React from "react";

type DayState = { disabled: boolean; available: boolean; iso: string };
type Props = {
  monthLabel: string;
  daysArray: (number | null)[];
  dayState: (dayNum: number | null) => DayState;
  selectedDateISO: string;
  canOpenCalendar: boolean;
  loadingMonth: boolean;
  onPickDay: (iso: string) => void;
  size?: "sm" | "md";
};

export const CalendarGrid: React.FC<Props> = ({
  monthLabel,
  daysArray,
  dayState,
  selectedDateISO,
  canOpenCalendar,
  loadingMonth,
  onPickDay,
  size = "sm",
}) => {
  const weekdays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const isSm = size === "sm";
  const containerClasses = isSm ? "mx-auto mt-6 w-full max-w-[380px]" : "mt-4 w-full";
  const cardClasses = isSm ? "rounded-xl border border-gray-200 bg-white shadow-sm" : "";
  const headerTitleClasses = isSm
    ? "text-cyan-700 text-[18px] font-medium text-center py-4"
    : "font-semibold text-[#213547] text-lg capitalize";
  const gridGap = isSm ? "gap-1.5" : "gap-2";
  const weekdayText = isSm ? "text-[11px]" : "text-xs";
  const weekdayColor = "text-gray-700";
  const sundayColor = isSm ? "text-gray-900" : "text-red-700";
  const cellBase = "relative grid place-items-center rounded-lg border transition select-none";
  const cellSize = isSm ? "aspect-square min-h-[42px]" : "aspect-square";
  const cellFont = isSm ? "text-[14px]" : "text-[clamp(1rem,3vw,1.2rem)]";

  return (
    <div className={containerClasses}>
      {loadingMonth ? (
        <div className={`h-56 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse mb-1 ${cardClasses}`} />
      ) : !canOpenCalendar ? (
        <p className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-3">
          Elegí especialidad y profesional para ver el calendario.
        </p>
      ) : (
        <div className={cardClasses}>
          {/* Encabezado del mes */}
          <div className={headerTitleClasses}>{monthLabel}</div>

          {/* Días de la semana */}
          <div className={`grid grid-cols-7 ${gridGap} px-4`}>
            {weekdays.map((w, i) => (
              <div
                key={i}
                className={`text-center ${weekdayText} ${i === 6 ? sundayColor : weekdayColor} font-semibold`}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Grilla de fechas */}
          <div className={`grid grid-cols-7 ${gridGap} p-4 pt-2`}>
            {daysArray.map((d, idx) => {
              const { disabled, available, iso } = dayState(d);
              const isSelected = iso && selectedDateISO === iso;

              const stateClasses = [
                disabled
                  ? "text-gray-400 bg-gray-100 border-gray-200"
                  : "text-[#213547] bg-white border-gray-200",
                available && !disabled ? "border-cyan-300" : "",
                isSelected ? "outline outline-2 outline-cyan-700 bg-cyan-600/10" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={idx}
                  type="button"
                  className={`${cellBase} ${cellSize} ${stateClasses} hover:border-cyan-400`}
                  disabled={disabled}
                  onClick={() => iso && onPickDay(iso)}
                >
                  <span className={cellFont}>{d ?? ""}</span>

                  {/* indicador de disponibilidad */}
                  {available && !disabled && !isSelected && (
                    <span className="absolute inset-x-2 bottom-1 h-1.5 rounded-full bg-cyan-600/80" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

