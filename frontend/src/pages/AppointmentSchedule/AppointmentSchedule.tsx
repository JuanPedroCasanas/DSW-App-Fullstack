import React, { useEffect, useMemo, useState } from 'react';
import './appointmentSchedule.css';

// ========================
// Utilidades de fechas
// ========================
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
  // Semana que empieza en Lunes (1) y termina en Domingo (0 o 7)
  const jsDayToMonStart = (d: number) => (d === 0 ? 7 : d); // 1..7
  const leadingBlanks = jsDayToMonStart(first.getDay()) - 1; // 0..6
  const monthName = base.toLocaleString('es-AR', { month: 'long' });
  return { year, month, first, last, daysInMonth, leadingBlanks, monthName };
}
function isPast(d: Date) {
  const now = new Date();
  // Comparar por fecha sin hora
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cmp < today;
}

// ========================
// HARDCODEADOOSSSS 
// hay que eliminarlossss
// solo como ejemplo :)
type Specialty = { id: 'psi' | 'psp'; nombre: string };

const SPECIALTIES: Specialty[] = [
  { id: 'psi', nombre: 'Psicología' },
  { id: 'psp', nombre: 'Psicopedagogía' },
];

type Professional = { id: string; nombre: string; specialtyId: Specialty['id'] };

const PROFESSIONALS: Professional[] = [
  // Psicología
  { id: 'p-ana', nombre: 'Lic. Ana Pérez', specialtyId: 'psi' },
  { id: 'p-martin', nombre: 'Lic. Martín Gómez', specialtyId: 'psi' },
  // Psicopedagogía
  { id: 'p-sofia', nombre: 'Lic. Sofía Torres', specialtyId: 'psp' },
  { id: 'p-diego', nombre: 'Lic. Diego Rivas', specialtyId: 'psp' },
];

// Config de slots de ejemplo (siempre 60')
const EXAMPLE_SLOTS = ['09:00','10:00','11:00','14:00','15:00','16:00'];

// Disponibilidad por profesional en el mes actual: lista de días del mes que tienen al menos 1 turno.
// Por simplicidad, asigno distintos patrones. Domingos NO cuentan disponibilidad.
function buildAvailabilityForCurrentMonth() {
  const base = new Date();
  const { year, month, daysInMonth } = getMonthMeta(base);
  const isSunday = (d: Date) => d.getDay() === 0;

  const patterns: Record<string, number[]> = {
    // Días del mes con disponibilidad por profesional (números de día)
    'p-ana': [1, 3, 5, 8, 10, 15, 17, 22, 24, 29],
    'p-martin': [2, 4, 9, 11, 16, 18, 23, 25, 30],
    'p-sofia': [1, 6, 7, 13, 14, 20, 21, 27, 28],
    'p-diego': [2, 5, 12, 19, 26],
  };
  
  const availability: Record<string, Set<string>> = {};

  Object.keys(patterns).forEach(pid => {
    availability[pid] = new Set<string>();
    patterns[pid].forEach(dayNum => {
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        const d = new Date(year, month, dayNum);
        if (!isSunday(d)) {
          availability[pid].add(toISO(d));
        }
      }
    });
  });
  return availability;
}

const AVAILABILITY_BY_PRO = buildAvailabilityForCurrentMonth();

// Slots por fecha: para hacerlo visible, algunos días tendrán menos ranuras.
function getSlotsFor(professionalId: string, isoDate: string): string[] {
  const available = AVAILABILITY_BY_PRO[professionalId];
  if (!available || !available.has(isoDate)) return [];
  // Sembrar variedad: según el día del mes
  const day = parseInt(isoDate.split('-')[2], 10);
  if (day % 5 === 0) return ['09:00', '10:00'];
  if (day % 3 === 0) return ['11:00', '14:00', '15:00'];
  return EXAMPLE_SLOTS;
}

// ========================
// Componentes
// ========================

const WeekdayLabels: React.FC = () => (
  <div className="appointment-schedule__weekday-row" aria-hidden>
    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((w, i) => (
      <div key={i} className={`appointment-schedule__weekday${i===6?' --sun':''}`}>{w}</div>
    ))}
  </div>
);

export default function AppointmentSchedule() {
  const today = new Date(); // ver,,,,
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<Specialty['id'] | ''>('');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedDateISO, setSelectedDateISO] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingState, setBookingState] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  // Filtro de profesionales por especialidad
  const professionals = useMemo(() => {
    return PROFESSIONALS.filter(p => p.specialtyId === selectedSpecialtyId);
  }, [selectedSpecialtyId]);

  const currentMonthMeta = useMemo(() => getMonthMeta(today), []);

  // Reset dependencias cuando cambia selección
  useEffect(() => {
    setSelectedProfessionalId('');
    setSelectedDateISO('');
    setSelectedSlot('');
  }, [selectedSpecialtyId]);

  useEffect(() => {
    setSelectedDateISO('');
    setSelectedSlot('');
    if (!selectedProfessionalId) return;
    // Simular carga de disponibilidad mensual
    setLoadingMonth(true);
    const t = setTimeout(() => setLoadingMonth(false), 400);
    return () => clearTimeout(t);
  }, [selectedProfessionalId]);

  useEffect(() => {
    setSelectedSlot('');
    if (!selectedProfessionalId || !selectedDateISO) { setSlots([]); return; }
    setLoadingSlots(true);
    const t = setTimeout(() => {
      setSlots(getSlotsFor(selectedProfessionalId, selectedDateISO));
      setLoadingSlots(false);
    }, 350);
    return () => clearTimeout(t);
  }, [selectedProfessionalId, selectedDateISO]);

  // Helpers de render del calendario
  const daysArray = useMemo(() => {
    
    // year month todavia no lo usamos pero lo dejo por las dudas
    const { daysInMonth, leadingBlanks } = currentMonthMeta;
    const items: (number | null)[] = [];
    for (let i=0; i<leadingBlanks; i++) items.push(null);
    for (let d=1; d<=daysInMonth; d++) items.push(d);
    return items;
  }, [currentMonthMeta]);

  const monthLabel = useMemo(() => {
    const { monthName } = currentMonthMeta;
    const cap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${cap} ${today.getFullYear()}`;
  }, [currentMonthMeta, today]);

  const canOpenCalendar = selectedProfessionalId !== '';

  // Reglas de selección de día
  function dayState(dayNum: number | null) {
    if (dayNum === null) return { disabled: true, available: false, iso: '' };
    const d = new Date(today.getFullYear(), today.getMonth(), dayNum);
    const iso = toISO(d);
    const isSunday = d.getDay() === 0; // domingo
    const past = isPast(d);
    const available = !!selectedProfessionalId && !!AVAILABILITY_BY_PRO[selectedProfessionalId]?.has(iso);
    // Reglas: no seleccionar si pasado, si domingo o si no hay disponibilidad
    const disabled = past || isSunday || !available || !canOpenCalendar;
    return { disabled, available, iso };
  }

  const selectedSpecialty = SPECIALTIES.find(s => s.id === selectedSpecialtyId);
  const selectedProfessional = PROFESSIONALS.find(p => p.id === selectedProfessionalId);

  // Acciones
  function onConfirm() {
    setBookingState('submitting');
    // Simular reserva; sin precio, presencial, 60'
    setTimeout(() => {
      // 1/20 chance de error de concurrencia
      if (Math.random() < 0.05) {
        setBookingState('error');
        return;
      }
      setBookingState('success');
    }, 700);
  }

  function resetModal() {
    setConfirmOpen(false);
    setBookingState('idle');
  }

  const ctaDisabled = !(selectedSpecialtyId && selectedProfessionalId && selectedDateISO && selectedSlot);

  return (
    <section className="appointment-schedule" aria-label="Reservar turno">
      <header className="appointment-schedule__header">
        <h2 className="appointment-schedule__title">Reservá tu turno</h2>
      </header>

      {/* Filtros */}
      <div className="appointment-schedule__filters">
        <div className="appointment-schedule__field">
          <label htmlFor="specialty" className="appointment-schedule__label">Especialidad</label>
          <select
            id="specialty"
            className="appointment-schedule__select"
            value={selectedSpecialtyId}
            onChange={(e) => setSelectedSpecialtyId(e.target.value as Specialty['id'])}
          >
            <option value="" disabled>Elegí una especialidad</option>
            {SPECIALTIES.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
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
            disabled={!selectedSpecialtyId || professionals.length === 0}
          >
            <option value="" disabled>{!selectedSpecialtyId ? 'Primero elegí especialidad' : (professionals.length ? 'Elegí un profesional' : 'Sin profesionales disponibles')}</option>
            {professionals.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
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

        {!canOpenCalendar && (
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
                      onClick={() => { if (!disabled && iso) { setSelectedDateISO(iso); } }}
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

      {/* CTA sticky */}
      <div className="appointment-schedule__cta">
        <button
          className="appointment-schedule__cta-button"
          disabled={ctaDisabled}
          onClick={() => setConfirmOpen(true)}
        >
          Reservar turno
        </button>
      </div>

      {/* Modal de confirmación */}
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
                    <div><dt>Especialidad</dt><dd>{selectedSpecialty?.nombre}</dd></div>
                    <div><dt>Profesional</dt><dd>{selectedProfessional?.nombre}</dd></div>
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
                  {selectedProfessional?.nombre} · {selectedSpecialty?.nombre}<br />
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
