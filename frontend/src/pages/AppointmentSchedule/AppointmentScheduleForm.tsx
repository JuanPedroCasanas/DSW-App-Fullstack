// pages/AppointmentSchedule/AppointmentScheduleForm.tsx
import React from 'react';
import './appointmentSchedule.css';
// src/pages/AppointmentSchedule/AppointmentScheduleForm.tsx
import { toDDMMYYYY, fullName } from './appointmentSchedule.types';

type Props = {
  occupations: { id: string; name: string }[];
  professionals: { id: string; firstName: string; lastName: string }[];
  loadingMeta: boolean;
  loadingProfessionals: boolean;

  monthLabel: string;
  daysArray: (number | null)[];
  dayState: (dayNum: number | null) => { disabled: boolean; available: boolean; iso: string };
  canOpenCalendar: boolean;
  loadingMonth: boolean;
  slots: string[];
  loadingSlots: boolean;

  selectedOccupationId: string;
  selectedProfessionalId: string;
  selectedDateISO: string;
  selectedSlot: string;
  selectedOccupationName?: string;
  selectedProfessionalFullName?: string;
  error?: string | null;

  onChangeOccupation: (id: string) => void;
  onChangeProfessional: (id: string) => void;
  onPickDay: (iso: string) => void;
  onPickSlot: (h: string) => void;
  onOpenConfirm: () => void;
  onCloseConfirm: () => void;
  onConfirm: () => void;

  confirmOpen: boolean;
  bookingState: 'idle' | 'submitting' | 'success' | 'error';
};

const WeekdayLabels: React.FC = () => (
  <div className="appointment-schedule__weekday-row" aria-hidden>
    {['L','M','M','J','V','S','D'].map((w, i) => (
      <div key={i} className={'appointment-schedule__weekday' + (i===6 ? ' --sun' : '')}>{w}</div>
    ))}
  </div>
);

export const AppointmentScheduleForm: React.FC<Props> = (props) => {
  const {
    occupations, professionals,
    loadingMeta, loadingProfessionals,
    monthLabel, daysArray, dayState,
    canOpenCalendar, loadingMonth, slots, loadingSlots,
    selectedOccupationId, selectedProfessionalId, selectedDateISO, selectedSlot,
    selectedOccupationName, selectedProfessionalFullName,
    error,
    onChangeOccupation, onChangeProfessional, onPickDay, onPickSlot,
    onOpenConfirm, onCloseConfirm, onConfirm,
    confirmOpen, bookingState,
  } = props;

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
            onChange={(e) => onChangeOccupation(e.target.value)}
            disabled={loadingMeta}
          >
            <option value="" disabled>{loadingMeta ? 'Cargando…' : 'Elegí una especialidad'}</option>
            {occupations.map(function (o) {
              return <option key={o.id} value={o.id}>{o.name}</option>;
            })}
          </select>
        </div>

        <div className="appointment-schedule__field">
          <label htmlFor="professional" className="appointment-schedule__label">Profesional</label>
          <select
            id="professional"
            className="appointment-schedule__select"
            value={selectedProfessionalId}
            onChange={(e) => onChangeProfessional(e.target.value)}
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
            {professionals.map(function (p) {
              return <option key={p.id} value={p.id}>{fullName(p)}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Calendario */}
      <div className="appointment-schedule__calendar">
        <div className="appointment-schedule__month-header">
          <div className="appointment-schedule__month-label">{monthLabel}</div>
          <div className="appointment-schedule__month-note">Presencial</div>
        </div>

        {!canOpenCalendar && !loadingMeta && (
          <div className="appointment-schedule__hint">Elegí especialidad y profesional para ver el calendario.</div>
        )}

        {canOpenCalendar && (
          <>
            {loadingMonth ? (
              <div className="appointment-schedule__calendar-skeleton" aria-hidden />
            ) : (
              <div className="appointment-schedule__grid" role="grid" aria-label={'Calendario ' + monthLabel}>
                <WeekdayLabels />
                {daysArray.map(function (dayNum, idx) {
                  const st = dayState(dayNum);
                  const disabled = st.disabled;
                  const available = st.available;
                  const iso = st.iso;
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
                      onClick={function () { if (!disabled && iso) { onPickDay(iso); } }}
                      disabled={disabled || !dayNum}
                      aria-pressed={isSelected}
                      aria-label={dayNum ? ('Día ' + dayNum + (available ? ' con disponibilidad' : '')) : undefined}
                    >
                      {dayNum ? <span className="appointment-schedule__day-number">{dayNum}</span> : null}
                      {dayNum && available ? <span className="appointment-schedule__day-dot" aria-hidden /> : null}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Slots */}
      {canOpenCalendar && selectedDateISO && (
        <div className="appointment-schedule__slots">
          <h3 className="appointment-schedule__subtitle">Horarios disponibles</h3>
          {loadingSlots ? (
            <div className="appointment-schedule__slots-skeleton" aria-hidden />
          ) : (slots.length ? (
            <div className="appointment-schedule__slots-list">
              {slots.map(function (h) {
                const active = selectedSlot === h;
                return (
                  <button
                    key={h}
                    className={['appointment-schedule__slot', active ? '--selected' : ''].filter(Boolean).join(' ')}
                    onClick={function () { onPickSlot(h); }}
                    aria-pressed={active}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="appointment-schedule__empty">No hay horarios disponibles para el día seleccionado.</div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="appointment-schedule__cta">
        <button className="appointment-schedule__cta-button" disabled={ctaDisabled} onClick={onOpenConfirm}>
          Reservar turno
        </button>
      </div>

      {/* Error global */}
      {error ? (
        <div role="alert" className="appointment-schedule__error-banner">
          {error}
        </div>
      ) : null}

      {/* Modal */}
      {confirmOpen && (
        <div className="appointment-schedule__modal-backdrop" role="presentation" onClick={onCloseConfirm}>
          <div
            className="appointment-schedule__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            onClick={function (e) { e.stopPropagation(); }}
          >
            {bookingState !== 'success' ? (
              <>
                <h3 id="modal-title" className="appointment-schedule__modal-title">Confirmar turno</h3>
                <div id="modal-desc" className="appointment-schedule__modal-body">
                  <dl className="appointment-schedule__summary">
                    <div><dt>Especialidad</dt><dd>{selectedOccupationName}</dd></div>
                    <div><dt>Profesional</dt><dd>{selectedProfessionalFullName}</dd></div>
                    <div><dt>Fecha</dt><dd>{toDDMMYYYY(selectedDateISO)}</dd></div>
                    <div><dt>Hora</dt><dd>{selectedSlot}</dd></div>
                    <div><dt>Duración</dt><dd>60 minutos</dd></div>
                    <div><dt>Modalidad</dt><dd>Presencial</dd></div>
                  </dl>
                </div>
                <div className="appointment-schedule__modal-actions">
                  <button className="appointment-schedule__btn-secondary" onClick={onCloseConfirm}>Cancelar</button>
                  <button className="appointment-schedule__btn-primary" onClick={onConfirm} disabled={bookingState === 'submitting'}>
                    {bookingState === 'submitting' ? 'Confirmando…' : 'Confirmar'}
                  </button>
                </div>
                {bookingState === 'error' ? (
                  <p className="appointment-schedule__error">Ese horario se ocupó recién. Elegí otro, por favor.</p>
                ) : null}
              </>
            ) : (
              <div className="appointment-schedule__success">
                <div className="appointment-schedule__success-icon" aria-hidden>✓</div>
                <h3 className="appointment-schedule__modal-title">¡Turno confirmado!</h3>
                <p className="appointment-schedule__success-text">
                  {selectedProfessionalFullName} · {selectedOccupationName}<br />
                  {toDDMMYYYY(selectedDateISO)} · {selectedSlot} hs · 60’ · Presencial
                </p>
                <div className="appointment-schedule__modal-actions">
                  <button className="appointment-schedule__btn-secondary" onClick={onCloseConfirm}>Cerrar</button>
                  <button className="appointment-schedule__btn-primary" disabled>Mis turnos</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
