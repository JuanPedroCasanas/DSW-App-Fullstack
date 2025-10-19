import React, { useEffect, useMemo, useState } from 'react';
import './appointmentSchedule.css';

/* =================== Utils de fechas =================== */
function pad(n: number) { return n.toString().padStart(2,'0'); }
function toISO(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function toDDMMYYYY(iso: string) {
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function getMonthMeta(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  const daysInMonth = last.getDate();
  const jsDayToMonStart = (d: number) => (d === 0 ? 7 : d); // L=1..D=7
  const leadingBlanks = jsDayToMonStart(first.getDay()) - 1;
  const monthName = base.toLocaleString('es-AR', { month: 'long' });
  return { year, month, first, last, daysInMonth, leadingBlanks, monthName };
}
function isPast(d: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cmp < today;
}

/* =================== Tipos & Config =================== */

type Occupation = { id: string; name: string };

type Professional = {
  id: string;
  firstName: string;
  lastName: string;
};

type AppointmentStatus = 'assigned' | 'completed' | 'canceled' | 'missed';
type Appointment = {
  id: string;
  professionalId: string;
  occupationId: string; // en backend es "occupation", no "specialty"
  dateISO: string;      // YYYY-MM-DD
  time: string;         // HH:mm
  status: AppointmentStatus;
};

// Slots fijos de 60' (si el backend provee agenda dinámica, avisame y lo integramos)
const WORKING_SLOTS = ['09:00','10:00','11:00','14:00','15:00','16:00'];

/* =================== API layer =================== */
async function safeText(res: Response) { try { return await res.text(); } catch { return ''; } }

async function apiGetAllAppointments(): Promise<Appointment[]> {
  const res = await fetch(`http://localhost:2000/Appointment/getAll`, { method: 'GET' });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Error al cargar turnos (${res.status}): ${msg || res.statusText}`);
  }
  return res.json();
}

async function apiAssignAppointment(payload: {
  professionalId: string;
  occupationId: string;
  dateISO: string;
  time: string;
}) {
  const res = await fetch(`http://localhost:2000/Appointment/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) {
    const msg = await safeText(res);
    const err: any = new Error(msg || 'Conflicto: el turno ya fue tomado.');
    err.name = 'ConflictError';
    throw err;
  }
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Error al confirmar turno (${res.status}): ${msg || res.statusText}`);
  }
  try { return await res.json(); } catch { return {}; }
}

async function apiGetOccupations(): Promise<Occupation[]> {
  const res = await fetch(`http://localhost:2000/Occupation/getAll`, { method: 'GET' });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Error al cargar especialidades (${res.status}): ${msg || res.statusText}`);
  }
  return res.json();
}

async function apiGetProfessionalsByOccupation(occupationId: string): Promise<Professional[]> {
  // Ruta final que dejaste: /getProfessionalsByOccupation/:id
  const res = await fetch(`http://localhost:2000/Professional/getProfessionalsByOccupation/${encodeURIComponent(occupationId)}`, {
    method: 'GET'
  });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(`Error al cargar profesionales (${res.status}): ${msg || res.statusText}`);
  }
  return res.json();
}

/* =================== Derivadores de disponibilidad =================== */
function deriveAvailableDaysForMonth(appointments: Appointment[], professionalId: string, base: Date) {
  const { year, month, daysInMonth } = getMonthMeta(base);
  const set = new Set<string>();
  for (let d=1; d<=daysInMonth; d++) {
    const date = new Date(year, month, d);
    const iso = toISO(date);
    const isSunday = date.getDay() === 0;
    if (isSunday || isPast(date)) continue;
    const dayTaken = new Set(
      appointments
        .filter(a => a.professionalId === professionalId && a.dateISO === iso && (a.status === 'assigned' || a.status === 'completed'))
        .map(a => a.time)
    );
    const hasFree = WORKING_SLOTS.some(h => !dayTaken.has(h));
    if (hasFree) set.add(iso);
  }
  return set;
}

function deriveFreeSlotsForDay(appointments: Appointment[], professionalId: string, dateISO: string) {
  const taken = new Set(
    appointments
      .filter(a => a.professionalId === professionalId && a.dateISO === dateISO && (a.status === 'assigned' || a.status === 'completed'))
      .map(a => a.time)
  );
  return WORKING_SLOTS.filter(h => !taken.has(h));
}

/* =================== UI helpers =================== */
const WeekdayLabels: React.FC = () => (
  <div className="appointment-schedule__weekday-row" aria-hidden>
    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((w, i) => (
      <div key={i} className={`appointment-schedule__weekday${i===6?' --sun':''}`}>{w}</div>
    ))}
  </div>
);
const fullName = (p?: Professional) => p ? `${p.firstName} ${p.lastName}` : '' ;

/* =================== Componente =================== */
export default function AppointmentSchedule() {
  //hago esto para evitar un loop infinito 
  const todayRef = React.useRef(new Date());     // se conserva entre renders
  const today = todayRef.current;


  // Catálogos
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);

  // Filtros
  const [selectedOccupationId, setSelectedOccupationId] = useState<Occupation['id']>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');

  // Selección
  const [selectedDateISO, setSelectedDateISO] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Turnos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingState, setBookingState] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  /* Carga inicial: occupations */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingMeta(true);
        const occs = await apiGetOccupations();
        if (cancelled) return;
        setOccupations(occs);
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar las especialidades.');
      } finally {
        setLoadingMeta(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Al cambiar Especialidad, traer profesionales filtrados */
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
        const pros = await apiGetProfessionalsByOccupation(String(selectedOccupationId));
        if (cancelled) return;
        setProfessionals(pros);
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar los profesionales.');
        setProfessionals([]);
      } finally {
        setLoadingProfessionals(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedOccupationId]);

  /* Al elegir profesional, cargar turnos del mes (y filtrar por mes actual) */
  const currentMonthMeta = useMemo(() => getMonthMeta(today), []);

  useEffect(() => {
    setSelectedDateISO('');
    setSelectedSlot('');
    if (!selectedProfessionalId) return;

    let cancelled = false;
    (async () => {
      try {
        setError(null);
        setLoadingMonth(true);
        // Si tu backend acepta filtros: /getAll?professionalId=...&month=YYYY-MM
        const all = await apiGetAllAppointments();
        if (cancelled) return;

        const { year, month } = currentMonthMeta;
        const start = new Date(year, month, 1);
        const end = new Date(year, month+1, 0);
        const inMonth = all.filter(a => {
          const [Y,M,D] = a.dateISO.split('-').map(Number);
          const d = new Date(Y, (M-1), D);
          return d >= start && d <= end;
        });

        setAppointments(inMonth);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar turnos.');
        setAppointments([]);
      } finally {
        setLoadingMonth(false);
      }
    })();

    return () => { cancelled = true; };
  }, [selectedProfessionalId, currentMonthMeta]);

  /* Disponibilidad & slots derivados */
  const daysArray = useMemo(() => {
    const { daysInMonth, leadingBlanks } = currentMonthMeta;
    const items: (number|null)[] = [];
    for (let i=0; i<leadingBlanks; i++) items.push(null);
    for (let d=1; d<=daysInMonth; d++) items.push(d);
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

  useEffect(() => {
    if (!selectedProfessionalId || !selectedDateISO) { setLoadingSlots(false); return; }
    setLoadingSlots(true);
    const t = setTimeout(() => setLoadingSlots(false), 250);
    return () => clearTimeout(t);
  }, [selectedProfessionalId, selectedDateISO]);

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

  const selectedOccupation = occupations.find(s => s.id === selectedOccupationId);
  const selectedProfessional = professionals.find(p => p.id === selectedProfessionalId);

  async function onConfirm() {
    if (!selectedOccupationId || !selectedProfessionalId || !selectedDateISO || !selectedSlot) return;
    setBookingState('submitting');
    setError(null);

    try {
      await apiAssignAppointment({
        professionalId: selectedProfessionalId,
        occupationId: selectedOccupationId,
        dateISO: selectedDateISO,
        time: selectedSlot,
      });

      // Refrescar turnos del mes para bloquear el slot tomado
      try {
        const all = await apiGetAllAppointments();
        const { year, month } = currentMonthMeta;
        const start = new Date(year, month, 1);
        const end = new Date(year, month+1, 0);
        const inMonth = all.filter(a => {
          const [Y,M,D] = a.dateISO.split('-').map(Number);
          const d = new Date(Y, (M-1), D);
          return d >= start && d <= end;
        });
        setAppointments(inMonth);
      } catch {}

      setBookingState('success');
    } catch (e: any) {
      if (e?.name === 'ConflictError') {
        setBookingState('error');
      } else {
        setError(e?.message || 'No se pudo confirmar el turno.');
        setBookingState('error');
      }
    }
  }

  function resetModal() {
    setConfirmOpen(false);
    setBookingState('idle');
  }

  const canOpenCalendar = !loadingMeta && selectedProfessionalId !== '';
  const ctaDisabled = !(selectedOccupationId && selectedProfessionalId && selectedDateISO && selectedSlot);

  return (
    <section className="appointment-schedule" aria-label="Reservar turno">
      <header className="appointment-schedule__header">
        <h2 className="appointment-schedule__title">Reservá tu turno</h2>
      </header>

      {/* Filtros */}
      <div className="appointment-schedule__filters">
        <div className="appointment-schedule__field">
          <label htmlFor="occupation" className="appointment-schedule__label">Especialidad</label>
          <select
            id="occupation"
            className="appointment-schedule__select"
            value={selectedOccupationId}
            onChange={(e) => setSelectedOccupationId(e.target.value as Occupation['id'])}
            disabled={loadingMeta}
          >
            <option value="" disabled>{loadingMeta ? 'Cargando…' : 'Elegí una especialidad'}</option>
            {occupations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        <div className="appointment-schedule__field">
          <label htmlFor="professional" className="appointment-schedule__label">Profesional</label>
          <select
            id="professional"
            className="appointment-schedule__select"
            value={selectedProfessionalId}
            onChange={(e) => setSelectedProfessionalId(e.target.value)}
            disabled={loadingMeta || !selectedOccupationId || loadingProfessionals || professionals.length === 0}
          >
            <option value="" disabled>
              {loadingMeta
                ? 'Cargando…'
                : (!selectedOccupationId
                    ? 'Primero elegí especialidad'
                    : (loadingProfessionals
                        ? 'Cargando profesionales…'
                        : (professionals.length ? 'Elegí un profesional' : 'Sin profesionales disponibles')))}
            </option>
            {professionals.map(p => (
              <option key={p.id} value={p.id}>{fullName(p)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendario del mes actual */}
      <div className="appointment-schedule__calendar">
        <div className="appointment-schedule__month-header">
          <div className="appointment-schedule__month-label">{monthLabel}</div>
          <div className="appointment-schedule__month-note">Solo mes en curso · 60’ · Presencial</div>
        </div>

        {!canOpenCalendar && !loadingMeta && (
          <div className="appointment-schedule__hint">Elegí especialidad y profesional para ver el calendario.</div>
        )}

        {canOpenCalendar && (
          <>
            {loadingMonth ? (
              <div className="appointment-schedule__calendar-skeleton" aria-hidden />
            ) : (
              <div className="appointment-schedule__grid" role="grid" aria-label={`Calendario ${monthLabel}`}>
                <WeekdayLabels />
                {daysArray.map((dayNum, idx) => {
                  const { disabled, available, iso } = dayState(dayNum);
                  const isSelected = !!(selectedDateISO && iso && selectedDateISO === iso);
                  return (
                    <button
                      key={idx}
                      role={dayNum ? 'gridcell' : undefined}
                      className={[
                        'appointment-schedule__day',
                        disabled ? '--disabled' : '',
                        available ? '--available' : '',
                        isSelected ? '--selected' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => { if (!disabled && iso) { setSelectedDateISO(iso); setSelectedSlot(''); } }}
                      disabled={disabled || !dayNum}
                      aria-pressed={isSelected}
                      aria-label={dayNum ? `Día ${dayNum}${available ? ' con disponibilidad' : ''}` : undefined}
                    >
                      {dayNum && <span className="appointment-schedule__day-number">{dayNum}</span>}
                      {dayNum && available && <span className="appointment-schedule__day-dot" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Slots del día */}
      {canOpenCalendar && selectedDateISO && (
        <div className="appointment-schedule__slots">
          <h3 className="appointment-schedule__subtitle">Horarios disponibles</h3>
          {loadingSlots ? (
            <div className="appointment-schedule__slots-skeleton" aria-hidden />
          ) : slots.length ? (
            <div className="appointment-schedule__slots-list">
              {slots.map(h => {
                const active = selectedSlot === h;
                return (
                  <button
                    key={h}
                    className={[
                      'appointment-schedule__slot',
                      active ? '--selected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelectedSlot(h)}
                    aria-pressed={active}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="appointment-schedule__empty">No hay horarios disponibles para el día seleccionado.</div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="appointment-schedule__cta">
        <button
          className="appointment-schedule__cta-button"
          disabled={ctaDisabled}
          onClick={() => setConfirmOpen(true)}
        >
          Reservar turno
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div role="alert" className="appointment-schedule__error-banner">
          {error}
        </div>
      )}

      {/* Modal */}
      {confirmOpen && (
        <div className="appointment-schedule__modal-backdrop" role="presentation" onClick={resetModal}>
          <div
            className="appointment-schedule__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {bookingState !== 'success' && (
              <>
                <h3 id="modal-title" className="appointment-schedule__modal-title">Confirmar turno</h3>
                <div id="modal-desc" className="appointment-schedule__modal-body">
                  <dl className="appointment-schedule__summary">
                    <div><dt>Especialidad</dt><dd>{selectedOccupation?.name}</dd></div>
                    <div><dt>Profesional</dt><dd>{fullName(selectedProfessional)}</dd></div>
                    <div><dt>Fecha</dt><dd>{toDDMMYYYY(selectedDateISO)}</dd></div>
                    <div><dt>Hora</dt><dd>{selectedSlot}</dd></div>
                    <div><dt>Duración</dt><dd>60 minutos</dd></div>
                    <div><dt>Modalidad</dt><dd>Presencial</dd></div>
                  </dl>
                </div>
                <div className="appointment-schedule__modal-actions">
                  <button className="appointment-schedule__btn-secondary" onClick={resetModal}>Cancelar</button>
                  <button className="appointment-schedule__btn-primary" onClick={onConfirm} disabled={bookingState==='submitting'}>
                    {bookingState==='submitting' ? 'Confirmando…' : 'Confirmar'}
                  </button>
                </div>
                {bookingState==='error' && (
                  <p className="appointment-schedule__error">Ese horario se ocupó recién. Elegí otro, por favor.</p>
                )}
              </>
            )}

            {bookingState === 'success' && (
              <div className="appointment-schedule__success">
                <div className="appointment-schedule__success-icon" aria-hidden>✓</div>
                <h3 className="appointment-schedule__modal-title">¡Turno confirmado!</h3>
                <p className="appointment-schedule__success-text">
                  {fullName(selectedProfessional)} · {selectedOccupation?.name}<br />
                  {toDDMMYYYY(selectedDateISO)} · {selectedSlot} hs · 60’ · Presencial
                </p>
                <div className="appointment-schedule__modal-actions">
                  <button className="appointment-schedule__btn-secondary" onClick={resetModal}>Cerrar</button>
                  <button className="appointment-schedule__btn-primary" disabled>Mis turnos</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
