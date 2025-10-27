import { useEffect, useState, useMemo } from 'react';

import { Toast } from "@/components/Toast";
import {
  handleAppointmentControllerResponse,
  handleHealthInsuranceControllerResponse,
  handlePatientControllerResponse,
  handleProfessionalControllerResponse
} from './AppointmentListHandleResponses';

import './appointmentList.css';
import {
  Appointment,
  HealthInsurance,
  Professional,
  Patient,
  Filters,
} from './appointmentList.types';


export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [filters, setFilters] = useState<Filters>({
    patientId: '',
    professionalId: '',
    healthInsurance: '',
    date: '',
  });
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const fullName = (p: { firstName: string; lastName: string }) =>
    `${p.firstName} ${p.lastName}`.trim();

  const professionalName = (a: Appointment) =>
    `${a.professional?.firstName ?? ''} ${a.professional?.lastName ?? ''}`.trim();

  const getProfessionals = async (): Promise<Professional[] | undefined>  => {
    const res = await fetch('http://localhost:2000/Professional/getAll');

    if (!res.ok){
      const toastData = await handleProfessionalControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Professional[] = await res.json();

    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getPatients = async (): Promise<Patient[] | undefined> => {
    const res = await fetch('http://localhost:2000/Patient/getAll');

    if (!res.ok){
      const toastData = await handlePatientControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Patient[] = await res.json();
    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getHealthInsurances = async (): Promise<HealthInsurance[] | undefined> => {
    const res = await fetch('http://localhost:2000/HealthInsurance/getAll');

    if (!res.ok){
      const toastData = await handleHealthInsuranceControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: HealthInsurance[] = await res.json();


    return Array.isArray(data) ? data.filter(h => h?.id != null) : [];
  };

  const getScheduledAppointments = async (): Promise<Appointment[] | undefined> => {
    const res = await fetch('http://localhost:2000/Appointment/getScheduledAppointments');

    if (!res.ok){
      const toastData = await handleAppointmentControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  };

 
  useEffect(() => {
     // carga los filtros -> profesional, paciente y OS
    const loadFilters = async () => {
      try {
        const profs = await getProfessionals();
        const pats = await getPatients();
        const ins = await getHealthInsurances();

        if (!profs || !pats || !ins){
          return;
        }

        setProfessionals(profs);
        setPatients(pats);
        setHealthInsurances(ins);

      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    // carga los turnos
    const loadAppointments = async () => {
      setLoadingAppointments(true);
      try {
        
        const data = await getScheduledAppointments();

        if (!data) {
          return;
        }
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
      const matchPatient = !filters.patientId || String(a.patient.id) === filters.patientId;

      const matchProfessional =
        !filters.professionalId || String(a.professional?.id) === filters.professionalId;

      const matchInsurance =
        !filters.healthInsurance || String(a.healthInsurance.id) === filters.healthInsurance;

      const matchDate = !filters.date || a.startTime.split("T")[0] === filters.date;

      return matchPatient && matchProfessional && matchInsurance && matchDate;
    });
  }, [appointments, filters]);


  return (
    <div className="appointment-list-container">
      <h1>Listado de turnos reservados</h1>
      <div className="filters" aria-label="Appointment filters">
        <select
          value={filters.professionalId}
          onChange={e => handleFilterChange('professionalId', e.target.value)}
          aria-label="All professionals"
          title="All professionals"
        >
          <option value="">Profesionales</option>
          {professionals.map(pr => (
            <option key={`prof-${pr.id}`} value={String(pr.id)}>
              {fullName(pr)}
            </option>
          ))}
        </select>

        <select
          value={filters.patientId}
          onChange={e => handleFilterChange('patientId', e.target.value)}
          aria-label="All patients"
          title="All patients"
        >
          <option value="">Pacientes</option>
          {patients.map(p => (
            <option key={`pat-${p.id}`} value={String(p.id)}>
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
          <option value="">Obras Sociales</option>
          {healthInsurances.map(i => (
            <option key={`ins-${i.id}`} value={i.id}>
              {i.name}
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
        <p>Cargando turnos...</p>
      ) : (
        <table className="appointment-table" role="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Obra Social</th>
              <th>Profesional</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(a => (
              <tr key={a.id}>
                <td>{a.patient.firstName}</td>
                <td>{a.patient.lastName}</td>
                <td>{a.healthInsurance.name}</td>
                <td>{professionalName(a)}</td>
                <td>{a.startTime.split("T")[0]}</td>
                <td>{a.startTime.split("T")[1]}</td> 

              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* ===== TOAST ===== */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    
  );
}
