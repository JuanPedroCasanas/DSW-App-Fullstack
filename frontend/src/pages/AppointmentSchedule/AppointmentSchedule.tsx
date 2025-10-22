import React, { useEffect, useMemo, useRef, useState } from 'react';
import './appointmentSchedule.css';
import { Toast } from '@/components/Toast';

// ==== IMPORTS desde tus otros dos archivos (no se tocan) ====
import {
  Occupation,
  Professional,
  Appointment,
  getMonthMeta,
  toISO,
  isPast,
  deriveAvailableDaysForMonth,
  deriveFreeSlotsForDay,
  fullName,
  getLocalDateISOFromStart,
  Patient,
  fullNamePatient
} from './appointmentSchedule.types';
import { AppointmentScheduleForm } from './AppointmentScheduleForm';

//Genera un toast para las respuestas del backend
async function handleResponse(res: Response): Promise<{ message: string; type: 'success' | 'error' }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage =
      `${resJson.message ?? 'Operación exitosa'}` +
      (resJson.consultingRoom
        ? ` Id: ${resJson.consultingRoom?.id}, Nombre: ${resJson.consultingRoom?.description}`
        : resJson.appointment
        ? ` Turno: ${resJson.appointment?.id ?? ''}`
        : '');
    return { message: successMessage.trim(), type: 'success' };
  } else {
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? 'Error interno del servidor', type: 'error' };
    } else {
      const errorMessage = `Error: ${resJson.error ?? ''} Codigo: ${resJson.code ?? ''} ${resJson.message ?? ''}`;
      return { message: errorMessage.trim(), type: 'error' };
    }
  }
}

export default function AppointmentSchedule() {
  // para el manejo de errores
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // para que funcione la fecha de hoy
  const todayRef = useRef(new Date());
  const today = todayRef.current;

  // Catálogos
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  
  // Pacientes
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);



  // Filtros / selección
  const [selectedOccupationId, setSelectedOccupationId] = useState<Occupation['id']>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | number | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Turnos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingState, setBookingState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');


  // pacientes (activos primero)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingPatients(true);
        // ⚠️ Si tu backend tiene /Patient/getAllActive usalo acá.
        const res = await fetch(`http://localhost:2000/Patient/getAll`, { method: 'GET' });
        if (!res.ok) {
          const toastData = await handleResponse(res);
          if (!cancelled) setToast(toastData);
          return;
        }
        const all: Patient[] = await res.json();
        const actives = all.filter(p => p.isActive);
        if (!cancelled) setPatients(actives);
      } catch {
        if (!cancelled) setToast({ message: 'No se pudieron cargar los pacientes.', type: 'error' });
      } finally {
        if (!cancelled) setLoadingPatients(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Al cambiar de paciente: resetear todo lo dependiente
  useEffect(() => {
    // si no hay paciente, limpiar filtros y turnos
    setSelectedOccupationId('');
    setProfessionals([]);
    setSelectedProfessionalId('');
    setSelectedDateISO('');
    setSelectedSlot('');
    setAppointments([]);
  }, [selectedPatientId]);


  // especialidades (todas)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingMeta(true);
        const res = await fetch(`http://localhost:2000/Occupation/getAll`, { method: 'GET' });
        if (!res.ok) {
          const toastData = await handleResponse(res);
          if (!cancelled) setToast(toastData);
          return;
        }
        const occs: Occupation[] = await res.json();
        if (!cancelled) setOccupations(occs);
      } catch {
        if (!cancelled) setToast({ message: 'No se pudieron cargar las especialidades.', type: 'error' });
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // filtro de profesionales según especialidad
  useEffect(() => {
    setSelectedProfessionalId('');
    setSelectedDateISO('');
    setSelectedSlot('');
    setProfessionals([]);

    if (!selectedOccupationId) return;

    let cancelled = false;
    (async () => {
      try {
        setLoadingProfessionals(true);
        const res = await fetch(
          `http://localhost:2000/Professional/getProfessionalsByOccupation/${encodeURIComponent(String(selectedOccupationId))}`,
          { method: 'GET' },
        );
        if (!res.ok) {
          const toastData = await handleResponse(res);
          if (!cancelled) setToast(toastData);
          return;
        }
        const pros: Professional[] = await res.json();
        if (!cancelled) setProfessionals(pros);
      } catch {
        if (!cancelled) {
          setToast({ message: 'No se pudieron cargar los profesionales.', type: 'error' });
          setProfessionals([]);
        }
      } finally {
        if (!cancelled) setLoadingProfessionals(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedOccupationId]);

  // ====== Turnos del mes ======
  const currentMonthMeta = useMemo(() => getMonthMeta(today), [today]);
  useEffect(() => {
    setSelectedDateISO('');
    setSelectedSlot('');
    if (!selectedProfessionalId) return;

    let cancelled = false;
    (async () => {
      try {
        setError(null);
        setLoadingMonth(true);

        console.log(selectedProfessionalId);

        const res = await fetch(`http://localhost:2000/Appointment/getAvailableAppointmentsByProfessional/${selectedProfessionalId}`, { 
          method: 'GET' 
        });

        if (!res.ok) {
          const toastData = await handleResponse(res);
          if (!cancelled) setToast(toastData);
          return;
        }

        const all: Appointment[] = await res.json();
      
        const { year, month } = currentMonthMeta;
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        const inMonth = all.filter(a => {
          const iso = getLocalDateISOFromStart(a); // "YYYY-MM-DD" local
          const [Y, M, D] = iso.split('-').map(Number);
          const d = new Date(Y, M - 1, D);
          return d >= start && d <= end;
        });



        if (!cancelled) setAppointments(inMonth);
      } 
      catch {
        if (!cancelled) {
          setToast({ message: 'Error al cargar turnos.', type: 'error' });
          setAppointments([]);
        }
      } finally {
        if (!cancelled) setLoadingMonth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedProfessionalId, currentMonthMeta]);

  // ====== Derivados de UI ======
  const daysArray = useMemo(() => {
    const { daysInMonth, leadingBlanks } = currentMonthMeta;
    const items: (number | null)[] = [];
    for (let i = 0; i < leadingBlanks; i++) items.push(null);
    for (let d = 1; d <= daysInMonth; d++) items.push(d);
    return items;
  }, [currentMonthMeta]);

  const monthLabel = useMemo(() => {
    const { monthName } = currentMonthMeta;
    const cap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${cap} ${today.getFullYear()}`;
  }, [currentMonthMeta, today]);

  const availableDays = useMemo(() => {
    if (!selectedProfessionalId) return new Set<string>();
    return deriveAvailableDaysForMonth(appointments, selectedProfessionalId, today);
  }, [appointments, selectedProfessionalId, today]);

  const slots = useMemo(() => {
    if (!selectedProfessionalId || !selectedDateISO) return [];
    return deriveFreeSlotsForDay(appointments, selectedProfessionalId, selectedDateISO);
  }, [appointments, selectedProfessionalId, selectedDateISO]);


  const slotIdMap = useMemo(() => {
    // Mapea "HH:mm" (local) -> appointment.id del día seleccionado
    const map = new Map<string, string | number>();
    if (!selectedProfessionalId || !selectedDateISO) return map;

    // Recorremos los appointments del profesional en ese día (local)
    for (const a of appointments) {
      if (String(a.professional) !== String(selectedProfessionalId)) continue;
      if (getLocalDateISOFromStart(a) !== selectedDateISO) continue;
      if (a.status !== 'available') continue;

      // Convertir startTime UTC -> hora local HH:mm (igual a deriveFreeSlotsForDay)
      const d = new Date(a.startTime);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const hhmm = `${hh}:${mm}`;

      // Guardamos el id (si hay duplicados de hora por cualquier motivo, el último pisa al anterior)
      map.set(hhmm, a.id);
    }
    return map;
  }, [appointments, selectedProfessionalId, selectedDateISO]);

  useEffect(() => {
    if (!selectedProfessionalId || !selectedDateISO) {
      setLoadingSlots(false);
      return;
    }
    setLoadingSlots(true);
    const t = setTimeout(() => setLoadingSlots(false), 250);
    return () => clearTimeout(t);
  }, [selectedProfessionalId, selectedDateISO]);

  const canOpenCalendar = !loadingMeta && selectedProfessionalId !== '';

  function dayState(dayNum: number | null) {
    if (dayNum === null) return { disabled: true, available: false, iso: '' };
    const d = new Date(today.getFullYear(), today.getMonth(), dayNum);
    const iso = toISO(d);
    const isSunday = d.getDay() === 0;
    const past = isPast(d);
    const available = !!selectedProfessionalId && availableDays.has(iso);
    const disabled = past || isSunday || !available || !canOpenCalendar;
    return { disabled, available, iso };
  }

  // ====== Confirmar turno ======
  async function onConfirm() {
    if (!selectedOccupationId || !selectedProfessionalId || !selectedDateISO || !selectedSlot) return;
    setBookingState('submitting');
    setError(null);

    const payload = { //el assign del back solamente usa id de turno e id de paciente
      idAppointment: selectedAppointmentId, //ID DE TURNO
      idPatient: selectedPatientId,
    };

    try {

      // FALTA... el id de paciente para asignar...
      
      if (!selectedAppointmentId) {
        setToast({ message: 'Elegí un horario válido antes de confirmar.', type: 'error' });
        setBookingState('error');
        return;
      }

      const res = await fetch(`http://localhost:2000/Appointment/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Mostrar toast SIEMPRE con el resultado
      const toastData = await handleResponse(res);
      setToast(toastData);

      if (!res.ok) {
        // 409 u otro error: mantenemos el estado de error del modal
        setBookingState('error');
        return;
      }

      // Éxito: refrescar turnos del mes para bloquear el slot tomado
      try {
        const resAll = await fetch(`http://localhost:2000/Appointment/getAll`, { method: 'GET' });
        if (resAll.ok) {
          const all: Appointment[] = await resAll.json();


          const { year, month } = currentMonthMeta;
          const start = new Date(year, month, 1);
          const end   = new Date(year, month + 1, 0);
          const normalizeDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

          const inMonth = all.filter((a) => {
            const dLocal = new Date(a.startTime);
            const day    = normalizeDay(dLocal);
            return day >= start && day <= end;
          });

          setAppointments(inMonth);
        } else {
          const td = await handleResponse(resAll);
          setToast(td);
        }
      } catch {
        // Si falla el refresco, no rompemos el success del modal
      }

      setBookingState('success');
    } catch {
      setToast({ message: 'No se pudo confirmar el turno.', type: 'error' });
      setBookingState('error');
    }
  }

  function resetModal() {
    setConfirmOpen(false);
    setBookingState('idle');
  }

  const selectedOccupation = occupations.find((s) => s.id === selectedOccupationId);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);

  return (
    <>
      <AppointmentScheduleForm

        patients={patients}
        loadingPatients={loadingPatients}
        selectedPatientId={selectedPatientId}
        onChangePatient={setSelectedPatientId}

        occupations={occupations}
        professionals={professionals}
        loadingMeta={loadingMeta}
        loadingProfessionals={loadingProfessionals}
        monthLabel={monthLabel}
        daysArray={daysArray}
        dayState={dayState}
        canOpenCalendar={canOpenCalendar}
        loadingMonth={loadingMonth}
        slots={slots}
        loadingSlots={loadingSlots}
        selectedOccupationId={selectedOccupationId}
        selectedProfessionalId={selectedProfessionalId}
        selectedDateISO={selectedDateISO}
        selectedSlot={selectedSlot}
        selectedOccupationName={selectedOccupation?.name}
        selectedProfessionalFullName={fullName(selectedProfessional)}
        error={error}
        onChangeOccupation={setSelectedOccupationId}
        onChangeProfessional={setSelectedProfessionalId}
        onPickDay={(iso) => {
          setSelectedDateISO(iso);
          setSelectedSlot('');
          setSelectedAppointmentId(null);
        }}
        onPickSlot={(hhmm: string) => {
          setSelectedSlot(hhmm);
          setSelectedAppointmentId(slotIdMap.get(hhmm) ?? null);
        }}
        onOpenConfirm={() => setConfirmOpen(true)}
        onCloseConfirm={resetModal}
        onConfirm={onConfirm}
        confirmOpen={confirmOpen}
        bookingState={bookingState}
      />

      {/* ===== TOAST ===== */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}