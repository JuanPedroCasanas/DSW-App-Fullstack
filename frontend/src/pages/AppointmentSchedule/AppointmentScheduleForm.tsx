import React from "react";


import { FormField, Card, FilterBar,
  CalendarGrid, SlotsCarousel, StickyCTA, ConfirmBookingModal
 } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import { fullName } from "./appointmentSchedule.helpers";
import { Occupation, Patient, Professional } from "@/common/types";

type Props = {
  patients: Patient[];
  occupations: Occupation[];
  professionals: Professional[];
  loadingMeta: boolean;
  loadingProfessionals: boolean;
  loadingPatients: boolean;

  monthLabel: string;
  daysArray: (number | null)[];
  dayState: (dayNum: number | null) => { disabled: boolean; available: boolean; iso: string };
  canOpenCalendar: boolean;
  loadingMonth: boolean;

  slots: string[];
  loadingSlots: boolean;

  selectedOccupationId: number | undefined;
  selectedProfessionalId: number | null;
  selectedPatientId: number | null;
  selectedDateISO: string;
  selectedSlot: string;

  selectedOccupationName?: string;
  selectedProfessionalFullName?: string;

  error?: string | null;

  onChangePatient: (id: number) => void;
  onChangeOccupation: (id: number) => void;
  onChangeProfessional: (id: number) => void;
  onPickDay: (iso: string) => void;
  onPickSlot: (h: string) => void;

  onOpenConfirm: () => void;
  onCloseConfirm: () => void;
  onConfirm: () => void;
  confirmOpen: boolean;
  bookingState: "idle" | "submitting" | "success" | "error";
};

export const AppointmentScheduleForm: React.FC<Props> = (props) => {
  const {
    occupations,
    professionals,
    patients,
    loadingMeta,
    loadingProfessionals,
    loadingPatients,

    monthLabel,
    daysArray,
    dayState,
    canOpenCalendar,
    loadingMonth,

    slots,
    loadingSlots,

    selectedOccupationId,
    selectedProfessionalId,
    selectedPatientId,
    selectedDateISO,
    selectedSlot,

    selectedOccupationName,
    selectedProfessionalFullName,

    error,

    onChangeOccupation,
    onChangeProfessional,
    onPickDay,
    onPickSlot,
    onChangePatient,

    onOpenConfirm,
    onCloseConfirm,
    onConfirm,
    confirmOpen,
    bookingState,
  } = props;

  const ctaDisabled = !(selectedOccupationId && selectedProfessionalId && selectedDateISO && selectedSlot);

  return (
    <Page>
      <SectionHeader title="Reservá tu turno" />

      {/* Filtros */}
        <FilterBar>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Paciente */}
            <FormField label="Paciente" htmlFor="sel-patient">
              <select
                id="sel-patient"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={selectedPatientId ?? ""}
                onChange={(e) => onChangePatient(Number(e.target.value))}
                disabled={loadingPatients}
              >
                <option value="">
                  Seleccioná un paciente activo
                </option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              {loadingPatients && <p className="text-xs text-gray-600 mt-1">Cargando pacientes…</p>}
            </FormField>

            {/* Especialidad */}
            <FormField label="Especialidad" htmlFor="sel-occ">
              <select
                id="sel-occ"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={selectedOccupationId ?? ""}
                onChange={(e) => onChangeOccupation(Number(e.target.value))}
                disabled={loadingMeta || !selectedPatientId}
              >
                <option value="">
                  {loadingMeta ? "Cargando…" : "Elegí una especialidad"}
                </option>
                {occupations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Profesional */}
            <FormField label="Profesional" htmlFor="sel-pro">
              <select
                id="sel-pro"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={selectedProfessionalId ?? ""}
                onChange={(e) => onChangeProfessional(Number(e.target.value))}
                disabled={
                  loadingMeta ||
                  !selectedPatientId ||
                  !selectedOccupationId ||
                  loadingProfessionals ||
                  professionals.length === 0
                }
              >
                <option value="">
                  {loadingMeta
                    ? "Cargando…"
                    : !selectedOccupationId
                    ? "Primero elegí especialidad"
                    : loadingProfessionals
                    ? "Cargando profesionales…"
                    : professionals.length
                    ? "Elegí un profesional"
                    : "Sin profesionales disponibles"}
                </option>
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {fullName(p)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FilterBar>

      {/* Calendario y Slots */}
      <Card>
        <CalendarGrid
          size="sm"
          monthLabel={monthLabel}
          daysArray={daysArray}
          dayState={dayState}
          selectedDateISO={selectedDateISO}
          canOpenCalendar={canOpenCalendar}
          loadingMonth={loadingMonth}
          onPickDay={onPickDay}
        />

        <SlotsCarousel
          slots={slots}
          selectedSlot={selectedSlot}
          loading={loadingSlots}
          onPickSlot={onPickSlot}
        />

        {/* CTA */}
        <StickyCTA disabled={ctaDisabled} onClick={onOpenConfirm}>
          Confirmar turno
        </StickyCTA>
      </Card>

      {/* Modal de confirmación */}
      <ConfirmBookingModal
        open={confirmOpen}
        onClose={onCloseConfirm}
        onConfirm={onConfirm}
        bookingState={bookingState}
        error={error}
        summary={{
          paciente:
            patients.find((p) => p.id === selectedPatientId)
              ? `${patients.find((p) => p.id === selectedPatientId)!.firstName} ${patients.find((p) => p.id === selectedPatientId)!.lastName}`
              : "",
          especialidad: selectedOccupationName ?? "",
          profesional: selectedProfessionalFullName ?? "",
          fechaISO: selectedDateISO,
          hora: selectedSlot,
        }}
      />
    </Page>
  );
};

