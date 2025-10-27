export type Appointment = {
  id: string;
  patient: Patient;
  professional: Professional;
  startTime: string;
  status: 'available' | 'scheduled';
  healthInsurance: HealthInsurance;
};

export type HealthInsurance = {
  id: number;
  name: string;
}

export type Professional = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Filters = {
  patientId: string;
  professionalId: string;
  healthInsurance: string;
  date: string;
};