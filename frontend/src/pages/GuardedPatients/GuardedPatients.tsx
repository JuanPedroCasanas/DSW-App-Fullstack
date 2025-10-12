import React, { useEffect, useMemo, useState } from "react";
import "./guardedPatients.css";

type Patient = {
  id: string;
  nombre: string;
  apellido: string;
  /** ISO yyyy-mm-dd */
  fechaNacimiento: string;
};

// ---- Utils ----
const uid = () => Math.random().toString(36).slice(2, 10);
const formatDate = (iso: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const validatePatient = (p: Partial<Patient>) => {
  const errors: Record<string, string> = {};
  if (!p.nombre?.trim()) errors.nombre = "Nombre obligatorio.";
  if (!p.apellido?.trim()) errors.apellido = "Apellido obligatorio.";
  if (!p.fechaNacimiento) errors.fechaNacimiento = "Fecha de nacimiento obligatoria.";
  return errors;
};
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function GuardedPatients() {
  // Cambiá a [] para ver el estado vacío:
  const [patients, setPatients] = useState<Patient[]>([
    { id: "p1", nombre: "Marina", apellido: "Pérez", fechaNacimiento: "2012-06-21" },
    { id: "p2", nombre: "Tomás", apellido: "García", fechaNacimiento: "2015-11-03" },
  ]);

  // ---------- Agregar (2 pasos + dirty-check) ----------
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<Patient>>({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });
  const [addSnapshot, setAddSnapshot] = useState<Partial<Patient> | null>(null);
  const addErrors = useMemo(() => validatePatient(addForm), [addForm]);

  const openAdd = () => {
    const initial = { nombre: "", apellido: "", fechaNacimiento: "" };
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
  const handleAddConfirm = () => {
    const nuevo: Patient = {
      id: uid(),
      nombre: (addForm.nombre ?? "").trim(),
      apellido: (addForm.apellido ?? "").trim(),
      fechaNacimiento: addForm.fechaNacimiento ?? "",
    };
    setPatients((prev) => [...prev, nuevo]);
    setShowAdd(false);
    alert("Paciente agregado (simulado).");
  };

  // ---------- Editar (2 pasos + dirty-check) ----------
  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Patient> | null>(null);
  const editErrors = useMemo(() => validatePatient(editForm), [editForm]);

  const openEdit = (p: Patient) => {
    const initial = {
      nombre: p.nombre,
      apellido: p.apellido,
      fechaNacimiento: p.fechaNacimiento,
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
    setPatients((prev) =>
      prev.map((p) =>
        p.id === editTarget.id
          ? {
              ...p,
              nombre: (editForm.nombre ?? "").trim(),
              apellido: (editForm.apellido ?? "").trim(),
              fechaNacimiento: editForm.fechaNacimiento ?? "",
            }
          : p
      )
    );
    closeEdit();
    alert("Paciente actualizado (simulado).");
  };

  // ---------- Eliminar (confirmación simple) ----------
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const openDelete = (p: Patient) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setPatients((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    alert("Paciente eliminado (simulado).");
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
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Apellido">{p.apellido}</td>
                    <td data-label="Fecha de nacimiento">{formatDate(p.fechaNacimiento)}</td>
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
                    <label htmlFor="add-nombre">Nombre</label>
                    <input
                      id="add-nombre"
                      type="text"
                      value={addForm.nombre ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!addErrors.nombre}
                      aria-describedby={addErrors.nombre ? "add-nombre-err" : undefined}
                    />
                    {addErrors.nombre && <p className="gp-error" id="add-nombre-err">{addErrors.nombre}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="add-apellido">Apellido</label>
                    <input
                      id="add-apellido"
                      type="text"
                      value={addForm.apellido ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!addErrors.apellido}
                      aria-describedby={addErrors.apellido ? "add-apellido-err" : undefined}
                    />
                    {addErrors.apellido && <p className="gp-error" id="add-apellido-err">{addErrors.apellido}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="add-fecha">Fecha de nacimiento</label>
                    <input
                      id="add-fecha"
                      type="date"
                      value={addForm.fechaNacimiento ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!addErrors.fechaNacimiento}
                      aria-describedby={addErrors.fechaNacimiento ? "add-fecha-err" : undefined}
                    />
                    {addErrors.fechaNacimiento && <p className="gp-error" id="add-fecha-err">{addErrors.fechaNacimiento}</p>}
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
                  <li><strong>Nombre:</strong> {addForm.nombre}</li>
                  <li><strong>Apellido:</strong> {addForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(addForm.fechaNacimiento || "")}</li>
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
                    <label htmlFor="edit-nombre">Nombre</label>
                    <input
                      id="edit-nombre"
                      type="text"
                      value={editForm.nombre ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!editErrors.nombre}
                      aria-describedby={editErrors.nombre ? "edit-nombre-err" : undefined}
                    />
                    {editErrors.nombre && <p className="gp-error" id="edit-nombre-err">{editErrors.nombre}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="edit-apellido">Apellido</label>
                    <input
                      id="edit-apellido"
                      type="text"
                      value={editForm.apellido ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!editErrors.apellido}
                      aria-describedby={editErrors.apellido ? "edit-apellido-err" : undefined}
                    />
                    {editErrors.apellido && <p className="gp-error" id="edit-apellido-err">{editErrors.apellido}</p>}
                  </div>

                  <div className="gp-field">
                    <label htmlFor="edit-fecha">Fecha de nacimiento</label>
                    <input
                      id="edit-fecha"
                      type="date"
                      value={editForm.fechaNacimiento ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!editErrors.fechaNacimiento}
                      aria-describedby={editErrors.fechaNacimiento ? "edit-fecha-err" : undefined}
                    />
                    {editErrors.fechaNacimiento && <p className="gp-error" id="edit-fecha-err">{editErrors.fechaNacimiento}</p>}
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
                  <li><strong>Nombre:</strong> {editForm.nombre}</li>
                  <li><strong>Apellido:</strong> {editForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(editForm.fechaNacimiento || "")}</li>
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
              ¿Estás seguro de eliminar a <strong>{deleteTarget.nombre} {deleteTarget.apellido}</strong>?
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
    </section>
  );
}