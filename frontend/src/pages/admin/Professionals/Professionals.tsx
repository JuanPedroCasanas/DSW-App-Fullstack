import React, { useEffect, useMemo, useState } from "react";
import "./professionals.css";

/** Modelo simple: viene del backend */
type Professional = {
  id: string;
  nombre: string;
  apellido: string;
  especialidadId: string; // ID de especialidad (string por ahora)
  telefono?: string;
  activo: boolean;
};

/* ---- Utils ---- */
const uid = () => Math.random().toString(36).slice(2, 10);
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const validateProfessional = (p: Partial<Professional>) => {
  const errors: Record<string, string> = {};
  if (!p.nombre?.trim()) errors.nombre = "Nombre obligatorio.";
  if (!p.apellido?.trim()) errors.apellido = "Apellido obligatorio.";
  if (!p.especialidadId?.trim()) errors.especialidadId = "Especialidad obligatoria.";
  if (p.telefono && !/^[\d\s()+-]{6,20}$/.test(p.telefono.trim()))
    errors.telefono = "Teléfono inválido.";
  return errors;
};

export default function Professionals() {
  /** Estado principal: por defecto con algunos ejemplos */
  const [list, setList] = useState<Professional[]>([]);

  // Hardcodeados como ejemplo (remplazá por tu fetch real)
  useEffect(() => {
    setList([
      {
        id: "1",
        nombre: "Lucía",
        apellido: "García",
        especialidadId: "Psicopedagogia",
        telefono: "34155551111",
        activo: true,
      },
      {
        id: "2",
        nombre: "Julián",
        apellido: "Paz",
        especialidadId: "Psicologia",
        telefono: "3414442222",
        activo: false,
      },
    ]);
  }, []);

  /* --- Integración backend (placeholder) ---
     Reemplazá la URL y el shape según tu API. */
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("/api/professionals");
  //     if (!res.ok) return;
  //     const data: Professional[] = await res.json();
  //     setList(data);
  //   })();
  // }, []);

  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<Professional>>({
    nombre: "",
    apellido: "",
    especialidadId: "",
    telefono: "",
    activo: true,
  });
  const [addSnapshot, setAddSnapshot] = useState<Partial<Professional> | null>(null);
  const addErrors = useMemo(() => validateProfessional(addForm), [addForm]);

  const openAdd = () => {
    const initial = { nombre: "", apellido: "", especialidadId: "", telefono: "", activo: true };
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
    const nuevo: Professional = {
      id: uid(), // en real, lo devuelve el backend
      nombre: (addForm.nombre ?? "").trim(),
      apellido: (addForm.apellido ?? "").trim(),
      especialidadId: (addForm.especialidadId ?? "").trim(),
      telefono: addForm.telefono?.trim() || "",
      activo: !!addForm.activo,
    };
    setList((prev) => [...prev, nuevo]);
    setShowAdd(false);
    alert("Profesional agregado (simulado).");
  };

  /* ---- Editar ---- */
  const [editTarget, setEditTarget] = useState<Professional | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Professional>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Professional> | null>(null);
  const editErrors = useMemo(() => validateProfessional(editForm), [editForm]);

  const openEdit = (p: Professional) => {
    const initial: Partial<Professional> = {
      nombre: p.nombre,
      apellido: p.apellido,
      especialidadId: p.especialidadId,
      telefono: p.telefono ?? "",
      activo: p.activo,
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
    setList((prev) =>
      prev.map((p) =>
        p.id === editTarget.id
          ? {
              ...p,
              nombre: (editForm.nombre ?? "").trim(),
              apellido: (editForm.apellido ?? "").trim(),
              especialidadId: (editForm.especialidadId ?? "").trim(),
              telefono: editForm.telefono?.trim() || "",
              activo: !!editForm.activo,
            }
          : p
      )
    );
    closeEdit();
    alert("Profesional actualizado (simulado).");
  };

  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<Professional | null>(null);
  const openDelete = (p: Professional) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setList((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    alert("Profesional eliminado (simulado).");
  };

  /* ---- Descartar cambios ---- */
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "add") closeAdd();
    if (discardCtx.context === "edit") closeEdit();
    setDiscardCtx({ open: false });
  };

  /* ---- ESC para cerrar ---- */
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
          <h2>No hay profesionales</h2>
          <p>Agregá tu primer profesional para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar profesional
          </button>
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
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Apellido">{p.apellido}</td>
                    <td data-label="Especialidad (ID)">{p.especialidadId}</td>
                    <td data-label="Teléfono">{p.telefono || "—"}</td>
                    <td data-label="Activo">
                      {p.activo ? (
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
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agregar */}
          <div className="pro-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar profesional
            </button>
          </div>
        </>
      )}

      {/* ===== Modal: Agregar ===== */}
      {showAdd && (
        <div className="pro-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="pro-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pro-add-title"
            aria-describedby="pro-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="pro-add-title">Agregar profesional</h2>
                <p id="pro-add-desc" className="pro-help">
                  Completá los datos del profesional.
                </p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="pro-field">
                    <label htmlFor="add-nombre">Nombre</label>
                    <input
                      id="add-nombre"
                      value={addForm.nombre ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!addErrors.nombre}
                      aria-describedby={addErrors.nombre ? "add-nombre-err" : undefined}
                    />
                    {addErrors.nombre && (
                      <p className="pro-error" id="add-nombre-err">
                        {addErrors.nombre}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="add-apellido">Apellido</label>
                    <input
                      id="add-apellido"
                      value={addForm.apellido ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!addErrors.apellido}
                      aria-describedby={addErrors.apellido ? "add-apellido-err" : undefined}
                    />
                    {addErrors.apellido && (
                      <p className="pro-error" id="add-apellido-err">
                        {addErrors.apellido}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="add-especialidad">Especialidad (ID)</label>
                    <input
                      id="add-especialidad"
                      value={addForm.especialidadId ?? ""}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, especialidadId: e.target.value }))
                      }
                      aria-invalid={!!addErrors.especialidadId}
                      aria-describedby={addErrors.especialidadId ? "add-esp-err" : undefined}
                    />
                    {addErrors.especialidadId && (
                      <p className="pro-error" id="add-esp-err">
                        {addErrors.especialidadId}
                      </p>
                    )}
                  </div>
                  <div className="pro-field">
                    <label htmlFor="add-telefono">Teléfono (opcional)</label>
                    <input
                      id="add-telefono"
                      value={addForm.telefono ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, telefono: e.target.value }))}
                      aria-invalid={!!addErrors.telefono}
                      aria-describedby={addErrors.telefono ? "add-tel-err" : undefined}
                      placeholder="+54 9 11 ..."
                    />
                    {addErrors.telefono && (
                      <p className="pro-error" id="add-tel-err">
                        {addErrors.telefono}
                      </p>
                    )}
                  </div>
                  <div className="pro-field pro-field--row">
                    <label className="pro-checkbox">
                      <input
                        type="checkbox"
                        checked={!!addForm.activo}
                        onChange={(e) =>
                          setAddForm((f) => ({ ...f, activo: e.currentTarget.checked }))
                        }
                      />
                      <span>Activo</span>
                    </label>
                  </div>

                  <div className="pro-modal-actions">
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
                <h2 id="pro-add-title">Confirmar nuevo profesional</h2>
                <p id="pro-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="pro-summary">
                  <li>
                    <strong>Nombre:</strong> {addForm.nombre}
                  </li>
                  <li>
                    <strong>Apellido:</strong> {addForm.apellido}
                  </li>
                  <li>
                    <strong>Especialidad (ID):</strong> {addForm.especialidadId}
                  </li>
                  <li>
                    <strong>Teléfono:</strong> {addForm.telefono || "—"}
                  </li>
                  <li>
                    <strong>Activo:</strong> {addForm.activo ? "Sí" : "No"}
                  </li>
                </ul>
                <div className="pro-modal-actions">
                  <button
                    type="button"
                    className="ui-btn ui-btn--outline"
                    onClick={() => setAddStep("form")}
                  >
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

      {/* ===== Modal: Editar ===== */}
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
                      value={editForm.nombre ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
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
                      value={editForm.apellido ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
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
                      value={editForm.especialidadId ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, especialidadId: e.target.value }))
                      }
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
                      value={editForm.telefono ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
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
                  <div className="pro-field pro-field--row">
                    <label className="pro-checkbox">
                      <input
                        type="checkbox"
                        checked={!!editForm.activo}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, activo: e.currentTarget.checked }))
                        }
                      />
                      <span>Activo</span>
                    </label>
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
                    <strong>Nombre:</strong> {editForm.nombre}
                  </li>
                  <li>
                    <strong>Apellido:</strong> {editForm.apellido}
                  </li>
                  <li>
                    <strong>Especialidad (ID):</strong> {editForm.especialidadId}
                  </li>
                  <li>
                    <strong>Teléfono:</strong> {editForm.telefono || "—"}
                  </li>
                  <li>
                    <strong>Activo:</strong> {editForm.activo ? "Sí" : "No"}
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
                {deleteTarget.nombre} {deleteTarget.apellido}
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
    </section>
  );
}
