import React from "react";
import { PrimaryButton, SummaryList, DialogActions, Modal } from "@/components/ui";

type BookingState = "idle" | "submitting" | "success" | "error";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingState: BookingState;
  error?: string | null;
  summary: {
    paciente?: string;
    especialidad?: string;
    profesional?: string;
    fechaISO?: string; // "YYYY-MM-DD"
    hora?: string; // "HH:mm"
  };
};

function toDDMMYYYY(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export const ConfirmBookingModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  bookingState,
  error,
  summary,
}) => {
  if (!open) return null;

  const { paciente, especialidad, profesional, fechaISO, hora } = summary;

  const isSubmitting = bookingState === "submitting";
  const isSuccess = bookingState === "success";
  const isError = bookingState === "error";

  return (
    <Modal
      title={isSuccess ? "Turno confirmado" : "Confirmar turno"}
      onClose={onClose}
    >
      {/* Body */}
      {!isSuccess ? (
        <>
          <SummaryList
            items={[
              { label: "Paciente", value: paciente ?? "" },
              { label: "Especialidad", value: especialidad ?? "" },
              { label: "Profesional", value: profesional ?? "" },
              { label: "Fecha", value: toDDMMYYYY(fechaISO) },
              { label: "Hora", value: hora ?? "" },
            ]}
          />
          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {error ?? "Ocurrió un error al confirmar el turno."}
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-2">
          <div className="w-16 h-16 mx-auto rounded-full border border-cyan-300 bg-cyan-50 text-cyan-600 grid place-items-center text-2xl mb-2">
            ✓
          </div>
          <p className="text-[#213547]">Tu turno fue registrado correctamente.</p>
        </div>
      )}

      {/* Actions */}
      <DialogActions>
        {!isSuccess ? (
          <>
            <PrimaryButton variant="outline" onClick={onClose}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Confirmando…" : "Confirmar"}
            </PrimaryButton>
          </>
        ) : (
          <PrimaryButton onClick={onClose}>Aceptar</PrimaryButton>
        )}
      </DialogActions>
    </Modal>
  );
};
