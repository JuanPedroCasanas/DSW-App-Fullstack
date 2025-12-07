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
