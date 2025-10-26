import { useEffect, useState, useMemo } from 'react';
import './appointmentList.css';

type Appointment = {
  id: string;
  patient: {
    idPatient: number;
    firstName: string;
    lastName: string;
    healthInsurance: string;
  };
  professional?: {
    idProfessional: number;
    firstName: string;
    lastName: string;
  };
  date: string;
  time: string;
  status: 'available' | 'scheduled';
};

type Professional = {
  idProfessional: number;
  firstName: string;
  lastName: string;
};

type Patient = {
  idPatient: number;
  firstName: string;
  lastName: string;
};

type Filters = {
  patientId: string;
  professionalId: string;
  healthInsurance: string;
  date: string;
};

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [healthInsurances, setHealthInsurances] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    patientId: '',
    professionalId: '',
    healthInsurance: '',
    date: '',
  });
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const fullName = (p: { firstName: string; lastName: string }) =>
    `${p.firstName} ${p.lastName}`.trim();

  const professionalName = (a: Appointment) =>
    `${a.professional?.firstName ?? ''} ${a.professional?.lastName ?? ''}`.trim();

  const getProfessionals = async (): Promise<Professional[]> => {
    const res = await fetch('http://localhost:2000/Professional/getAll');
    if (!res.ok) throw new Error('Error fetching professionals');
    const data = await res.json();
    return Array.isArray(data) ? data.filter(p => p?.idProfessional != null) : [];
  };

  const getPatients = async (): Promise<Patient[]> => {
    const res = await fetch('http://localhost:2000/Patient/getAll');
    if (!res.ok) throw new Error('Error fetching patients');
    const data = await res.json();
    return Array.isArray(data) ? data.filter(p => p?.idPatient != null) : [];
  };

  const getHealthInsurances = async (): Promise<string[]> => {
    const res = await fetch('http://localhost:2000/HealthInsurance/getAll');
    if (!res.ok) throw new Error('Error fetching health insurances');
    const data = await res.json();
    return data.map((i: any) => i.name);
  };

  const getScheduledAppointments = async (): Promise<Appointment[]> => {
    const res = await fetch('http://localhost:2000/Appointment/getScheduledAppointments');
    if (!res.ok) throw new Error('Error fetching appointments');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [profs, pats, ins] = await Promise.all([
          getProfessionals(),
          getPatients(),
          getHealthInsurances(),
        ]);
        setProfessionals(profs);
        setPatients(pats);
        setHealthInsurances(ins);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    const loadAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const data = await getScheduledAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    loadFilters();
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchPatient = !filters.patientId || String(a.patient.idPatient) === filters.patientId;
      const matchProfessional =
        !filters.professionalId || String(a.professional?.idProfessional) === filters.professionalId;
      const matchInsurance =
        !filters.healthInsurance || a.patient.healthInsurance === filters.healthInsurance;
      const matchDate = !filters.date || a.date === filters.date;
      return matchPatient && matchProfessional && matchInsurance && matchDate;
    });
  }, [appointments, filters]);

  return (
    <div className="appointment-list-container">
      <h1>Appointment List</h1>
      <div className="filters" aria-label="Appointment filters">
        <select
          value={filters.professionalId}
          onChange={e => handleFilterChange('professionalId', e.target.value)}
          aria-label="All professionals"
          title="All professionals"
        >
          <option value="">All professionals</option>
          {professionals.map(p => (
            <option key={`prof-${p.idProfessional}`} value={String(p.idProfessional)}>
              {fullName(p)}
            </option>
          ))}
        </select>

        <select
          value={filters.patientId}
          onChange={e => handleFilterChange('patientId', e.target.value)}
          aria-label="All patients"
          title="All patients"
        >
          <option value="">All patients</option>
          {patients.map(p => (
            <option key={`pat-${p.idPatient}`} value={String(p.idPatient)}>
              {fullName(p)}
            </option>
          ))}
        </select>

        <select
          value={filters.healthInsurance}
          onChange={e => handleFilterChange('healthInsurance', e.target.value)}
          aria-label="All healthInsurances"
          title="All healthInsurances"
        >
          <option value="">All healthInsurances</option>
          {healthInsurances.map(i => (
            <option key={`ins-${i}`} value={i}>
              {i}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={e => handleFilterChange('date', e.target.value)}
          aria-label="Date"
        />
      </div>

      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="appointment-table" role="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Health Insurance</th>
              <th>Professional</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(a => (
              <tr key={a.id}>
                <td>{a.patient.firstName}</td>
                <td>{a.patient.lastName}</td>
                <td>{a.patient.healthInsurance}</td>
                <td>{professionalName(a)}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
