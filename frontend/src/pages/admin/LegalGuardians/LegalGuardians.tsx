import React, { useEffect, useMemo, useState } from "react";
import "./legalGuardians.css";

/** Modelo simple: viene del backend */
type LegalGuardian = {
  id: string;
  nombre: string;
  apellido: string;
  
  /** ISO yyyy-mm-dd */
  fechaNacimiento: string;
  telefono: string;
  activo: boolean;
  obraSocial?: string | null; // ojo -> siempre voy a tener una OS!

  /** Nombres de pacientes a cargo (lectura). En backend podrían ser IDs. */
  pacientes?: string[]; // ojo 
};

/* ---- Utils ---- */

// ojo que se pasa todo a strings aunque del back no vengan como tal
const uid = () => Math.random().toString(36).slice(2, 10);
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const formatDate = (iso?: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso ?? "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const normalizePhone = (v: string) => v.replace(/[^\d+]/g, "");
const validateLG = (g: Partial<LegalGuardian>) => {
  const errors: Record<string, string> = {};
  if (!g.nombre?.trim()) errors.nombre = "Nombre obligatorio.";
  if (!g.apellido?.trim()) errors.apellido = "Apellido obligatorio.";
  if (!g.fechaNacimiento) errors.fechaNacimiento = "Fecha de nacimiento obligatoria.";
  if (!g.telefono?.trim()) {
    errors.telefono = "Teléfono obligatorio.";
  } else {
    const digits = normalizePhone(g.telefono).replace(/\D/g, "");
    if (digits.length < 6) errors.telefono = "Teléfono inválido (mínimo 6 dígitos).";
  }
  // obraSocial es opcional
  return errors;
};

export default function LegalGuardians() {

  /* Estado principal */
  const [items, setItems] = useState<LegalGuardian[]>([]);

  /* hardcodeados como ejemplo */
  useEffect(() => {
    setItems([
      {
        id: "lg1",
        nombre: "María",
        apellido: "Gómez",
        fechaNacimiento: "1985-03-12",
        telefono: "341 5551234",
        activo: true,
        obraSocial: "OSDE",
        pacientes: ["Lucía Gómez", "Santiago Gómez"]
      },
      {
        id: "lg2",
        nombre: "Carlos",
        apellido: "Pérez",
        fechaNacimiento: "1978-11-05",
        telefono: "341 4447788",
        activo: false,
        obraSocial: "IAPOS",
        pacientes: []
      }
    ]);
  }, []);
  

  /* --- Integración backend (placeholder) ---
     Reemplazá la URL y el shape según tu API. */
  // useEffect(() => {
  //   (async () => {
  //     const res = await fetch("/api/legal-guardians");
  //     if (!res.ok) return;
  //     const data: LegalGuardian[] = await res.json();
  //     setItems(data);
  //   })();
  // }, []);

  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<LegalGuardian>>({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    activo: true,
    obraSocial: "",
  });
  const [addSnapshot, setAddSnapshot] = useState<Partial<LegalGuardian> | null>(null);
  const addErrors = useMemo(() => validateLG(addForm), [addForm]);

  const openAdd = () => {
    const initial = {
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      telefono: "",
      activo: true,
      obraSocial: "",
    };
    setAddForm(initial);
    setAddSnapshot(initial);
    setAddStep("form");
    setShowAdd(true);
  };
  const closeAdd = () => setShowAdd(false);
  const tryCloseAdd = () => {
    const dirty = !sameJSON(addForm, addSnapshot);
    if (dirty) setDiscardCtx({ open: true, context: "add" });
    else closeAdd();
  };
  const handleAddContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(addErrors).length) return;
    setAddStep("confirm");
  };
  const handleAddConfirm = () => {
    const nuevo: LegalGuardian = {
      id: uid(), // en real, lo devuelve el backend
      nombre: (addForm.nombre ?? "").trim(),
      apellido: (addForm.apellido ?? "").trim(),
      fechaNacimiento: addForm.fechaNacimiento ?? "",
      telefono: (addForm.telefono ?? "").trim(),
      activo: !!addForm.activo,
      obraSocial: (addForm.obraSocial ?? "").trim() || null,
      pacientes: [],
    };
    setItems((prev) => [...prev, nuevo]);
    setShowAdd(false);
    alert("Responsable legal agregado (simulado).");
  };

  /* ---- Editar ---- */
  const [editTarget, setEditTarget] = useState<LegalGuardian | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<LegalGuardian>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<LegalGuardian> | null>(null);
  const editErrors = useMemo(() => validateLG(editForm), [editForm]);

  const openEdit = (g: LegalGuardian) => {
    const initial: Partial<LegalGuardian> = {
      nombre: g.nombre,
      apellido: g.apellido,
      fechaNacimiento: g.fechaNacimiento,
      telefono: g.telefono,
      activo: g.activo,
      obraSocial: g.obraSocial ?? "",
    };
    setEditTarget(g);
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
    if (dirty) setDiscardCtx({ open: true, context: "edit" });
    else closeEdit();
  };
  const handleEditContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(editErrors).length) return;
    setEditStep("confirm");
  };
  const handleEditConfirm = () => {
    if (!editTarget) return;
    setItems((prev) =>
      prev.map((g) =>
        g.id === editTarget.id
          ? {
              ...g,
              nombre: (editForm.nombre ?? "").trim(),
              apellido: (editForm.apellido ?? "").trim(),
              fechaNacimiento: editForm.fechaNacimiento ?? "",
              telefono: (editForm.telefono ?? "").trim(),
              activo: !!editForm.activo,
              obraSocial: (editForm.obraSocial ?? "").trim() || null,
            }
          : g
      )
    );
    closeEdit();
    alert("Responsable legal actualizado (simulado).");
  };

  /* ---- Eliminar  ---- */
  const [deleteTarget, setDeleteTarget] = useState<LegalGuardian | null>(null);
  const openDelete = (g: LegalGuardian) => setDeleteTarget(g);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
    alert("Responsable legal eliminado (simulado).");
  };

  /* ---- DESCARTAR cambios ---- */
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
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]); // VER !!

  const hasItems = items.length > 0;

  // parte de html que como siempre, deberiamos quizas sacarlo de aca
  return (
    <section className="lg-container">
      <h1 className="lg-title">Responsables legales</h1>

      {/* ===== Estado vacío ===== */}
      {!hasItems && (
        <div className="lg-empty-state" role="status" aria-live="polite">
          <svg className="lg-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"
            />
          </svg>
          <h2>No hay responsables legales</h2>
          <p>Agregá el primero para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar responsable
          </button>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasItems && (
        <>
          <div className="lg-table-wrap">
            <table className="lg-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha de nacimiento</th>
                  <th>Teléfono</th>
                  <th>Activo</th>
                  <th>Obra social</th>
                  <th>Pacientes a cargo</th>
                  <th className="lg-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((g) => (
                  <tr key={g.id}>
                    <td data-label="Nombre">{g.nombre}</td>
                    <td data-label="Apellido">{g.apellido}</td>
                    <td data-label="Fecha de nacimiento">{formatDate(g.fechaNacimiento)}</td>
                    <td data-label="Teléfono">{g.telefono}</td>
                    <td data-label="Activo">
                      <span className={`lg-badge ${g.activo ? "lg-badge--active" : "lg-badge--inactive"}`}>
                        {g.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td data-label="Obra social">{g.obraSocial || "—"}</td>
                    <td data-label="Pacientes a cargo">
                      {g.pacientes?.length ? `${g.pacientes.length}` : "0"}
                    </td>
                    <td className="lg-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--outline ui-btn--sm"
                        onClick={() => openEdit(g)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(g)}
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
          <div className="lg-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar responsable
            </button>
          </div>
        </>
      )}

      {/* ===== Agregar ===== */}
      {showAdd && (
        <div className="lg-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="lg-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lg-add-title"
            aria-describedby="lg-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="lg-add-title">Agregar responsable legal</h2>
                <p id="lg-add-desc" className="lg-help">Completá los datos del responsable.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="lg-field">
                    <label htmlFor="add-nombre">Nombre</label>
                    <input
                      id="add-nombre"
                      type="text"
                      value={addForm.nombre ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!addErrors.nombre}
                      aria-describedby={addErrors.nombre ? "add-nombre-err" : undefined}
                    />
                    {addErrors.nombre && <p className="lg-error" id="add-nombre-err">{addErrors.nombre}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="add-apellido">Apellido</label>
                    <input
                      id="add-apellido"
                      type="text"
                      value={addForm.apellido ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!addErrors.apellido}
                      aria-describedby={addErrors.apellido ? "add-apellido-err" : undefined}
                    />
                    {addErrors.apellido && <p className="lg-error" id="add-apellido-err">{addErrors.apellido}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="add-fecha">Fecha de nacimiento</label>
                    <input
                      id="add-fecha"
                      type="date"
                      value={addForm.fechaNacimiento ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!addErrors.fechaNacimiento}
                      aria-describedby={addErrors.fechaNacimiento ? "add-fecha-err" : undefined}
                    />
                    {addErrors.fechaNacimiento && <p className="lg-error" id="add-fecha-err">{addErrors.fechaNacimiento}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="add-telefono">Teléfono</label>
                    <input
                      id="add-telefono"
                      type="tel"
                      value={addForm.telefono ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, telefono: e.target.value }))}
                      aria-invalid={!!addErrors.telefono}
                      aria-describedby={addErrors.telefono ? "add-telefono-err" : undefined}
                    />
                    {addErrors.telefono && <p className="lg-error" id="add-telefono-err">{addErrors.telefono}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="add-obra">Obra social (opcional)</label>
                    <input
                      id="add-obra"
                      type="text"
                      value={addForm.obraSocial ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, obraSocial: e.target.value }))}
                    />
                  </div>

                  <div className="lg-field">
                    <span className="lg-checkline">
                      <input
                        id="add-activo"
                        type="checkbox"
                        checked={!!addForm.activo}
                        onChange={(e) => setAddForm((f) => ({ ...f, activo: e.target.checked }))}
                      />
                      <label htmlFor="add-activo">Activo</label>
                    </span>
                  </div>

                  <div className="lg-modal-actions">
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
                <h2 id="lg-add-title">Confirmar nuevo responsable</h2>
                <p id="lg-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="lg-summary">
                  <li><strong>Nombre:</strong> {addForm.nombre}</li>
                  <li><strong>Apellido:</strong> {addForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(addForm.fechaNacimiento)}</li>
                  <li><strong>Teléfono:</strong> {addForm.telefono}</li>
                  <li><strong>Estado:</strong> {addForm.activo ? "Activo" : "Inactivo"}</li>
                  <li><strong>Obra social:</strong> {addForm.obraSocial || "—"}</li>
                </ul>
                <div className="lg-modal-actions">
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

      {/* ===== Editar ===== */}
      {editTarget && (
        <div className="lg-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="lg-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lg-edit-title"
            aria-describedby="lg-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="lg-edit-title">Editar responsable</h2>
                <p id="lg-edit-desc" className="lg-help">Actualizá los datos necesarios.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="lg-field">
                    <label htmlFor="edit-nombre">Nombre</label>
                    <input
                      id="edit-nombre"
                      type="text"
                      value={editForm.nombre ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!editErrors.nombre}
                      aria-describedby={editErrors.nombre ? "edit-nombre-err" : undefined}
                    />
                    {editErrors.nombre && <p className="lg-error" id="edit-nombre-err">{editErrors.nombre}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="edit-apellido">Apellido</label>
                    <input
                      id="edit-apellido"
                      type="text"
                      value={editForm.apellido ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!editErrors.apellido}
                      aria-describedby={editErrors.apellido ? "edit-apellido-err" : undefined}
                    />
                    {editErrors.apellido && <p className="lg-error" id="edit-apellido-err">{editErrors.apellido}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="edit-fecha">Fecha de nacimiento</label>
                    <input
                      id="edit-fecha"
                      type="date"
                      value={editForm.fechaNacimiento ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!editErrors.fechaNacimiento}
                      aria-describedby={editErrors.fechaNacimiento ? "edit-fecha-err" : undefined}
                    />
                    {editErrors.fechaNacimiento && <p className="lg-error" id="edit-fecha-err">{editErrors.fechaNacimiento}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="edit-telefono">Teléfono</label>
                    <input
                      id="edit-telefono"
                      type="tel"
                      value={editForm.telefono ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
                      aria-invalid={!!editErrors.telefono}
                      aria-describedby={editErrors.telefono ? "edit-telefono-err" : undefined}
                    />
                    {editErrors.telefono && <p className="lg-error" id="edit-telefono-err">{editErrors.telefono}</p>}
                  </div>

                  <div className="lg-field">
                    <label htmlFor="edit-obra">Obra social (opcional)</label>
                    <input
                      id="edit-obra"
                      type="text"
                      value={editForm.obraSocial ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, obraSocial: e.target.value }))}
                    />
                  </div>

                  <div className="lg-field">
                    <span className="lg-checkline">
                      <input
                        id="edit-activo"
                        type="checkbox"
                        checked={!!editForm.activo}
                        onChange={(e) => setEditForm((f) => ({ ...f, activo: e.target.checked }))}
                      />
                      <label htmlFor="edit-activo">Activo</label>
                    </span>
                  </div>

                  <div className="lg-modal-actions">
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
                <h2 id="lg-edit-title">Confirmar cambios</h2>
                <p id="lg-edit-desc">Verificá los datos editados.</p>
                <ul className="lg-summary">
                  <li><strong>ID:</strong> {editTarget?.id}</li>
                  <li><strong>Nombre:</strong> {editForm.nombre}</li>
                  <li><strong>Apellido:</strong> {editForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(editForm.fechaNacimiento)}</li>
                  <li><strong>Teléfono:</strong> {editForm.telefono}</li>
                  <li><strong>Estado:</strong> {editForm.activo ? "Activo" : "Inactivo"}</li>
                  <li><strong>Obra social:</strong> {editForm.obraSocial || "—"}</li>
                  <li>
                    <strong>Pacientes a cargo:</strong>{" "}
                    {editTarget?.pacientes?.length ? (
                      <>
                        {editTarget.pacientes.length} paciente(s)
                        <ul className="lg-pacientes">
                          {editTarget.pacientes.slice(0, 5).map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </>
                    ) : "0"}
                  </li>
                </ul>
                <div className="lg-modal-actions">
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

      {/* ===== Eliminar ===== */}
      {deleteTarget && (
        <div className="lg-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="lg-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lg-del-title"
            aria-describedby="lg-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="lg-del-title">Eliminar responsable</h2>
            <p id="lg-del-desc">
              ¿Estás segura/o de eliminar a <strong>{deleteTarget.nombre} {deleteTarget.apellido}</strong>?
            </p>
            <div className="lg-modal-actions">
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
        <div className="lg-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="lg-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lg-discard-title"
            aria-describedby="lg-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="lg-discard-title">Descartar cambios</h2>
            <p id="lg-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="lg-modal-actions">
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
