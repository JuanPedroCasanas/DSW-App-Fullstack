import React, { useEffect, useMemo, useState } from "react";
import "./professionals.css";
import { Toast } from "@/components/ui/Feedback/Toast";
import { Occupation, Professional } from "./professionalTypes";

//Genera un toast para las respuestas del backend
async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Apellido y nombre: ${resJson.professional?.lastName} ${resJson.professional?.firstName}`;
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


/* ---- Utils ---- */
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const validateProfessional = (p: Partial<Professional>) => {
  const errors: Record<string, string> = {};
  if (!p.firstName?.trim()) errors.nombre = "Nombre obligatorio.";
  if (!p.lastName?.trim()) errors.apellido = "Apellido obligatorio.";
  if (!p.occupation?.id) errors.especialidadId = "Especialidad obligatoria.";
  if (!p.telephone?.trim()) {
    errors.telefono = "Teléfono obligatorio.";
  } else if (!/^[\d\s()+-]{6,20}$/.test(p.telephone.trim())) {
    errors.telefono = "Teléfono inválido.";
  }
  return errors;
};
export default function Professionals() {
  /** Estado principal: por defecto con algunos ejemplos */
  const [list, setList] = useState<Professional[]>([]);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // para ver todos los profesionales
   useEffect(() => {
   (async () => {
 
       const res = await fetch("http://localhost:2000/Professional/getAll");

      if (!res.ok){
        const toastData = await handleResponse(res);
        setToast(toastData);
      } else {
        const data: Professional[] = await res.json();
        setList(data);
      }

   })()
 }, []); 

  
  /* ---- Editar ---- */
  const [editTarget, setEditTarget] = useState<Professional | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Professional>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Professional> | null>(null);
  const editErrors = useMemo(() => validateProfessional(editForm), [editForm]);

  const openEdit = (p: Professional) => {
    const initial: Partial<Professional> = {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      occupation: p.occupation,
      telephone: p.telephone ?? "",
      isActive: p.isActive,
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

  const handleEditConfirm = () => {
  if (!editTarget) return;
  (async () => {

      const payload = {
        idProfessional: editForm.id,
        firstName: (editForm.firstName ?? "").trim(),
        lastName: (editForm.lastName ?? "").trim(),
        occupation: (editForm.occupation?.name ?? "").trim(),
        telephone: editForm.telephone?.trim() || "",
        isActive: editForm.isActive,
      };

      const res = await fetch("http://localhost:2000/Professional/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      closeEdit();
      
      const toastData = await handleResponse(res);
      setToast(toastData);

      // Refrescamos localmente
      setList((prev) =>
        prev.map((p) => (p.id === editTarget.id ? { ...p, firstName: payload.firstName } : p))
      ); 
      
    
  })();
};


  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<Professional | null>(null);
  const openDelete = (p: Professional) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    (async () => {
        const res = await fetch(
          `http://localhost:2000/Professional/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await fetch("http://localhost:2000/Professional/getAll");
        const data: Professional[] = await resGet.json();
        setList(data); 

        const toastData = await handleResponse(res);
        setToast(toastData);

      setDeleteTarget(null);

    })();
  };


  /* ---- Descartar cambios ---- */
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "edit") closeEdit();
    setDiscardCtx({ open: false });
  };

  
  /* ---- ESC para cerrar ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (discardCtx.open) return closeDiscard();
      if (editTarget) return tryCloseEdit();
      if (deleteTarget) return closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editTarget, deleteTarget, discardCtx.open, editSnapshot]);

  const hasItems = list.length > 0;

  /* ---- Render ---- */
  return (
    <section className="pro-container">
      <h1 className="pro-title">Profesionales</h1>

      {/* ===== Estado vacío ===== */}
      {!hasItems && (
        <div className="pro-empty-state" role="status" aria-live="polite">
          <svg className="pro-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m-8.5 8a8.5 8.5 0 0 1 17 0z"
            />
          </svg>
          <h2>Aún no hay profesionales registrados</h2>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasItems && (
        <>
          <div className="pro-table-wrap">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Especialidad (ID)</th>
                  <th>Teléfono</th>
                  <th>Activo</th>
                  <th className="pro-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td data-label="ID">{p.id}</td>
                    <td data-label="Nombre">{p.firstName}</td>
                    <td data-label="Apellido">{p.lastName}</td>
                    <td data-label="Especialidad (ID)"> {`${p.occupation.name} (${p.occupation.id})`} </td>
                    <td data-label="Teléfono">{p.telephone || "—"}</td>
                    <td data-label="Activo">
                      {p.isActive ? (
                        <span className="pro-badge pro-badge--ok">Sí</span>
                      ) : (
                        <span className="pro-badge pro-badge--off">No</span>
                      )}
                    </td>
                    <td className="pro-actions">
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
                        Inhabilitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )} 

      {/*===== Modal: Editar ===== */}

      {editTarget && (
        <div className="pro-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="pro-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-edit-title"
            aria-describedby="pro-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="pro-edit-title">Editar profesional</h2>
                <p id="pro-edit-desc" className="pro-help">
                  Actualizá los datos necesarios.
                </p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="pro-field">
                    <label htmlFor="edit-nombre">Nombre</label>
                    <input
                      id="edit-nombre"
                      value={editForm.firstName ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                      aria-invalid={!!editErrors.nombre}
                      aria-describedby={editErrors.nombre ? "edit-nombre-err" : undefined}
                    />
                    {editErrors.nombre && (
                      <p className="pro-error" id="edit-nombre-err">
                        {editErrors.nombre}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="edit-apellido">Apellido</label>
                    <input
                      id="edit-apellido"
                      value={editForm.lastName ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                      aria-invalid={!!editErrors.apellido}
                      aria-describedby={editErrors.apellido ? "edit-apellido-err" : undefined}
                    />
                    {editErrors.apellido && (
                      <p className="pro-error" id="edit-apellido-err">
                        {editErrors.apellido}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="edit-especialidad">Especialidad (ID)</label>
                    <input
                      id="edit-especialidad"
                      value={
                        editForm.occupation
                          ? `${editForm.occupation.name} (${editForm.occupation.id})`
                          : ""
                      }
                      readOnly
                      tabIndex={-1}
                      style={{ backgroundColor: "#f0f0f0", color: "#555", cursor: "not-allowed" }}
                      aria-invalid={!!editErrors.especialidadId}
                      aria-describedby={editErrors.especialidadId ? "edit-esp-err" : undefined}
                    />
                    {editErrors.especialidadId && (
                      <p className="pro-error" id="edit-esp-err">
                        {editErrors.especialidadId}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="edit-telefono">Teléfono (opcional)</label>
                    <input
                      id="edit-telefono"
                      value={editForm.telephone ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, telephone: e.target.value }))}
                      aria-invalid={!!editErrors.telefono}
                      aria-describedby={editErrors.telefono ? "edit-tel-err" : undefined}
                      placeholder="+54 9 11 ..."
                    />
                    {editErrors.telefono && (
                      <p className="pro-error" id="edit-tel-err">
                        {editErrors.telefono}
                      </p>
                    )}
                  </div>
                  <div className="pro-modal-actions">
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
                <h2 id="pro-edit-title">Confirmar cambios</h2>
                <p id="pro-edit-desc">Verificá los datos editados.</p>
                <ul className="pro-summary">
                  <li>
                    <strong>ID:</strong> {editTarget?.id}
                  </li>
                  <li>
                    <strong>Nombre:</strong> {editForm.firstName}
                  </li>
                  <li>
                    <strong>Apellido:</strong> {editForm.lastName}
                  </li>
                  <li>
                    <strong>Especialidad (ID):</strong> {editForm.occupation?.id}
                  </li>
                  <li>
                    <strong>Teléfono:</strong> {editForm.telephone || "—"}
                  </li>
                  <li>
                    <strong>Activo:</strong> {editForm.isActive ? "Sí" : "No"}
                  </li>
                </ul>
                <div className="pro-modal-actions">
                  <button
                    type="button"
                    className="ui-btn ui-btn--outline"
                    onClick={() => setEditStep("form")}
                  >
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

      {/* ===== Modal: Eliminar ===== */}
      {deleteTarget && (
        <div className="pro-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="pro-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-del-title"
            aria-describedby="pro-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pro-del-title">Eliminar profesional</h2>
            <p id="pro-del-desc">
              ¿Estás segura/o de eliminar a{" "}
              <strong>
                {deleteTarget.firstName} {deleteTarget.lastName}
              </strong>
              ?
            </p>
            <div className="pro-modal-actions">
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

      {/* ===== Descartar cambios ===== */}
      {discardCtx.open && (
        <div className="pro-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="pro-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-discard-title"
            aria-describedby="pro-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pro-discard-title">Descartar cambios</h2>
            <p id="pro-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="pro-modal-actions">
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
