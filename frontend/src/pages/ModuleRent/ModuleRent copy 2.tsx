import React, { useEffect, useMemo, useRef, useState } from "react";
import "./moduleRent.css";
import { Availability, DayKey, Professional, SlotId, SlotState } from "./moduleRentTypes";


const DAYS: DayKey[] = ["lun", "mar", "mie", "jue", "vie", "sab"];
const DAY_LABELS: Record<DayKey, string> = {
  lun: "Lunes",
  mar: "Martes",
  mie: "Miércoles",
  jue: "Jueves",
  vie: "Viernes",
  sab: "Sábado",
};

const HOURS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00",
];

const isAllowed = (day: DayKey, hour: string): boolean => {
  const H = Number(hour.slice(0, 2));
  if (day === "sab") return H >= 8 && H <= 12; // sábados 8–12
  return H >= 8 && H <= 20; // lunes a viernes 8–20
};

const CONSULTORIOS = [
  { id: "1", name: "Consultorio 1" },
  { id: "2", name: "Consultorio 2" },
  { id: "3", name: "Consultorio 3" },
];

// helper para mapear el número del backend (1–6) al día string
const numToDay = (n: number): DayKey => DAYS[n - 1] ?? "lun";

// helper para sumar 60 min a un hh:mm
const add60 = (hhmm: string): string => {
  const [hh, mm] = hhmm.split(":").map(Number);
  const date = new Date(2000, 0, 1, hh, mm);
  date.setMinutes(date.getMinutes() + 60);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

// construir disponibilidad base
const buildBaseAvailability = (): Availability => {
  const base: Availability = { lun: {}, mar: {}, mie: {}, jue: {}, vie: {}, sab: {} };
  DAYS.forEach((d) => {
    HOURS.forEach((h) => {
      base[d][h] = isAllowed(d, h) ? "available" : "unavailable";
    });
  });
  return base;
};

export default function ModuleRent() {
  const [consultingRoomId, setconsultingRoomId] = useState(CONSULTORIOS[0].id);
  const [availability, setAvailability] = useState<Availability>(buildBaseAvailability);
  const [selected, setSelected] = useState<Set<SlotId>>(new Set());
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  const [rangeStart, setRangeStart] = useState<SlotId | null>(null);


  //Desplegable de profesionales
   useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch("http://localhost:2000/Professional/getAll?includeInactive=false");
        const data: Professional[] = await res.json();
        setProfessionals(data);
        if (data.length) setSelectedProfessionalId(data[0].id); // seleccionar el primero por defecto
      } catch (err) {
        console.error("Error al cargar profesionales activos:", err);
      }
    };
    fetchProfessionals();
  }, []);

  // === FETCH DE MÓDULOS DEL BACKEND ===
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(`http://localhost:2000/Module/getCurrentMonthModulesByConsultingRoom/${consultingRoomId}`);
        const modules = await res.json();
        const next = buildBaseAvailability();
        
        modules.forEach((mod: any) => {
          const day = numToDay(mod.day);
          const start = mod.startTime.slice(0, 5);
          const end = mod.endTime.slice(0, 5);

          let h = start;
          while (h < end) {
            if (HOURS.includes(h)) {
              // marcar según si el módulo pertenece al profesional seleccionado
              next[day][h] = mod.professional === selectedProfessionalId ? "mine" : "reserved";
            }
            h = add60(h);
          }
        });

        // marcar sábados desde 13:00 como "unavailable"
        HOURS.forEach((h) => {
          const H = Number(h.slice(0, 2));
          if (H >= 13) next.sab[h] = "unavailable";
        });

        setAvailability(next);
        
      } catch (err) {
        console.error("Error al cargar módulos:", err);
      }
    };

    fetchModules();
    
  }, [consultingRoomId, selectedProfessionalId]);;

  // === lógica de selección ===
  const isSelectable = (state: SlotState) => state === "available";
  const toggleOne = (id: SlotId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());
  const selectionSummary = useMemo(() => {
    const items = Array.from(selected).map((id) => {
      const [day, hour] = id.split("-") as [DayKey, string];
      return { id, day, hour, end: add60(hour) };
    });
    items.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
    return items;
  }, [selected]);


const selectRange = (clickedId: SlotId) => {
  const [clickedDay, clickedHour] = clickedId.split("-") as [DayKey, string];

  if (!rangeStart) {
    setRangeStart(clickedId);
    setSelected(new Set([clickedId]));
    return;
  }

  const [startDay, startHour] = rangeStart.split("-") as [DayKey, string];

  if (clickedDay !== startDay) {
    // No cruzar días
    return;
  }

  const dayHours = HOURS.filter(h => availability[startDay][h] === "available" || availability[startDay][h] === "mine");

  const startIndex = dayHours.indexOf(startHour);
  const endIndex = dayHours.indexOf(clickedHour);

  if (startIndex === -1 || endIndex === -1) return;

  const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

  // verificar que no haya ningún slot reservado en el rango
  for (let i = from; i <= to; i++) {
    const state = availability[startDay][dayHours[i]];
    if (state === "reserved") {
      return; // rango invalido
    }
  }

  const newSelected = new Set<SlotId>();
  for (let i = from; i <= to; i++) {
    newSelected.add(`${startDay}-${dayHours[i]}`);
  }

  setSelected(newSelected);
};




  const onConfirm = async () => {
  if (!selected.size) return;

  // Agrupo por día
  const slotsByDay: Record<DayKey, string[]> = {
    lun: [],
    mar: [],
    mie: [],
    jue: [],
    vie: [],
    sab: []
  };
  selected.forEach(id => {
    const [day, hour] = id.split("-") as [DayKey, string];
    if (!slotsByDay[day]) slotsByDay[day] = [];
    slotsByDay[day].push(hour);
  });

  // Validar que solo haya un día
  const days = Object.keys(slotsByDay);
  if (days.length > 1) {
    alert("No se puede seleccionar más de un día a la vez.");
    return;
  }

  const day = days[0] as DayKey;
  const hours = slotsByDay[day].sort();

  // Validar que no haya slots reservados por otros profesionales
  for (const h of hours) {
    if (availability[day][h] === "reserved") {
      alert("No se puede seleccionar un horario que ya esté ocupado por otro profesional.");
      return;
    }
  }

  // Preparar payload
  const startTime = hours[0];
  const endTime = add60(hours[hours.length - 1]);

  const today = new Date();
  const payload = {
    day: DAYS.indexOf(day) + 1, // de 1 a 6
    startTime,
    endTime,
    validMonth: today.getMonth() + 1, // 1–12
    validYear: today.getFullYear(),
    idProfessional: selectedProfessionalId,
    idConsultingRoom: consultingRoomId,
  };

  try {
    const res = await fetch("http://localhost:2000/Module/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al reservar módulo");

    alert("Módulo reservado correctamente");
    clearSelection();
    // opcional: refrescar disponibilidad
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

  return (
    <section className="moduleRent">
      <header className="moduleRent__controls">
        <h2>Alquiler de modulos</h2>
        <div className="moduleRent__filters">
          <label className="field">
            <span className="field__label">Consultorio</span>
            <select value={consultingRoomId} onChange={(e) => setconsultingRoomId(e.target.value)}>
              {CONSULTORIOS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Profesional</span>
            <select
              className="field__select"
              value={selectedProfessionalId ?? undefined}
              onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
            >
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  ID: {p.id}, Nombre: {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="btn btn--ghost" onClick={clearSelection}>Limpiar</button>
        </div>
      </header>

      {/* grilla */}
      <div className="schedule">
        <div className="schedule__corner" />
        {DAYS.map((d) => (
          <div key={d} className="schedule__dayHeader">{DAY_LABELS[d]}</div>
        ))}

        {HOURS.map((h) => (
          <React.Fragment key={h}>
            <div className="schedule__hourLabel">{h}</div>
            {DAYS.map((d) => {
            const state = availability[d][h];
            const id: SlotId = `${d}-${h}`;
            const selectable = isSelectable(state);
            const isSelected = selected.has(id);
            return (
              <button
                key={id}
                type="button"
                className={[
                  "slot",
                  selectable ? "is-selectable" : "is-disabled",
                  stateClass(state),
                  isSelected ? "is-selected" : "",
                ].join(" ")}
                onClick={() => selectable && selectRange(id)}
              >
                <span className="slot__time">{h} - {add60(h)}</span>
              </button>
            );
          })}
          </React.Fragment>
        ))}
      </div>

      <div className="moduleRent__footer">
        <button type="button" className="btn btn--primary" disabled={!selected.size} onClick={onConfirm}>
          ALQUILAR ({selected.size})
        </button>
      </div>
    </section>
  );
}

/* ===== Helpers ===== */
function stateClass(s: SlotState): string {
  switch (s) {
    case "available": return "is-available";
    case "mine": return "is-mine";
    case "reserved": return "is-reserved";
    default: return "is-unavailable";
  }
}
