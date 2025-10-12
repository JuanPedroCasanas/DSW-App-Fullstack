import React, { useMemo, useRef, useState } from "react";
import "./moduleRent.css";

// OJOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
// ESTO DEBERIA DEVOLVER EL MES Y EL AÑO!!!!!!!!!!!!!!!!!!!!!
// 100% necesario para el backend que ademas de todo DEVUELVA ESO !!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11

type DayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab";
type SlotState = "available" | "mine" | "reserved" | "unavailable";
type SlotId = `${DayKey}-${string}`;
type Availability = Record<DayKey, Record<string, SlotState>>;

const DAYS: DayKey[] = ["lun", "mar", "mie", "jue", "vie", "sab"];
const DAY_LABELS: Record<DayKey, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
};

/** Filas de la grilla: 08:00 → 20:00 (inclusive) */
const HOURS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00",
];

/** Reglas de disponibilidad (según Axure):
 *  - Lun–Vie: 14..20 habilitado (inclusive)
 *  - Sáb: 08..12 habilitado (inclusive)
 */
const isAllowed = (day: DayKey, hour: string): boolean => {
  const H = Number(hour.slice(0, 2));
  if (day === "sab") return H >= 8 && H <= 12;
  return H >= 14 && H <= 20;
};



// Mock de consultorios para UI
const CONSULTORIOS = [
  { id: "c1", name: "Consultorio 1" },
  { id: "c2", name: "Consultorio 2" },
  { id: "c3", name: "Consultorio 3" },
];

// Construye disponibilidad base (sin “ejemplos” para evitar confusión visual)
const buildBaseAvailability = (): Availability => {
  const base: Availability = { lun: {}, mar: {}, mie: {}, jue: {}, vie: {}, sab: {} };
  DAYS.forEach((d) => {
    HOURS.forEach((h) => {
      base[d][h] = isAllowed(d, h) ? "available" : "unavailable";
    });
  });

    // Horarios de prueba
  base.lun["15:00"] = "reserved"; // Ocupado por otro
  base.mie["18:00"] = "mine";     // Alquilado por vos
  base.sab["10:00"] = "reserved"; // Ocupado por otro



  return base;
};


export default function ModuleRent() {
  const [consultorioId, setConsultorioId] = useState(CONSULTORIOS[0].id);
  const [availability] = useState<Availability>(() => buildBaseAvailability());
  const [selected, setSelected] = useState<Set<SlotId>>(new Set());

  // Drag / long-press + tap corto en mobile
  const dragRef = useRef<{
    active: boolean;
    day?: DayKey;
    startIndex?: number;
    timer?: number | null;
    pendingId?: SlotId;
    longPress?: boolean;
  }>({ active: false, day: undefined, startIndex: undefined, timer: null, pendingId: undefined, longPress: false });

  const isSelectable = (state: SlotState) => state === "available";

  const toggleOne = (id: SlotId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id); // lo tengo que corregir, no se por qué tira error
      return next;
    });
  };

  const selectRangeSameDay = (day: DayKey, i1: number, i2: number) => {
    const [from, to] = i1 <= i2 ? [i1, i2] : [i2, i1];
    const next = new Set<SlotId>(selected);
    for (let i = from; i <= to; i++) {
      const hour = HOURS[i];
      const st = availability[day][hour];
      if (isSelectable(st)) next.add(`${day}-${hour}`);
    }
    setSelected(next);
  };

  const clearSelection = () => setSelected(new Set());

  const selectionSummary = useMemo(() => {
    const items = Array.from(selected).map((id) => {
      const [day, hour] = id.split("-") as [DayKey, string];
      return { id, day, hour, end: add60(hour) };
    });
    items.sort((a, b) => {
      const d = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
      return d !== 0 ? d : timeToMin(a.hour) - timeToMin(b.hour);
    });
    return items;
  }, [selected]);

  const onConfirm = () => {
    const payload = selectionSummary.map(({ day, hour }) => ({
      consultorioId, day, start: hour, end: add60(hour),
    }));
    // eslint-disable-next-line no-console
    console.log("ALQUILAR (payload):", payload);
  };

  return (
    <section className="moduleRent" aria-labelledby="moduleRent-title">
      <header className="moduleRent__controls">
        <h2 id="moduleRent-title" className="moduleRent__title">Alquiler de consultorios</h2>

        <div className="moduleRent__filters">
          <label className="field">
            <span className="field__label">Consultorio</span>
            <select
              className="field__select"
              value={consultorioId}
              onChange={(e) => setConsultorioId(e.target.value)}
              aria-label="Seleccionar consultorio"
            >
              {CONSULTORIOS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

     {/*probablemente saque este botón de acá, lo dejo por el mometno */}
          <button type="button" className="btn btn--ghost" onClick={clearSelection} aria-label="Borrar selección">
            Limpiar
          </button>
        </div>

        <div className="moduleRent__legend" aria-label="Leyenda de estados">
          <span><i className="dot dot--available" /> Disponible</span>
          <span><i className="dot dot--mine" /> Alquilado por vos</span>
          <span><i className="dot dot--reserved" /> Ocupado por otro</span>
          <span><i className="dot dot--unavailable" /> No disponible</span>
        </div>
      </header>

      {/* ÚNICA GRILLA: 1 col de horas + 6 días (Lun–Sáb) */}
      <div className="schedule" role="grid" aria-label="Disponibilidad semanal (Lun–Sáb)">
        <div className="schedule__corner" aria-hidden />

        {DAYS.map((d) => (
          <div key={d} role="columnheader" className="schedule__dayHeader">
            {DAY_LABELS[d]}
          </div>
        ))}

        {HOURS.map((h, rowIdx) => (
          <React.Fragment key={h}>
            <div role="rowheader" className="schedule__hourLabel">{h}</div>

            {DAYS.map((d) => {
              const state = availability[d][h];
              const id: SlotId = `${d}-${h}`;
              const selectable = isSelectable(state);
              const isSelected = selected.has(id);

              // Pointer handlers: drag en desktop, long-press para rango en mobile,
              // y tap corto en mobile para toggle simple
              const onPointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
                if (!selectable) return;
                const isTouch = e.pointerType === "touch";

                dragRef.current.active = !isTouch; // en mouse activamos ya
                dragRef.current.day = d;
                dragRef.current.startIndex = rowIdx;
                dragRef.current.longPress = false;
                dragRef.current.pendingId = isTouch ? id : undefined;

                (e.target as HTMLElement).setPointerCapture(e.pointerId);

                if (isTouch) {
                  dragRef.current.timer = window.setTimeout(() => {
                    dragRef.current.active = true;   // entra a modo rango
                    dragRef.current.longPress = true;
                    selectRangeSameDay(d, rowIdx, rowIdx);
                  }, 250);
                } else {
                  toggleOne(id); // click inmediato en desktop
                }
              };

              const onPointerEnter: React.PointerEventHandler<HTMLButtonElement> = () => {
                if (
                  dragRef.current.active &&
                  dragRef.current.day === d &&
                  dragRef.current.startIndex != null
                ) {
                  selectRangeSameDay(d, dragRef.current.startIndex, rowIdx);
                }
              };

              const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
                // Si fue tap corto en mobile (no long-press), togglear aquí
                if (dragRef.current.timer) {
                  window.clearTimeout(dragRef.current.timer);
                  dragRef.current.timer = null;
                  if (!dragRef.current.longPress && dragRef.current.pendingId === id && selectable) {
                    toggleOne(id);
                  }
                }
                dragRef.current.active = false;
                dragRef.current.day = undefined;
                dragRef.current.startIndex = undefined;
                dragRef.current.pendingId = undefined;
                dragRef.current.longPress = false;
                try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {} //tambien debo corregir
              };

              return (
                <button
                  key={id}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  className={[
                    "slot",
                    selectable ? "is-selectable" : "is-disabled",
                    stateClass(state),
                  ].join(" ")}
                  onPointerDown={onPointerDown}
                  onPointerEnter={onPointerEnter}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  <span className="slot__time" aria-hidden>{h}</span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="moduleRent__footer">
        {selectionSummary.length > 0 && (
          <div className="moduleRent__summary" aria-live="polite">
            <div className="summary__title">Seleccionaste</div>
            <ul className="summary__list">
              {selectionSummary.map(({ id, day, hour, end }) => (
                <li key={id} className="summary__item">
                  <span className="summary__dot" aria-hidden /> {DAY_LABELS[day]} {hour}–{end}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          className="btn btn--primary"
          disabled={selectionSummary.length === 0}
          onClick={onConfirm}
        >
          ALQUILAR ({selectionSummary.length})
        </button>

        <button type="button" className="btn btn--ghost" onClick={clearSelection} aria-label="Borrar selección">
            Limpiar
        </button>

      </div>
    </section>
  );
}

/* ===== Helpers ===== */
function stateClass(s: SlotState): string {
  switch (s) {
    case "available":  return "is-available";
    case "mine":       return "is-mine";
    case "reserved":   return "is-reserved";
    default:           return "is-unavailable";
  }
}
function add60(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const date = new Date(2000, 0, 1, hh, mm);
  date.setMinutes(date.getMinutes() + 60);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
function timeToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
