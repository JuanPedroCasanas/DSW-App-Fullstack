import { useEffect, useState, useMemo } from 'react';

import {
  HandleAppointmentControllerResponse,
  HandleHealthInsuranceControllerResponse,
  HandlePatientControllerResponse,
  HandleProfessionalControllerResponse
} from '@/common/utils';

import { Toast, EmptyState, Table, PrimaryButton, Card, FilterBar, FormField } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { HealthInsurance, Patient, PopulatedAppointment, Professional, AppointmentStatus } from '@/common/types';
import { authFetch } from '@/common/utils/auth/AuthFetch';
import { useAuth } from "@/common/utils/auth/AuthContext";
import { UserRole } from '@/common/types';

import { API_BASE } from '@/lib/api';


type Filters = {
  patientId?: number;
  healthInsuranceId?: number;
  date: string;
};

// traduzco los estados para mostrarlos al usuario
const STATUS_LABEL_ES: Record<AppointmentStatus, string> = {
  available: "Disponible",
  scheduled: 'Reservado',
  completed: 'Completado',
  missed: 'No se presentó',
  canceled: 'Cancelado',
  expired: "Expirado",
};


export default function AppointmentList() {

  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.Admin;
  const isProfessional = user?.role === UserRole.Professional;

  const myProfessionalId = user?.professional?.id ?? user?.id;

  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);

  const [filters, setFilters] = useState<Filters>({
    patientId: undefined,
    healthInsuranceId: undefined,
    date: '',
  });

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [loadingAppointments, setLoadingAppointments] = useState(false);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]:
        field === 'date'
          ? value
          : value === ''
          ? undefined
          : Number(value),
    }));
  };

  const fullName = (p: Professional) =>
    `${p.firstName} ${p.lastName}`.trim();

  const professionalName = (a: PopulatedAppointment) =>
    `${a.professional?.firstName ?? ''} ${a.professional?.lastName ?? ''}`.trim();

  const getProfessionals = async (): Promise<Professional[] | undefined>  => {
    const res = await authFetch(`${API_BASE}/professional/getAll`);

    if (!res.ok){
      const toastData = await HandleProfessionalControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Professional[] = await res.json();

    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getPatients = async (): Promise<Patient[] | undefined> => {
    const res = await authFetch(`${API_BASE}/patient/getAll`);

    if (!res.ok){
      const toastData = await HandlePatientControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: Patient[] = await res.json();
    return Array.isArray(data) ? data.filter(p => p?.id != null) : [];
  };

  const getHealthInsurances = async (): Promise<HealthInsurance[] | undefined> => {
    const res = await authFetch(`${API_BASE}/healthInsurance/getAll`);

    if (!res.ok){
      const toastData = await HandleHealthInsuranceControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data: HealthInsurance[] = await res.json();


    return Array.isArray(data) ? data.filter(h => h?.id != null) : [];
  };

  const getScheduledAppointments = async (): Promise<PopulatedAppointment[] | undefined> => {
    const res = await authFetch(`${API_BASE}/appointment/getScheduledAppointments`);

    if (!res.ok){
      const toastData = await HandleAppointmentControllerResponse(res);
      setToast(toastData);
      return;
    } 

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  };

type AllowedUpdateStatus = Extract<AppointmentStatus, 'completed' | 'missed'>;

  const updateAppointmentStatus = async (idAppointment: number, status: AllowedUpdateStatus) => {
  setUpdatingId(idAppointment);

  try {
    const res = await authFetch(`${API_BASE}/appointment/updateStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAppointment, status }),
    });

    if (!res.ok) {
      const toastData = await HandleAppointmentControllerResponse(res);
      setToast(toastData);
      return;
    }

    const data = await res.json();

    setToast({ message: data?.message ?? "Estado actualizado", type: "success" });

    // dejo visible igualmente el turno, mostrando el nuevo estado
    setAppointments(prev =>
      prev.map(a => (a.id === idAppointment ? { ...a, status } as any : a))
     );

  } catch (error) {
    console.error(error);
    setToast({ message: "Error al actualizar el estado del turno", type: "error" });
  } finally {
    setUpdatingId(null);
  }
};
 
  useEffect(() => {
     // carga los filtros -> profesional, paciente y OS
    const loadFilters = async () => {
      try {
          const pats = await getPatients();
          const ins = await getHealthInsurances();
          const profs = await getProfessionals();

          if (!pats || !ins || !profs) return;

          setPatients(pats);
          setHealthInsurances(ins);

          // rol admin
          if (isAdmin) {
            setProfessionals(profs);
            setSelectedProfessional(prev => prev ?? profs[0] ?? null);
          }

          // rol profesional
          if (isProfessional) {
            const me = profs.find(p => p.id === myProfessionalId) ?? null;
            setProfessionals(me ? [me] : []);
            setSelectedProfessional(me);
          }

      } catch (error) {
        setToast({message: 'Error al cargar los filtros', type: "error"});
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

  }, [isAdmin, isProfessional, myProfessionalId]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchPatient = !filters.patientId || a.patient?.id === filters.patientId;

      const matchProfessional =
        !selectedProfessional || a.professional?.id === selectedProfessional.id;

      const matchInsurance =
        !filters.healthInsuranceId || a.healthInsurance?.id === filters.healthInsuranceId;

      const matchDate = !filters.date || a.startTime?.split("T")[0] === filters.date;

      return matchPatient && matchProfessional && matchInsurance && matchDate;
    });
  }, [appointments, filters, selectedProfessional]);


  return (

  <Page>
    <SectionHeader title="Listado de turnos reservados" />

    {/* Filtros */}
      <FilterBar>
          {/* Profesional */}
          {isAdmin && (
            <FormField label="Profesional" htmlFor="filter-professional">
              <select
                id="filter-professional"
                value={selectedProfessional?.id ?? ''}
                onChange={(e) => {
                  const prof = professionals.find(
                    p => p.id === Number(e.target.value)
                  );
                  setSelectedProfessional(prof ?? null);
                }}
                className="border rounded-lg p-3 w-full"
              >
                {professionals
                  .sort((a, b) => fullName(a).localeCompare(fullName(b), 'es'))
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {fullName(p)}
                    </option>
                  ))}
              </select>
            </FormField>
          )}

          {/* Paciente */}
          <FormField label="Paciente" htmlFor="filter-patient">
            <select
              id="filter-patient"
              value={filters.patientId ?? ''}
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
              value={filters.healthInsuranceId ?? ''}
              onChange={(e) => handleFilterChange('healthInsuranceId', e.target.value)}
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Todas</option>
              {healthInsurances
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'es'))
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
                    patientId: undefined,
                    healthInsuranceId: undefined,
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
                patientId: undefined,
                healthInsuranceId: undefined,
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
            'Estado',
            'Acciones',
          ]}
        >
          {filteredAppointments
            .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? '')) // orden por fecha/hora asc
            .map((a) => (
              <tr key={a.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-3">{a.patient?.firstName}</td>
                <td className="px-4 py-3">{a.patient?.lastName}</td>
                <td className="px-4 py-3">{a.healthInsurance?.name}</td>
                <td className="px-4 py-3">{professionalName(a)}</td>
                <td className="px-4 py-3">{a.startTime?.split('T')[0]}</td>
                <td className="px-4 py-3">{a.startTime?.split('T')[1]}</td>

                {/*  Estado  */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                    {STATUS_LABEL_ES[(a.status ?? 'scheduled') as AppointmentStatus]}
                  </span>
                </td>

                {/* Acciones (missed - completed) */}
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {/* completado */}
                    <PrimaryButton
                      size="sm"
                      variant="solid"
                      disabled={updatingId === a.id}
                      onClick={() => updateAppointmentStatus(a.id!, 'completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    >
                      {updatingId === a.id ? "Actualizando..." : "Marcar como completado"}
                    </PrimaryButton>

                    {/* missed */}
                    <PrimaryButton
                      size="sm"
                      variant="danger"
                      disabled={updatingId === a.id}
                      onClick={() => updateAppointmentStatus(a.id!, 'missed')}
                    >
                      {updatingId === a.id ? "Actualizando..." : "No se presentó"}
                    </PrimaryButton>
                  </div>
                </td>
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
