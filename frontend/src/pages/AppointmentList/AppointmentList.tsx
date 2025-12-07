import { useEffect, useState, useMemo } from 'react';

import {
  HandleAppointmentControllerResponse,
  HandleHealthInsuranceControllerResponse,
  HandlePatientControllerResponse,
  HandleProfessionalControllerResponse
} from '@/common/utils';

import {
  Appointment,
  HealthInsurance,
  Professional,
  Patient,
  Filters,
} from './appointmentList.types'; //esto se tiene que traer en realidad de '@/common/types'

import { Toast, EmptyState, Table, PrimaryButton, Card, FilterBar, FormField } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";


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
      const toastData = await HandleProfessionalControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Professional[] = await res.json();

    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getPatients = async (): Promise<Patient[] | undefined> => {
    const res = await fetch('http://localhost:2000/Patient/getAll');

    if (!res.ok){
      const toastData = await HandlePatientControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Patient[] = await res.json();
    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getHealthInsurances = async (): Promise<HealthInsurance[] | undefined> => {
    const res = await fetch('http://localhost:2000/HealthInsurance/getAll');

    if (!res.ok){
      const toastData = await HandleHealthInsuranceControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: HealthInsurance[] = await res.json();


    return Array.isArray(data) ? data.filter(h => h?.id != null) : [];
  };

  const getScheduledAppointments = async (): Promise<Appointment[] | undefined> => {
    const res = await fetch('http://localhost:2000/Appointment/getScheduledAppointments');

    if (!res.ok){
      const toastData = await HandleAppointmentControllerResponse(res);
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

  <Page>
    <SectionHeader title="Listado de turnos reservados" />

    {/* Filtros */}
      <FilterBar>
          {/* Profesional */}
          <FormField label="Profesional" htmlFor="filter-professional">
            <select
              id="filter-professional"
              value={filters.professionalId}
              onChange={(e) => handleFilterChange('professionalId', e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todos</option>
              {professionals
                .sort((a, b) => fullName(a).localeCompare(fullName(b), 'es'))
                .map((pr) => (
                  <option key={`prof-${pr.id}`} value={String(pr.id)}>
                    {fullName(pr)}
                  </option>
                ))}
            </select>
          </FormField>

          {/* Paciente */}
          <FormField label="Paciente" htmlFor="filter-patient">
            <select
              id="filter-patient"
              value={filters.patientId}
              onChange={(e) => handleFilterChange('patientId', e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todos</option>
              {patients
                .sort((a, b) => fullName(a).localeCompare(fullName(b), 'es'))
                .map((p) => (
                  <option key={`pat-${p.id}`} value={String(p.id)}>
                    {fullName(p)}
                  </option>
                ))}
            </select>
          </FormField>

          {/* Obra social */}
          <FormField label="Obra social" htmlFor="filter-insurance">
            <select
              id="filter-insurance"
              value={filters.healthInsurance}
              onChange={(e) => handleFilterChange('healthInsurance', e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas</option>
              {healthInsurances
                .sort((a, b) => a.name.localeCompare(b.name, 'es'))
                .map((i) => (
                  <option key={`ins-${i.id}`} value={String(i.id)}>
                    {i.name}
                  </option>
                ))}
            </select>
          </FormField>

          {/* Fecha */}
          <FormField label="Fecha" htmlFor="filter-date">
            <input
              id="filter-date"
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
            />
          </FormField>

            {/* Botón limpiar */}
              <PrimaryButton
                variant="outline"
                size="md"
                className="border-cyan-600 text-cyan-600 hover:bg-gray-50"
                onClick={() =>
                  setFilters({
                    patientId: '',
                    professionalId: '',
                    healthInsurance: '',
                    date: '',
                  })
                }
              >
                Limpiar filtros
              </PrimaryButton>

      </FilterBar>

    {/* Tabla / Feedback */}
    {loadingAppointments ? (
      <EmptyState
        title="Cargando turnos..."
        description="Por favor, esperá un momento."
        icon={
          <svg className="w-12 h-12 text-cyan-600 animate-pulse" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 22a10 10 0 1 1 10-10 1 1 0 0 1-2 0 8 8 0 1 0-8 8 1 1 0 0 1 0 2Z"
            />
          </svg>
        }
      />
    ) : filteredAppointments.length === 0 ? (
      <EmptyState
        title="No hay turnos que coincidan"
        description="Probá ajustando los filtros."
        icon={
          <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m-8.5 8a8.5 8.5 0 0 1 17 0z"
            />
          </svg>
        }
        action={
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() =>
              setFilters({
                patientId: '',
                professionalId: '',
                healthInsurance: '',
                date: '',
              })
            }
          >
            Limpiar filtros
          </PrimaryButton>
        }
      />
    ) : (
      <Card>
        <Table
          headers={[
            'Nombre',
            'Apellido',
            'Obra Social',
            'Profesional',
            'Fecha',
            'Hora',
          ]}
        >
          {filteredAppointments
            .sort((a, b) => a.startTime.localeCompare(b.startTime)) // orden por fecha/hora asc
            .map((a) => (
              <tr key={a.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-3">{a.patient.firstName}</td>
                <td className="px-4 py-3">{a.patient.lastName}</td>
                <td className="px-4 py-3">{a.healthInsurance.name}</td>
                <td className="px-4 py-3">{professionalName(a)}</td>
                <td className="px-4 py-3">{a.startTime.split('T')[0]}</td>
                <td className="px-4 py-3">{a.startTime.split('T')[1]}</td>
              </tr>
            ))}
        </Table>
      </Card>
    )}

    {/* Toast */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}

  </Page>
  );
}
