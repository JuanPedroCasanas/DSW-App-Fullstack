import React, { useEffect, useMemo, useState } from "react";
import "./moduleRent.css";
import { Availability, ConsultingRoom, DayKey, Professional, SlotId, SlotState } from "./moduleRentTypes";
import { Toast } from "@/components/Toast";

const DAYS: DayKey[] = ["lun", "mar", "mie", "jue", "vie", "sab"];
const DAY_LABELS: Record<DayKey, string> = {
  lun: "Lunes", mar: "Martes", mie: "Miércoles", jue: "Jueves", vie: "Viernes", sab: "Sábado",
};
const HOURS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00",
];

const isAllowed = (day: DayKey, hour: string): boolean => {
  const H = Number(hour.slice(0, 2));
  if (day === "sab") return H >= 8 && H <= 12;
  return H >= 8 && H <= 20;
};

const add60 = (hhmm: string) => {
  const [hh, mm] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, hh, mm);
  d.setMinutes(d.getMinutes() + 60);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

const numToDay = (n: number): DayKey => DAYS[n-1] ?? "lun";

const buildBaseAvailability = (): Availability => {
  const base: Availability = { lun:{}, mar:{}, mie:{}, jue:{}, vie:{}, sab:{} };
  DAYS.forEach(d => {
    HOURS.forEach(h => {
      base[d][h] = isAllowed(d,h) ? "available" : "unavailable";
    });
  });
  return base;
};

export default function ModuleRent() {
  const [consultingRoomId, setConsultingRoomId] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Availability>(buildBaseAvailability);
  const [selected, setSelected] = useState<Set<SlotId>>(new Set());
  const [rangeStart, setRangeStart] = useState<SlotId | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [consultingRooms, setConsultingRooms] = useState<ConsultingRoom[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  
  
  // === cargar consultorios ===
  useEffect(() => {
    const fetchConsultingRooms = async () => {
      try {
        const res = await fetch("http://localhost:2000/ConsultingRoom/getAll?includeInactive=false");
        const data: ConsultingRoom[] = await res.json();
        setConsultingRooms(data);
        if (data.length) setConsultingRoomId(data[0].id);
      } catch(err) { console.error(err); }
    };
    fetchConsultingRooms();
  }, []);

  // === cargar profesionales ===
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch("http://localhost:2000/Professional/getAll?includeInactive=false");
        const data: Professional[] = await res.json();
        setProfessionals(data);
        if (data.length) setSelectedProfessionalId(data[0].id);
      } catch(err) { console.error(err); }
    };
    fetchProfessionals();
  }, []);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


  // === cargar módulos ===
  useEffect(() => {
    fetchModules();
  }, [consultingRoomId, selectedProfessionalId]);

  
  // === Limpiar rangos al cambiar de dia/consultorio o clickear por tercera vez
  useEffect(() => {
    clearSelection();
    setRangeStart(null);
}, [consultingRoomId]);

  const fetchModules = async () => {
    if (consultingRoomId == null || selectedProfessionalId == null) return;
      try {
        const res = await fetch(`http://localhost:2000/Module/getCurrentMonthModulesByConsultingRoom/${consultingRoomId}`);
        const resJson = await res.json();
        const next = buildBaseAvailability();

        resJson.forEach((mod:any) => {
          const day = numToDay(mod.day);
          let h = mod.startTime.slice(0,5);
          const end = mod.endTime.slice(0,5);
          while(h < end){
            if(HOURS.includes(h)){
              next[day][h] = mod.professional === selectedProfessionalId ? "mine" : "reserved";
            }
            h = add60(h);
          }
        });

        // sábados 13:00+ no disponibles
        HOURS.forEach(h => {
          if(Number(h.slice(0,2)) >= 13) next.sab[h] = "unavailable";
        });

        setAvailability(next);
      } catch(err){ console.error(err); }
    };
  // === selección rango a reservar===
  const selectRange = (clickedId: SlotId) => {
    const [clickedDay, clickedHour] = clickedId.split("-") as [DayKey, string];

    // Caso: click en otro día o ya había selección previa
    if (!rangeStart || rangeStart.split("-")[0] !== clickedDay || availability[clickedDay][clickedHour] !== "available") {
      const state = availability[clickedDay][clickedHour];
      if (state !== "available") {
        clearSelection();
        return
      }

      setRangeStart(clickedId);
      setSelected(new Set([clickedId]));
      return;
    }

    // Caso normal: extender selección en el mismo día
    const [startDay, startHour] = rangeStart.split("-") as [DayKey, string];

    const startIndex = HOURS.indexOf(startHour);
    const endIndex = HOURS.indexOf(clickedHour);
    if (startIndex === -1 || endIndex === -1) return;

    const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

    const newSelected = new Set<SlotId>();
    for (let i = from; i <= to; i++) {
      const hour = HOURS[i];
      const state = availability[startDay][hour];

      if (state !== "available") break; // detener en bloqueado
      newSelected.add(`${startDay}-${hour}`);
    }

    setSelected(newSelected);
  };

  const clearSelection = () => { setSelected(new Set()); setRangeStart(null); };

  const isSelectable = (s:SlotState) => s==="available";

  async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
    const resJson = await res.json().catch(() => ({}));

    if (res.ok) {
      const successMessage = `${resJson.message} Hora inicio modulos: ${resJson.modules[0].startTime}, 
        Hora Fin modulos: ${resJson.modules[resJson.modules.length - 1].endTime}, 
        Profesional: ${resJson.modules[0].professional.lastName} ${resJson.modules[0].professional.firstName},
        Consultorio: ${resJson.modules[0].consultingRoom.description}`;
      return { message: successMessage, type: "success" };
    } else {
      if (res.status === 500 || res.status === 400) {
        return { message: resJson.message ?? "Error interno del servidor", type: "error" };
      } else {
        const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      
        return { message: errorMessage.trim(), type: "error" };
      }
    }
  }

  const onConfirm = async () => {
    if(!selected.size) return;

    const days = Array.from(new Set(Array.from(selected).map(id=>id.split("-")[0] as DayKey)));
    if(days.length>1){ alert("Solo un día a la vez"); return; }

    const day = days[0];
    const hours = Array.from(selected).map(id=>id.split("-")[1]).sort();

    for(const h of hours){
      if(availability[day][h]==="reserved"){ alert("Horario ocupado"); return; }
    }

    const payload = {
      day: DAYS.indexOf(day)+1,
      startTime: hours[0],
      endTime: add60(hours[hours.length-1]),
      validMonth: new Date().getMonth()+1,
      validYear: new Date().getFullYear(),
      idProfessional: selectedProfessionalId,
      idConsultingRoom: consultingRoomId
    };

    try {
      const res = await fetch("http://localhost:2000/Module/add",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      
      const toastData = await handleResponse(res);
      
      setToast(toastData);
      
      if (res.ok) {
        const newAvailability = { ...availability };
        hours.forEach(h => {
          newAvailability[day][h] = "mine";
        });
        setAvailability(newAvailability);
        clearSelection();
        await fetchModules();
      }
      
      
    } catch(err:any){
        setToast({ message: err.message || "Error desconocido", type: "error" });
    }
  };

  const stateClass = (s:SlotState) => {
    switch(s){
      case "available": return "is-available";
      case "mine": return "is-mine";
      case "reserved": return "is-reserved";
      default: return "is-unavailable";
    }
  };

  return (
    <section className="moduleRent">
      <header className="moduleRent__controls">
        <h2>Alquiler de módulos</h2>
        <div className="moduleRent__filters">
          <label className="field">
            <span className="field__label">Consultorio</span>
            <select value={consultingRoomId ?? undefined} onChange={e=>setConsultingRoomId(Number(e.target.value))}>
              {consultingRooms.map(c=><option key={c.id} value={c.id}>{c.description}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Profesional</span>
            <select value={selectedProfessionalId ?? undefined} onChange={e=>setSelectedProfessionalId(Number(e.target.value))}>
              {professionals.map(p=><option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn--ghost" onClick={clearSelection}>Limpiar</button>
          <div className="moduleRent__legend" aria-label="Leyenda de estados">
            <span><i className="dot dot--available" /> Disponible</span>
            <span><i className="dot dot--mine" /> Alquilado por vos</span>
            <span><i className="dot dot--reserved" /> Ocupado por otro</span>
            <span><i className="dot dot--unavailable" /> No disponible</span>
          </div>
          <button   type="button" className={`btn btn--ghost ${!rangeStart ? "btn--disabled" : ""}`} onClick={clearSelection} disabled={!rangeStart}>
              Limpiar selección
          </button>
        </div>
        
      </header>

      <div className="schedule">
        <div className="schedule__corner"/>
        {DAYS.map(d=><div key={d} className="schedule__dayHeader">{DAY_LABELS[d]}</div>)}
        {HOURS.map(h=>
          <React.Fragment key={h}>
            <div className="schedule__hourLabel">{h}</div>
            {DAYS.map(d=>{
              const state = availability[d][h];
              const id:SlotId = `${d}-${h}`;
              const selectable = isSelectable(state);
              const isSelected = selected.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  className={[
                    "slot",
                    selectable?"is-selectable":"is-disabled",
                    stateClass(state),
                    isSelected?"is-selected":"",
                  ].join(" ")}
                  onClick={()=>selectRange(id)}
                >
                  <span className="slot__time">{h} - {add60(h)}</span>
                </button>
              );
            })}
          </React.Fragment>
        )}
      </div>

      <div className="moduleRent__footer">
        <button type="button" className="btn btn--primary" disabled={!selected.size} onClick={onConfirm}>
          ALQUILAR ({selected.size})
        </button>
      </div>

      {/* ===== TOAST ===== */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
