// LegalGuardianAppointmentsCard
import { useEffect, useMemo, useState } from "react";
import { EmptyState, Toast, PrimaryButton } from "@/components/ui";
import { API_BASE } from "@/lib/api";
import { authFetch } from "@/common/utils/auth/AuthFetch";
import { HandleAppointmentControllerResponse } from "@/common/utils";
import { useAuth } from "@/common/utils/auth/AuthContext";
import type { PopulatedAppointment, AppointmentStatus, Professional } from "@/common/types";

// estados traducidos (para la vista)
const STATUS_LABEL_ES: Record<AppointmentStatus, string> = {
  available: "Disponible",
  scheduled: "Reservado",
  completed: "Completado",
  missed: "No se presentó",
  canceled: "Cancelado",
  expired: "Expirado",
};

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// "Miércoles 3 de enero 2026 - 12:00hs" con reloj 24h
const formatLongDateTimeES = (iso: string) => {
  const d = new Date(iso);
  const weekday = capitalize(d.toLocaleDateString("es-AR", { weekday: "long" }));
  const day = d.getDate();
  const month = d.toLocaleDateString("es-AR", { month: "long" });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${weekday} ${day} de ${month} ${year} - ${time}hs`;
};

const fullNameProfessional = (p?: Professional) =>
  `${p?.firstName ?? ""} ${p?.lastName ?? ""}`.trim();

const fullNamePatient = (a: PopulatedAppointment) =>
  `${(a as any)?.patient?.firstName ?? ""} ${(a as any)?.patient?.lastName ?? ""}`.trim();

export default function LegalGuardianAppointmentsCard() {
  const { user } = useAuth();

  const myLegalGuardianId = user?.legalGuardian?.id ?? user?.id;

  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Carga inicial
  useEffect(() => {
    const load = async () => {
      if (!myLegalGuardianId) return;

      setLoading(true);
      try {
        const res = await authFetch(
          `${API_BASE}/appointment/getAppointmentsByLegalGuardian/${myLegalGuardianId}`,
        );

        if (!res.ok) {
          const toastData = await HandleAppointmentControllerResponse(res);
          setToast(toastData);
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setToast({ message: "Error al cargar los turnos", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [myLegalGuardianId]);

  // Próximos (>= ahora) vs Anteriores (< ahora)
  const { upcoming, past } = useMemo(() => {
    const now = Date.now();

    const upcoming = appointments
      .filter((a) => a.startTime && new Date(a.startTime).getTime() >= now)
      .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? "")); // asc

    const past = appointments
      .filter((a) => a.startTime && new Date(a.startTime).getTime() < now)
      .sort((a, b) => (b.startTime ?? "").localeCompare(a.startTime ?? "")); // desc

    return { upcoming, past };
  }, [appointments]);

  // Cancelar turno
  const cancelAppointment = async (idAppointment: number) => {
    if (!confirm("¿Confirmás cancelar este turno?")) return;

    setUpdatingId(idAppointment);

    try {
      const res = await authFetch(`${API_BASE}/appointment/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAppointment, status: "canceled" as const }),
      });

      if (!res.ok) {
        const toastData = await HandleAppointmentControllerResponse(res);
        setToast(toastData);
        return;
      }

      const data = await res.json();
      setToast({
        message: data?.message ?? "Turno cancelado",
        type: "success",
      });

      // Mantener visible en "Próximos" con estado Cancelado
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === idAppointment ? ({ ...a, status: "canceled" } as any) : a,
        ),
      );
    } catch (err) {
      console.error(err);
      setToast({ message: "Error al cancelar el turno", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderUpcomingItem = (a: PopulatedAppointment) => {
    const isCancelable = (a.status ?? "scheduled") === "scheduled";
    const isUpdating = updatingId === a.id;

    return (
      <li
        key={a.id}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50 transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{fullNameProfessional(a.professional)}</span>
              {a.professional?.occupation?.name ? (
                <span className="text-gray-500"> • {a.professional?.occupation?.name}</span>
              ) : null}
            </p>

            {/* Paciente a cargo */}
            <p className="text-sm text-gray-700">
              <span className="font-medium">Paciente:</span>{" "}
              <span className="text-gray-700">{fullNamePatient(a) || "—"}</span>
            </p>

            <p className="text-sm text-gray-700">
              {a.startTime ? formatLongDateTimeES(a.startTime) : ""}
            </p>

            <p className="text-[12px] text-gray-500">ID turno: {a.id}</p>
            <p className="text-[12px] text-gray-500">
              {a.consultingRoom?.description}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            {/* Estado */}
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border",
                (a.status ?? "scheduled") === "canceled"
                  ? "bg-gray-50 text-gray-600 border-gray-200"
                  : "bg-cyan-50 text-cyan-700 border-cyan-200",
              ].join(" ")}
            >
              {STATUS_LABEL_ES[(a.status ?? "scheduled") as AppointmentStatus]}
            </span>

            {/* Cancelar */}
            {isCancelable && (
              <PrimaryButton
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => cancelAppointment(a.id!)}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                {isUpdating ? "Cancelando…" : "Cancelar turno"}
              </PrimaryButton>
            )}
          </div>
        </div>
      </li>
    );
  };

  const renderPastItem = (a: PopulatedAppointment) => {
    return (
      <li
        key={a.id}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50 transition"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{fullNameProfessional(a.professional)}</span>
              {a.professional?.occupation?.name ? (
                <span className="text-gray-500"> • {a.professional?.occupation?.name}</span>
              ) : null}
            </p>

            {/* Paciente a cargo */}
            <p className="text-sm text-gray-700">
              <span className="font-medium">Paciente:</span>{" "}
              <span className="text-gray-700">{fullNamePatient(a) || "—"}</span>
            </p>

            <p className="text-sm text-gray-700">
              {a.startTime ? formatLongDateTimeES(a.startTime) : ""}
            </p>

            <p className="text-[12px] text-gray-500">ID turno: {a.id}</p>
            <p className="text-[12px] text-gray-500">
              {a.consultingRoom?.description}
            </p>
          </div>

          <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
            {STATUS_LABEL_ES[(a.status ?? "scheduled") as AppointmentStatus]}
          </span>
        </div>
      </li>
    );
  };

  // Render principal
  return (
    <div>
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          Turnos de mis pacientes
        </h3>

        {/* Loading */}
        {loading && (
          <div className="text-sm text-gray-600">Cargando turnos…</div>
        )}

        {/* Vacío */}
        {!loading && appointments.length === 0 && (
          <EmptyState
            title="No hay turnos"
            description="Cuando reserves turnos para tus pacientes, van a aparecer acá."
            icon={
              <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m-8.5 8a8.5 8.5 0 0 1 17 0z"
                />
              </svg>
            }
          />
        )}

        {/* Próximos */}
        {!loading && upcoming.length > 0 && (
          <section className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Próximos
            </h4>
            <ul className="space-y-3">{upcoming.map(renderUpcomingItem)}</ul>
          </section>
        )}

        {/* Anteriores */}
        {!loading && past.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Anteriores
            </h4>
            <ul className="space-y-3">{past.map(renderPastItem)}</ul>
          </section>
        )}
      </div>

      {/* Toast */}
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
