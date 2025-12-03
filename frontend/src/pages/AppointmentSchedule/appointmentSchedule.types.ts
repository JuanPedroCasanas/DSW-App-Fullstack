export type Occupation = {
  id: number; 
  name: string 
};

export type Professional = { 
  id: number;
  firstName: string; 
  lastName: string 
};

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

export type AppointmentStatus =
  | 'available'
  | 'scheduled'
  | 'completed'
  | 'missed'
  | 'canceled'
  | 'expired';

export type Appointment = {
  id: number;
  startTime: string;     // ISO con 'Z' (UTC), ej: "2025-10-06T16:00:00.000Z"
  endTime: string;       // ISO con 'Z'
  status: AppointmentStatus;
  module: number | null;
  professional: number | string; // backend usa number
  patient: number | null;
  legalGuardian: number | null;
  healthInsurance: number | null;
};

// ===== Helpers utilitarios =====

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function toISO(d: Date): string {
  // YYYY-MM-DD en horario local (día calendario del usuario)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

export function toDDMMYYYY(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function getMonthMeta(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();
  const jsDayToMonStart = (d: number) => (d === 0 ? 7 : d); // L=1..D=7
  const leadingBlanks = jsDayToMonStart(first.getDay()) - 1;
  const monthName = base.toLocaleString('es-AR', { month: 'long' });
  return { year, month, first, last, daysInMonth, leadingBlanks, monthName };
}

/**
 * Determina si una fecha (solo día, sin hora) está en el pasado.
 * Compara contra el "hoy" del usuario (zona local).
 */
export function isPast(d: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cmp < today;
}

// ===== Helpers para extraer datos desde startTime/endTime =====

/**
 * Convierte un ISO (con 'Z' UTC) a Date **local**.
 * new Date(iso) ya maneja el offset, por lo que getHours()/getDate() serán locales.
 */
export function toLocalDateFromISO(iso: string): Date {
  return new Date(iso);
}

/** Devuelve "YYYY-MM-DD" local, según la fecha local de startTime. */
export function getLocalDateISOFromStart(a: Appointment): string {
  const d = toLocalDateFromISO(a.startTime);
  return toISO(d);
}

/** Devuelve "HH:mm" local, según la hora local de startTime. */
export function getLocalHHmmFromStart(a: Appointment): string {
  const d = toLocalDateFromISO(a.startTime);
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

/** Un turno cuenta como tomado si NO está 'available'. */
export function isTaken(a: Appointment): boolean {
  return a.status !== 'available';
}

/** ¿El slot (fecha + HH:mm) ya pasó respecto de ahora (local)? */
export function isSlotInPast(dateISO: string, hhmm: string, now = new Date()): boolean {
  const [Y, M, D] = dateISO.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  const slotLocal = new Date(Y, M - 1, D, hh, mm, 0, 0);
  return slotLocal.getTime() < now.getTime();
}

// ======= Derivadores basados en turnos de backend =======

type DeriveOpts = { module?: number | null };

/**
 * Día disponible = existe al menos un Appointment con status 'available'
 * para ese profesional en el mes visible (base), y el día no es domingo ni pasado.
 * Permite filtrar opcionalmente por módulo/consultorio.
 */
export function deriveAvailableDaysForMonth(
  appointments: Appointment[],
  professionalId: number,
  base: Date,
  opts?: DeriveOpts
): Set<string> {
  const { year, month } = getMonthMeta(base);
  const set = new Set<string>();
  const moduleFilter = opts?.module ?? undefined;

  for (const a of appointments) {
    if (String(a.professional) !== String(professionalId)) continue;

    if (moduleFilter !== undefined && a.module !== moduleFilter) continue;

    const localDateISO = getLocalDateISOFromStart(a);
    const [Y, M, D] = localDateISO.split('-').map(Number);
    const localDate = new Date(Y, M - 1, D);

    const inMonth = localDate.getFullYear() === year && localDate.getMonth() === month;
    if (!inMonth) continue;

    const isSunday = localDate.getDay() === 0;
    if (isSunday || isPast(localDate)) continue;

    if (!isTaken(a)) {
      set.add(localDateISO);
    }
  }
  return set;
}

/**
 * Slots libres = todos los turnos 'available' del profesional en ese día (local),
 * convirtiendo startTime (UTC) a hora local "HH:mm". Excluye horarios del pasado si el día es hoy.
 * Permite filtrar opcionalmente por módulo/consultorio.
 */
export function deriveFreeSlotsForDay(
  appointments: Appointment[],
  professionalId: number,
  dateISO: string,
  opts?: DeriveOpts
): string[] {
  const now = new Date();
  const moduleFilter = opts?.module ?? undefined;

  const slots = appointments
    .filter((a) => String(a.professional) === String(professionalId))
    .filter((a) => (moduleFilter === undefined ? true : a.module === moduleFilter))
    .filter((a) => getLocalDateISOFromStart(a) === dateISO)
    .filter((a) => !isTaken(a))                    // solo disponibles
    .map((a) => getLocalHHmmFromStart(a));

  // Si el día es hoy, excluimos horas ya pasadas
  const todayISO = toISO(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const filtered = (dateISO === todayISO)
    ? slots.filter((hhmm) => !isSlotInPast(dateISO, hhmm, now))
    : slots;

  // Unificar y ordenar (HH:mm ordena lexicográficamente)
  return Array.from(new Set(filtered)).sort();
}


// nombres completos de profesional y paciente
export function fullName(p?: Professional): string {
  if (!p) return '';
  return `${p.firstName} ${p.lastName}`;
}

export function fullNamePatient(p?: Patient): string {
  if (!p) return '';
  return `${p.firstName} ${p.lastName}`;
}
