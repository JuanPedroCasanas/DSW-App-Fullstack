import React from "react";

type Props = {
  title?: string;
  slots: string[];
  selectedSlot: string;
  loading: boolean;
  onPickSlot: (hhmm: string) => void;
};

export const SlotsCarousel: React.FC<Props> = ({
  title = "Horarios disponibles",
  slots,
  selectedSlot,
  loading,
  onPickSlot,
}) => {
  return (
    <div className="mt-6">
      <p className="text-sm text-[#213547] mb-2">{title}</p>

      {loading ? (
        <div className="h-14 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      ) : slots.length ? (
        <div className="grid grid-flow-col auto-cols-[max(120px,28%)] md:flex md:flex-wrap overflow-x-auto md:overflow-visible gap-2 pb-1 scroll-snap-x">
          {slots.map((h) => {
            const selected = selectedSlot === h;
            return (
              <button
                key={h}
                type="button"
                className={`px-3 py-2 min-h-11 rounded-lg border scroll-snap-start transition
                  ${
                    selected
                      ? "border-cyan-600 bg-cyan-50 text-cyan-800"
                      : "border-gray-300 bg-white text-[#213547] hover:border-cyan-400"
                  }`}
                onClick={() => onPickSlot(h)}
              >
                {h}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-3">
          No hay horarios libres para el día seleccionado.
        </div>
      )}
    </div>
  );
};
