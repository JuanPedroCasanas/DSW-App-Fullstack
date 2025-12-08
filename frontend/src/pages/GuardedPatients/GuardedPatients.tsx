import React, { useEffect, useMemo, useState } from "react";

import { Toast, EmptyState, Modal, Table, SummaryList, 
  DialogActions, PrimaryButton, FormField, Card, FilterBar } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import {
  HandlePatientControllerResponse,
  HandleLegalGuardianControllerResponse
} from '@/common/utils';
import { LegalGuardian, Patient } from "@/common/types";
import { authFetch } from "@/common/utils/auth/AuthFetch";



// ---- Utils ----
const formatDate = (iso: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const validatePatient = (p: Partial<Patient>) => {
  const errors: Record<string, string> = {};
  if (!p.firstName?.trim()) errors.firstName = "Nombre obligatorio.";
  if (!p.lastName?.trim()) errors.lastName = "Apellido obligatorio.";
  if (!p.birthdate) errors.birthdate = "Fecha de nacimiento obligatoria.";
  return errors;
};

const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function GuardedPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [legalGuardians, setLegalGuardians] = useState<LegalGuardian[]>([]);
  const [selectedGuardianId, setSelectedGuardianId] = useState<number | null>(null);

  // ---------- Agregar (2 pasos + dirty-check) ----------
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<Patient>>({
    firstName: "",
    lastName: "",
    birthdate: "",
  }); 
  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [addSnapshot, setAddSnapshot] = useState<Partial<Patient> | null>(null);
  const addErrors = useMemo(() => validatePatient(addForm), [addForm]);

  //Carga desplegable
  useEffect(() => {
    (async () => {
      const res = await authFetch("http://localhost:2000/LegalGuardian/getAll?includeInactive=true");
      if (!res.ok){
        const toastData = await HandleLegalGuardianControllerResponse(res);
        setToast(toastData);
      } else {
        const data: LegalGuardian[] = await res.json();
        setLegalGuardians(data);
        if (selectedGuardianId === null) {
          setSelectedGuardianId(data[0]?.id ?? null);
        }
      }
    })()
  }, []);

  //Carga de lista de pacientes
  useEffect(() => {
     if (!selectedGuardianId) return;
     (async () => {
         const res = await authFetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=false`);
  
        if (!res.ok){
          const toastData = await HandlePatientControllerResponse(res);
          setToast(toastData);
        } else {
          const data: Patient[] = await res.json();
          setPatients(data);
        }
  
     })()
   }, [selectedGuardianId]); 



  const openAdd = () => {
    const initial = { firstName: "", lastName: "", birthdate: "" };
    setAddForm(initial);
    setAddSnapshot(initial);
    setAddStep("form");
    setShowAdd(true);
  };
  const closeAdd = () => setShowAdd(false);

  const tryCloseAdd = () => {
    const dirty = !sameJSON(addForm, addSnapshot);
    if (dirty) {
      setDiscardCtx({ open: true, context: "add" });
    } else {
      closeAdd();
    }
  };

  const handleAddContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(addErrors).length) return;
    setAddStep("confirm");
  };
  const handleAddConfirm = async () => {
    const payload = {
      firstName: (addForm.firstName ?? "").trim(),
      lastName: (addForm.lastName ?? "").trim(),
      birthdate: addForm.birthdate ?? "",
      idLegalGuardian: selectedGuardianId,
    };

    const res = await authFetch("http://localhost:2000/Patient/addDepPatient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if(res.ok) {
      const resGet = await authFetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
    }
    closeAdd()
    const toastData = await HandlePatientControllerResponse(res);
    setToast(toastData);
  };

  // ---------- Editar (2 pasos + dirty-check) ----------
  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Patient> | null>(null);
  const editErrors = useMemo(() => validatePatient(editForm), [editForm]);

  const openEdit = (p: Patient) => {
    const initial = {
      firstName: p.firstName,
      lastName: p.lastName,
      birthdate: p.birthdate,
    };
    setEditTarget(p);
    setEditForm(initial);
    setEditSnapshot(initial);
    setEditStep("form");
  };
  const closeEdit = () => {
    setEditTarget(null);
    setEditForm({});
    setEditSnapshot(null);
  };

  const tryCloseEdit = () => {
    const dirty = !sameJSON(editForm, editSnapshot);
    if (dirty) {
      setDiscardCtx({ open: true, context: "edit" });
    } else {
      closeEdit();
    }
  };

  const handleEditContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(editErrors).length) return;
    setEditStep("confirm");
  };
  const handleEditConfirm = async () => {
    if (!editTarget) return;

    const payload = {
      idPatient: editTarget.id,
      firstName: (editForm.firstName ?? "").trim(),
      lastName: (editForm.lastName ?? "").trim(),
      birthdate: editForm.birthdate ?? "",
    };


    const res = await authFetch("http://localhost:2000/Patient/updateDepPatient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const resGet = await authFetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
    }
    closeEdit();
    const toastData = await HandlePatientControllerResponse(res);
    setToast(toastData);
  };

  // ---------- Eliminar (confirmación simple) ----------
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const openDelete = (p: Patient) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return; 

    const res = await authFetch(
              `http://localhost:2000/Patient/delete/${deleteTarget.id}`, 
              {
                method: "DELETE",
            });

    // Recargar
    if(res.ok) {
      const resGet = await authFetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
      
    }
    closeDelete();
    setDeleteTarget(null);
    const toastData = await HandlePatientControllerResponse(res);
    setToast(toastData);
  };

  // ---------- Modal genérico: DESCARTAR cambios ----------
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "add") closeAdd();
    if (discardCtx.context === "edit") closeEdit();
    setDiscardCtx({ open: false });
  };

  // ---------- ESC para cerrar (respeta dirty-check) ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (discardCtx.open) return closeDiscard();
      if (showAdd) return tryCloseAdd();
      if (editTarget) return tryCloseEdit();
      if (deleteTarget) return closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]);

  // ---------- Derivados para render ----------
  const hasPatients = patients.length > 0;

  return (

    <Page>
      <SectionHeader title="Pacientes a cargo" />

      {/* selector de responsable legal. Esto se iria en cuanto tengamos roles */}
      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Responsable legal" htmlFor="guardian">
            <select
              id="guardian"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={selectedGuardianId ?? ""}
              onChange={(e) => setSelectedGuardianId(Number(e.target.value))}
            >
              {[...legalGuardians]
                .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {`Id: ${g.id}, ${g.lastName} ${g.firstName}`}
                  </option>
                ))}
            </select>
          </FormField>
        </div>
      </FilterBar>

      {/* Estado vacío */}
      {!hasPatients && (
        <EmptyState
          title="No hay pacientes a cargo"
          description="Agregá tu primer paciente para comenzar."
          icon={
            <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"
              />
            </svg>
          }
          action={<PrimaryButton onClick={openAdd}>Agregar paciente a cargo</PrimaryButton>}
        />
      )}

      {/* Tabla */}
      {hasPatients && (
        <>
          <Card>
            <Table headers={["Nombre", "Apellido", "Fecha de nacimiento", "Acciones"]}>
              {[...patients]
                .sort((a, b) => (a.firstName ?? '').localeCompare(b.firstName ?? '', "es", { sensitivity: "base" }))
                .map((p) => (
                  <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                    <td className="px-4 py-3">{p.firstName}</td>
                    <td className="px-4 py-3">{p.lastName}</td>
                    <td className="px-4 py-3">
                      {(p.birthdate ?? '').split('T')[0] || ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <PrimaryButton variant="outline" size="sm" onClick={() => openEdit(p)}>
                          Editar
                        </PrimaryButton>
                        <PrimaryButton variant="danger" size="sm" onClick={() => openDelete(p)}>
                          Eliminar
                        </PrimaryButton>
                      </div>
                    </td>
                  </tr>
                ))}
            </Table>
          </Card>

          <div className="grid place-items-center mt-4">
            <PrimaryButton onClick={openAdd}>Agregar paciente a cargo</PrimaryButton>
          </div>
        </>
      )}

      {/* Agregar */}
      {showAdd && (
        <Modal
          title={addStep === "form" ? "Agregar paciente" : "Confirmar nuevo paciente"}
          onClose={tryCloseAdd}
        >
          {addStep === "form" ? (
            <form onSubmit={handleAddContinue} className="space-y-4" noValidate>
              <FormField label="Nombre" htmlFor="add-firstName">
                <input
                  id="add-firstName"
                  type="text"
                  value={addForm.firstName ?? ""}
                  onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!addErrors.firstName}
                  aria-describedby={addErrors.firstName ? "add-firstName-err" : undefined}
                  autoFocus
                />
                {addErrors.firstName && (
                  <p id="add-firstName-err" className="text-red-600 text-sm mt-1">
                    {addErrors.firstName}
                  </p>
                )}
              </FormField>

              <FormField label="Apellido" htmlFor="add-lastName">
                <input
                  id="add-lastName"
                  type="text"
                  value={addForm.lastName ?? ""}
                  onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!addErrors.lastName}
                  aria-describedby={addErrors.lastName ? "add-lastName-err" : undefined}
                />
                {addErrors.lastName && (
                  <p id="add-lastName-err" className="text-red-600 text-sm mt-1">
                    {addErrors.lastName}
                  </p>
                )}
              </FormField>

              <FormField label="Fecha de nacimiento" htmlFor="add-fecha">
                <input
                  id="add-fecha"
                  type="date"
                  value={addForm.birthdate ?? ""}
                  onChange={(e) => setAddForm((f) => ({ ...f, birthdate: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!addErrors.birthdate}
                  aria-describedby={addErrors.birthdate ? "add-fecha-err" : undefined}
                />
                {addErrors.birthdate && (
                  <p id="add-fecha-err" className="text-red-600 text-sm mt-1">
                    {addErrors.birthdate}
                  </p>
                )}
              </FormField>

              <DialogActions>
                <PrimaryButton variant="outline" onClick={tryCloseAdd}>
                  Cancelar
                </PrimaryButton>
                <PrimaryButton type="submit">Continuar</PrimaryButton>
              </DialogActions>
            </form>
          ) : (
            <>
              <SummaryList
                items={[
                  { label: "Nombre", value: addForm.firstName ?? "" },
                  { label: "Apellido", value: addForm.lastName ?? "" },
                  { label: "Fecha de nacimiento", value: formatDate(addForm.birthdate ?? "") },
                ]}
              />
              <DialogActions>
                <PrimaryButton variant="outline" onClick={() => setAddStep("form")}>
                  Volver
                </PrimaryButton>
                <PrimaryButton onClick={handleAddConfirm}>Confirmar</PrimaryButton>
              </DialogActions>
            </>
          )}
        </Modal>
      )}

      {/* Modal: Editar */}
      {editTarget && (
        <Modal title={editStep === "form" ? "Editar paciente" : "Confirmar cambios"} onClose={tryCloseEdit}>
          {editStep === "form" ? (
            <form onSubmit={handleEditContinue} className="space-y-4" noValidate>
              <FormField label="Nombre" htmlFor="edit-firstName">
                <input
                  id="edit-firstName"
                  type="text"
                  value={editForm.firstName ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!editErrors.firstName}
                  aria-describedby={editErrors.firstName ? "edit-firstName-err" : undefined}
                  autoFocus
                />
                {editErrors.firstName && (
                  <p id="edit-firstName-err" className="text-red-600 text-sm mt-1">
                    {editErrors.firstName}
                  </p>
                )}
              </FormField>

              <FormField label="Apellido" htmlFor="edit-lastName">
                <input
                  id="edit-lastName"
                  type="text"
                  value={editForm.lastName ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!editErrors.lastName}
                  aria-describedby={editErrors.lastName ? "edit-lastName-err" : undefined}
                />
                {editErrors.lastName && (
                  <p id="edit-lastName-err" className="text-red-600 text-sm mt-1">
                    {editErrors.lastName}
                  </p>
                )}
              </FormField>

              <FormField label="Fecha de nacimiento" htmlFor="edit-fecha">
                <input
                  id="edit-fecha"
                  type="date"
                  value={editForm.birthdate ? editForm.birthdate.split("T")[0] : ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, birthdate: e.target.value }))}
                  className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                  aria-invalid={!!editErrors.birthdate}
                  aria-describedby={editErrors.birthdate ? "edit-fecha-err" : undefined}
                />
                {editErrors.birthdate && (
                  <p id="edit-fecha-err" className="text-red-600 text-sm mt-1">
                    {editErrors.birthdate}
                  </p>
                )}
              </FormField>

              <DialogActions>
                <PrimaryButton variant="outline" onClick={tryCloseEdit}>
                  Cancelar
                </PrimaryButton>
                <PrimaryButton type="submit">Continuar</PrimaryButton>
              </DialogActions>
            </form>
          ) : (
            <>
              <SummaryList
                items={[
                  { label: "ID", value: String(editTarget.id) },
                  { label: "Nombre", value: editForm.firstName ?? "" },
                  { label: "Apellido", value: editForm.lastName ?? "" },
                  { label: "Fecha de nacimiento", value: formatDate(editForm.birthdate ?? "") },
                ]}
              />
              <DialogActions>
                <PrimaryButton variant="outline" onClick={() => setEditStep("form")}>
                  Volver
                </PrimaryButton>
                <PrimaryButton onClick={handleEditConfirm}>Confirmar</PrimaryButton>
              </DialogActions>
            </>
          )}
        </Modal>
      )}

      {/* Modal: Eliminar */}
      {deleteTarget && (
        <Modal title="Eliminar paciente" onClose={closeDelete}>
          <p className="text-[#213547] mb-2">
            ¿Estás seguro de eliminar a <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
          </p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={closeDelete}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={handleDeleteConfirm}>
              Eliminar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* Modal: Descartar cambios */}
      {discardCtx.open && (
        <Modal title="Descartar cambios" onClose={closeDiscard}>
          <p className="text-[#213547] mb-2">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={closeDiscard}>
              Seguir editando
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={confirmDiscard}>
              Descartar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Page>

  );
}