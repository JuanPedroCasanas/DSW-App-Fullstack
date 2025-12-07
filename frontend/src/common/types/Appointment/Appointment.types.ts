import { HealthInsurance } from "../HealthInsurance/HealthInsurance.types";
import { LegalGuardian } from "../LegalGuardian/LegalGuardian.types";
import { Module } from "../Module/Module.types";
import { Patient } from "../Patient/Patient.types";
import { Professional } from "../Professional/Professional.types";

export type AppointmentStatus =
  | 'available'
  | 'scheduled'
  | 'completed'
  | 'missed'
  | 'canceled'
  | 'expired';

export type Appointment = {
  id?: number;
  startTime?: string;     // ISO con 'Z' (UTC), ej: "2025-10-06T16:00:00.000Z"
  endTime?: string;       // ISO con 'Z'
  status?: AppointmentStatus;
  module?: number;
  professional?: number;
  patient?: number;
  legalGuardian?: number;
  healthInsurance?: number;
};

export type PopulatedAppointment = {
  id?: number;
  startTime?: string;     // ISO con 'Z' (UTC), ej: "2025-10-06T16:00:00.000Z"
  endTime?: string;       // ISO con 'Z'
  status?: AppointmentStatus;
  module?: Module;
  professional?: Professional;
  patient?: Patient;
  legalGuardian?: LegalGuardian;
  healthInsurance?: HealthInsurance;
};