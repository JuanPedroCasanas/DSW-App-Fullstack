export type Professional = {
  id: number;
  firstName: string;
  lastName: string;
  occupation: { id: number; name: string };
  isActive: boolean;
};

export type ConsultingRoom = {
  id: number;
  description: string;
}

export type ModuleDTO = {
  day: number;
  startTime: string;
  endTime: string;
  validMonth: number;
  validYear: number;
  idProfessional: number | null;
  idConsultingRoom: number | null;
};

export type DayKey = "lun" | "mar" | "mie" | "jue" | "vie" | "sab";
export type SlotState = "available" | "mine" | "reserved" | "unavailable";
export type SlotId = `${DayKey}-${string}`;
export type Availability = Record<DayKey, Record<string, SlotState>>;