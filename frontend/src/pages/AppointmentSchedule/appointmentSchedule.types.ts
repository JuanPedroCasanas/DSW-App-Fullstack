// src/pages/AppointmentSchedule/appointmentSchedule.types.ts

export type Occupation = { 
    id: string; 
    name: string };
export type Professional = { 
    id: string; 
    firstName: string; 
    lastName: string };
export type AppointmentStatus = 'assigned' | 'completed' | 'canceled' | 'missed';
export type Appointment = {
  id: string;
  professionalId: string;
  occupationId: string; // en backend: "occupation"
  dateISO: string;      // YYYY-MM-DD
  time: string;         // HH:mm
  status: AppointmentStatus;
};

export const WORKING_SLOTS: readonly string[] = ['09:00','10:00','11:00','14:00','15:00','16:00'];

export function pad(n: number): string {
  return n.toString().padStart(2,'0');
}
export function toISO(d: Date): string {
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
}
export function toDDMMYYYY(iso: string): string {
  const parts = iso.split('-');
  const y = parts[0]; const m = parts[1]; const d = parts[2];
  return d + '/' + m + '/' + y;
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

export function isPast(d: Date): boolean {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cmp < today;
}

export function deriveAvailableDaysForMonth(
  appointments: Appointment[],
  professionalId: string,
  base: Date
): Set<string> {
  const meta = getMonthMeta(base);
  const year = meta.year;
  const month = meta.month;
  const daysInMonth = meta.daysInMonth;
  const set = new Set<string>();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const iso = toISO(date);
    const isSunday = date.getDay() === 0;
    if (isSunday || isPast(date)) continue;

    const taken = new Set<string>(
      appointments
        .filter(function (a) {
          return a.professionalId === professionalId &&
                 a.dateISO === iso &&
                 (a.status === 'assigned' || a.status === 'completed');
        })
        .map(function (a) { return a.time; })
    );

    let hasFree = false;
    for (let i = 0; i < WORKING_SLOTS.length; i++) {
      if (!taken.has(WORKING_SLOTS[i])) { hasFree = true; break; }
    }
    if (hasFree) set.add(iso);
  }
  return set;
}

export function deriveFreeSlotsForDay(
  appointments: Appointment[],
  professionalId: string,
  dateISO: string
): string[] {
  const taken = new Set<string>(
    appointments
      .filter(function (a) {
        return a.professionalId === professionalId &&
               a.dateISO === dateISO &&
               (a.status === 'assigned' || a.status === 'completed');
      })
      .map(function (a) { return a.time; })
  );
  return WORKING_SLOTS.filter(function (h) { return !taken.has(h); });
}

export function fullName(p?: Professional): string {
  if (!p) return '';
  return p.firstName + ' ' + p.lastName;
}