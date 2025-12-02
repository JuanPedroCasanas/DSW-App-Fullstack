import React, { useEffect, useMemo, useState } from "react";
import "./guardedPatients.css";
import { LegalGuardian, Patient } from "./guardedPatientsTypes";
import { Toast } from "@/components/ui/Feedback/Toast";

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


async function handlePatientControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.patient?.id}, Nombre: ${resJson.patient?.lastName} ${resJson.patient?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? "Error interno del servidor", type: "error" };
    } else {
      const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      return { message: errorMessage.trim(), type: "error" };
    }
  }
}

async function handleLegalGuardianControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.legalGuardian?.id}, Nombre: ${resJson.legalGuardian?.lastName} ${resJson.legalGuardian?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? "Error interno del servidor", type: "error" };
    } else {
      const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      return { message: errorMessage.trim(), type: "error" };
    }
  }
}

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
      const res = await fetch("http://localhost:2000/LegalGuardian/getAll?includeInactive=true");
      if (!res.ok){
        const toastData = await handleLegalGuardianControllerResponse(res);
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
         const res = await fetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=false`);
  
        if (!res.ok){
          const toastData = await handlePatientControllerResponse(res);
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

    const res = await fetch("http://localhost:2000/Patient/addDepPatient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if(res.ok) {
      const resGet = await fetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
    }
    closeAdd()
    const toastData = await handlePatientControllerResponse(res);
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


    const res = await fetch("http://localhost:2000/Patient/updateDepPatient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const resGet = await fetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
    }
    closeEdit();
    const toastData = await handlePatientControllerResponse(res);
    setToast(toastData);
  };

  // ---------- Eliminar (confirmación simple) ----------
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const openDelete = (p: Patient) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return; 

    const res = await fetch(
              `http://localhost:2000/Patient/delete/${deleteTarget.id}`, 
              {
                method: "DELETE",
            });

    // Recargar
    if(res.ok) {
      const resGet = await fetch(`http://localhost:2000/Patient/getByLegalGuardian/${selectedGuardianId}?includeInactive=true`);
      const data: Patient[] = await resGet.json();
      setPatients(data); 
      
    }
    closeDelete();
    setDeleteTarget(null);
    const toastData = await handlePatientControllerResponse(res);
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
    <section className="gp-container">
      <h1 className="gp-title">Pacientes a cargo</h1>
        <div className="gp-guardian-select">
            <label htmlFor="guardian" className="sr-only">Responsable legal</label>
              <select
                value={selectedGuardianId ?? ""}
                onChange={(e) => setSelectedGuardianId(Number(e.target.value))}
              >
                {legalGuardians.map(g => (
                  <option key={g.id} value={g.id}>
                    Id: {g.id}, {g.lastName} {g.firstName}
                  </option>
                ))}
              </select>
        </div>

      {/* ===== Estado vacío ===== */}
      {!hasPatients && (
        <div className="gp-empty-state" role="status" aria-live="polite">
          {/* Icono simple inline */}
          <svg className="gp-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"/>
          </svg>
          <h2>No hay pacientes a cargo</h2>
          <p>Agregá tu primer paciente para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar paciente a cargo
          </button>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasPatients && (
        <>
          <div className="gp-table-wrap">
            <table className="gp-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha de nacimiento</th>
                  <th className="gp-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td data-label="firstName">{p.firstName}</td>
                    <td data-label="lastName">{p.lastName}</td>
                    <td data-label="birthdate">{formatDate(p.birthdate.split("T")[0])}</td>
                    <td className="gp-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--outline ui-btn--sm"
                        onClick={() => openEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(p)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer: Agregar */}
          <div className="gp-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar paciente a cargo
            </button>
          </div>
        </>
      )}

      {/* ===== MODAL: Agregar (2 pasos con dirty-check) ===== */}
      {showAdd && (
        <div className="gp-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="gp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gp-add-title"
            aria-describedby="gp-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="gp-add-title">Agregar paciente</h2>
                <p id="gp-add-desc" className="gp-help">Completá los datos del paciente a cargo.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="gp-field">
                    <label htmlFor="add-firstName">Nombre</label>
                    <input
                      id="add-firstName"
                      type="text"
                      value={addForm.firstName ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
                      aria-invalid={!!addErrors.firstName}
                      aria-describedby={addErrors.firstName ? "add-firstName-err" : undefined}
                    />
                    {addErrors.firstName && <p className="gp-error" id="add-firstName-err">{addErrors.firstName}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="add-lastName">Apellido</label>
                    <input
                      id="add-lastName"
                      type="text"
                      value={addForm.lastName ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, lastName: e.target.value }))}
                      aria-invalid={!!addErrors.lastName}
                      aria-describedby={addErrors.lastName ? "add-lastName-err" : undefined}
                    />
                    {addErrors.lastName && <p className="gp-error" id="add-lastName-err">{addErrors.lastName}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="add-fecha">Fecha de nacimiento</label>
                    <input
                      id="add-fecha"
                      type="date"
                      value={addForm.birthdate ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, birthdate: e.target.value }))}
                      aria-invalid={!!addErrors.birthdate}
                      aria-describedby={addErrors.birthdate ? "add-fecha-err" : undefined}
                    />
                    {addErrors.birthdate && <p className="gp-error" id="add-fecha-err">{addErrors.birthdate}</p>}
                  </div>

                  <div className="gp-modal-actions">
                    <button type="button" className="ui-btn ui-btn--outline" onClick={tryCloseAdd}>
                      Cancelar
                    </button>
                    <button type="submit" className="ui-btn ui-btn--primary">
                      Continuar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 id="gp-add-title">Confirmar nuevo paciente</h2>
                <p id="gp-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="gp-summary">
                  <li><strong>Nombre:</strong> {addForm.firstName}</li>
                  <li><strong>Apellido:</strong> {addForm.lastName}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(addForm.birthdate || "")}</li>
                </ul>
                <div className="gp-modal-actions">
                  <button type="button" className="ui-btn ui-btn--outline" onClick={() => setAddStep("form")}>
                    Volver
                  </button>
                  <button type="button" className="ui-btn ui-btn--primary" onClick={handleAddConfirm}>
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL: Editar (2 pasos con dirty-check) ===== */}
      {editTarget && (
        <div className="gp-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="gp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gp-edit-title"
            aria-describedby="gp-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="gp-edit-title">Editar paciente</h2>
                <p id="gp-edit-desc" className="gp-help">Actualizá los datos necesarios.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="gp-field">
                    <label htmlFor="edit-firstName">Nombre</label>
                    <input
                      id="edit-firstName"
                      type="text"
                      value={editForm.firstName ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                      aria-invalid={!!editErrors.firstName}
                      aria-describedby={editErrors.firstName ? "edit-firstName-err" : undefined}
                    />
                    {editErrors.firstName && <p className="gp-error" id="edit-firstName-err">{editErrors.firstName}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="edit-lastName">Apellido</label>
                    <input
                      id="edit-lastName"
                      type="text"
                      value={editForm.lastName ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                      aria-invalid={!!editErrors.lastName}
                      aria-describedby={editErrors.lastName ? "edit-lastName-err" : undefined}
                    />
                    {editErrors.lastName && <p className="gp-error" id="edit-lastName-err">{editErrors.lastName}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="edit-fecha">Fecha de nacimiento</label>
                    <input
                      id="edit-fecha"
                      type="date"
                      value={editForm.birthdate ? editForm.birthdate.split("T")[0] : ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, birthdate: e.target.value }))}
                      aria-invalid={!!editErrors.birthdate}
                      aria-describedby={editErrors.birthdate ? "edit-fecha-err" : undefined}
                    />
                    {editErrors.birthdate && <p className="gp-error" id="edit-fecha-err">{editErrors.birthdate}</p>}
                  </div>

                  <div className="gp-modal-actions">
                    <button type="button" className="ui-btn ui-btn--outline" onClick={tryCloseEdit}>
                      Cancelar
                    </button>
                    <button type="submit" className="ui-btn ui-btn--primary">
                      Continuar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 id="gp-edit-title">Confirmar cambios</h2>
                <p id="gp-edit-desc">Verificá los datos editados.</p>
                <ul className="gp-summary">
                  <li><strong>Nombre:</strong> {editForm.firstName}</li>
                  <li><strong>Apellido:</strong> {editForm.lastName}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(editForm.birthdate || "")}</li>
                </ul>
                <div className="gp-modal-actions">
                  <button type="button" className="ui-btn ui-btn--outline" onClick={() => setEditStep("form")}>
                    Volver
                  </button>
                  <button type="button" className="ui-btn ui-btn--primary" onClick={handleEditConfirm}>
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL: Eliminar ===== */}
      {deleteTarget && (
        <div className="gp-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="gp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gp-del-title"
            aria-describedby="gp-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="gp-del-title">Eliminar paciente</h2>
            <p id="gp-del-desc">
              ¿Estás seguro de eliminar a <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
            </p>
            <div className="gp-modal-actions">
              <button type="button" className="ui-btn ui-btn--outline" onClick={closeDelete}>
                Cancelar
              </button>
              <button type="button" className="ui-btn ui-btn--danger" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Descartar cambios (dirty-check) ===== */}
      {discardCtx.open && (
        <div className="gp-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="gp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gp-discard-title"
            aria-describedby="gp-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="gp-discard-title">Descartar cambios</h2>
            <p id="gp-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="gp-modal-actions">
              <button type="button" className="ui-btn ui-btn--outline" onClick={closeDiscard}>
                Seguir editando
              </button>
              <button type="button" className="ui-btn ui-btn--danger" onClick={confirmDiscard}>
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== TOAST ===== */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}