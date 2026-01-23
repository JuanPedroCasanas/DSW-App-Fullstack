import React, { useEffect, useState } from "react";

import { Toast,PrimaryButton, FormField, Card, FilterBar,
  RentLegend, StickyRentBar, WeekGrid
 } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import { HandleModuleControllerResponse, HandleConsultingRoomControllerResponse, HandleProfessionalControllerResponse } from "@/common/utils";
import { ConsultingRoom, Professional, UserRole } from "@/common/types";
import { authFetch } from "@/common/utils/auth/AuthFetch";
import { API_BASE } from '@/lib/api';
import { useAuth } from "@/common/utils/auth/AuthContext";

export type DayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab";
export type SlotState = "available" | "mine" | "reserved" | "unavailable";
export type SlotId = `${DayKey}-${string}`;
export type Availability = Record<DayKey, Record<string, SlotState>>;

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
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.Admin;
  const isProfessional = user?.role === UserRole.Professional;

  const myProfessionalId = (user as any)?.idProfessional ?? (user as any)?.id;


  const [consultingRoomId, setConsultingRoomId] = useState<number | undefined>(undefined);
  const [availability, setAvailability] = useState<Availability>(buildBaseAvailability);
  const [selected, setSelected] = useState<Set<SlotId>>(new Set());
  const [rangeStart, setRangeStart] = useState<SlotId | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [consultingRooms, setConsultingRooms] = useState<ConsultingRoom[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | undefined>(undefined);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  
  // === cargar consultorios ===
  useEffect(() => {
    const fetchConsultingRooms = async () => {
      const res = await authFetch(`${API_BASE}/ConsultingRoom/getAll?includeInactive=false`);

      if(!res.ok) {
        const toastData = await HandleConsultingRoomControllerResponse(res);
        setToast(toastData);
        return;
      }

      const data: ConsultingRoom[] = await res.json();
      setConsultingRooms(data);
      if (data.length) setConsultingRoomId(data[0].id);
    };
    fetchConsultingRooms();
  }, []);

// === cargar profesionales ===
  useEffect(() => {
    const fetchProfessionals = async () => {
      const res = await authFetch(`${API_BASE}/Professional/getAll?includeInactive=false`);
      if (!res.ok) {
        const toastData = await HandleProfessionalControllerResponse(res);
        setToast(toastData);
        return;
      }
      const data: Professional[] = await res.json();

      if (isAdmin) {
        setProfessionals(data);
        setSelectedProfessionalId(prev => prev ?? data[0]?.id);
        return;
      }

      if (isProfessional) {
        const me = data.find(p => p.id === myProfessionalId) ?? null;
        setProfessionals(me ? [me] : []);
        setSelectedProfessionalId(me?.id);
        return;
      }

    };
    fetchProfessionals();
  }, [isAdmin, isProfessional, myProfessionalId]);

  
  // === Limpiar rangos al cambiar de dia/consultorio o clickear por tercera vez
  useEffect(() => {
    clearSelection();
    setRangeStart(null);
}, [consultingRoomId, selectedProfessionalId]);

// lo paso a useCallback ya que:
// Si un useEffect llama a una función definida en el componente → useCallback.
// y porque: Si una función está en un dependency array → debe ser estable.
  const fetchModules = React.useCallback(async () => {
    if (consultingRoomId == null || selectedProfessionalId == null) return;
      try {
        const res = await authFetch(`${API_BASE}/Module/getCurrentMonthModulesByConsultingRoom/${consultingRoomId}`);

        if(!res.ok) {
          const toastData = await HandleModuleControllerResponse(res);
          setToast(toastData);
          return;
        }

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
    }, [consultingRoomId, selectedProfessionalId]);

// === cargar módulos ===
  useEffect(() => {
    fetchModules();
  }, [fetchModules]);


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
      const res = await authFetch(`${API_BASE}/Module/add`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      
      const toastData = await HandleModuleControllerResponse(res);
      
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


  return (

    <Page>
      <SectionHeader title="Alquiler de módulos" />

      {/* filtros */}
        <FilterBar>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <FormField label="Consultorio" htmlFor="sel-room">
              <select
                id="sel-room"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={consultingRoomId ?? ""}
                onChange={(e) => setConsultingRoomId(Number(e.target.value))}
              >
                {consultingRooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description}
                  </option>
                ))}
              </select>
            </FormField>


            {isAdmin && (
              <FormField label="Profesional" htmlFor="sel-pro">
                <select
                  id="sel-pro"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={selectedProfessionalId ?? ""}
                  onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
                >
                  {professionals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </FormField>
            )}


            <div className="flex justify-end">
              <PrimaryButton variant="outline" onClick={clearSelection} disabled={!rangeStart}>
                Limpiar selección
              </PrimaryButton>
            </div>
          </div>

          {/* Leyenda de estados */}
          <div className="mt-3">
            <RentLegend />
          </div>
        </FilterBar>

      {/* Grilla semanal de módulos */}
      <Card>
        <WeekGrid
          days={DAYS}
          dayLabels={DAY_LABELS}
          hours={HOURS}
          availability={availability}
          selected={selected}
          isSelectable={isSelectable}
          onClickSlot={(id) => selectRange(id)}
          add60={add60}
        />
      </Card>

      {/* Sticky CTA */}
      <StickyRentBar
        countSelected={selected.size}
        disabled={!selected.size}
        onConfirm={onConfirm}
      />

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </Page>



  );
}
