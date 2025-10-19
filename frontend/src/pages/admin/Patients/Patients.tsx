import React, { useEffect, useMemo, useState } from "react";
import "./patients.css";

/** Modelo simple */
type Patient = {
  id: string;
  nombre: string;
  apellido: string;
  /** ISO yyyy-mm-dd */
  fechaNacimiento: string;
  telefono: string; // ojo !! -> si tiene responsable legal, el telefono va a ser nulo
  legalGuardianId: string | null; // puede ser null si no tiene
  activo: boolean;
  healthInsuranceId: string | null; // puede ser null
};

/** Listas de apoyo (para selects) */
type GuardianOpt = { id: string; nombre: string; apellido: string };
type InsuranceOpt = { id: string; nombre: string };

/* ---- Utils  ---- */
const uid = () => Math.random().toString(36).slice(2, 10);
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const formatDate = (iso?: string) => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso ?? "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const normalizePhone = (v: string) => v.replace(/[^\d+]/g, "");
const validatePatient = (p: Partial<Patient>) => {
  const errors: Record<string, string> = {};
  if (!p.nombre?.trim()) errors.nombre = "Nombre obligatorio.";
  if (!p.apellido?.trim()) errors.apellido = "Apellido obligatorio.";
  if (!p.fechaNacimiento) errors.fechaNacimiento = "Fecha de nacimiento obligatoria.";

  // ojo -> si tiene resp legal, el paciente NOOOO! va a tener telefono
  if (!p.telefono?.trim()) {
    errors.telefono = "Teléfono obligatorio.";
  } else {
    const digits = normalizePhone(p.telefono).replace(/\D/g, "");
    if (digits.length < 6) errors.telefono = "Teléfono inválido (mínimo 6 dígitos).";
  }

  // legalGuardianId y healthInsuranceId pueden ser null (opcionales)
  // creo que obra social no deberia ser nula, deberia chequear el back primero
  return errors;
};

export default function Patients() {
  /* Estado principal */
  const [items, setItems] = useState<Patient[]>([]);

  /* Listas auxiliares para selects (guardianes y obras sociales) */
  const [guardians, setGuardians] = useState<GuardianOpt[]>([]);
  const [insurances, setInsurances] = useState<InsuranceOpt[]>([]);

  /* Si querés simular data rápida, descomentá: */
  useEffect(() => {
      setGuardians([
        { id: "1", nombre: "María", apellido: "Gómez" },
        { id: "2", nombre: "Carlos", apellido: "Pérez" },
      ]);
      setInsurances([
        { id: "1", nombre: "OSDE" },
        { id: "2", nombre: "IAPOS" },
      ]);
      setItems([
        {
          id: "p1",
          nombre: "Lucía",
          apellido: "Gómez",
          fechaNacimiento: "2012-06-21",
          telefono: "NULL",
          legalGuardianId: "1",
          activo: true,
          healthInsuranceId: "1",
        },
      ]);
    }, []);

  /* --- Integración backend (placeholder) ---
     Reemplazá las URLs y el shape según tu API. */
  // useEffect(() => {
  //   (async () => {
  //     const [pRes, gRes, hRes] = await Promise.all([
  //       fetch("/api/patients"),
  //       fetch("/api/legal-guardians"),
  //       fetch("/api/health-insurances"),
  //     ]);
  //     if (pRes.ok) setItems(await pRes.json());
  //     if (gRes.ok) setGuardians(await gRes.json());
  //     if (hRes.ok) setInsurances(await hRes.json());
  //   })();
  // }, []);

  /* para mostrar nombre legible en la tablita */
  const guardianName = (id?: string | null) => {
    if (!id) return "—";
    const g = guardians.find((x) => x.id === id);
    return g ? `${g.nombre} ${g.apellido}` : id;
  };
  const insuranceName = (id?: string | null) => {
    if (!id) return "—";
    const i = insurances.find((x) => x.id === id);
    return i ? i.nombre : id;
  };

  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<Patient>>({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    legalGuardianId: "",
    activo: true,
    healthInsuranceId: "",
  });
  const [addSnapshot, setAddSnapshot] = useState<Partial<Patient> | null>(null);
  const addErrors = useMemo(() => validatePatient(addForm), [addForm]);

  const openAdd = () => {
    const initial = {
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      telefono: "",
      legalGuardianId: "",
      activo: true,
      healthInsuranceId: "",
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
    const nuevo: Patient = {
      id: uid(), // en real, lo devuelve el backend
      nombre: (addForm.nombre ?? "").trim(),
      apellido: (addForm.apellido ?? "").trim(),
      fechaNacimiento: addForm.fechaNacimiento ?? "",
      telefono: (addForm.telefono ?? "").trim(),
      legalGuardianId: (addForm.legalGuardianId ?? "") || null,
      activo: !!addForm.activo,
      healthInsuranceId: (addForm.healthInsuranceId ?? "") || null,
    };
    setItems((prev) => [...prev, nuevo]);
    setShowAdd(false);
    alert("Paciente agregado (simulado).");
  };

  /* ---- Editar ---- */
  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Patient> | null>(null);
  const editErrors = useMemo(() => validatePatient(editForm), [editForm]);

  const openEdit = (p: Patient) => {
    const initial: Partial<Patient> = {
      nombre: p.nombre,
      apellido: p.apellido,
      fechaNacimiento: p.fechaNacimiento,
      telefono: p.telefono,
      legalGuardianId: p.legalGuardianId ?? "",
      activo: p.activo,
      healthInsuranceId: p.healthInsuranceId ?? "",
    };
    setEditTarget(p);
    setEditForm(initial);
    setEditSnapshot(initial);
    setEditStep("form");
  };
  const closeEdit = () => { setEditTarget(null); setEditForm({}); setEditSnapshot(null); };
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
      prev.map((p) =>
        p.id === editTarget.id
          ? {
              ...p,
              nombre: (editForm.nombre ?? "").trim(),
              apellido: (editForm.apellido ?? "").trim(),
              fechaNacimiento: editForm.fechaNacimiento ?? "",
              telefono: (editForm.telefono ?? "").trim(),
              legalGuardianId: (editForm.legalGuardianId ?? "") || null,
              activo: !!editForm.activo,
              healthInsuranceId: (editForm.healthInsuranceId ?? "") || null,
            }
          : p
      )
    );
    closeEdit();
    alert("Paciente actualizado (simulado).");
  };

  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const openDelete = (p: Patient) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    alert("Paciente eliminado (simulado).");
  };

  /* ---- DESCARTAR cambios ---- */
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({ open: false });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "add") closeAdd();
    if (discardCtx.context === "edit") closeEdit();
    setDiscardCtx({ open: false });
  };

  /* ---- ESC para cerrar  ---- */
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
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]); //debo ver esto...

  const hasItems = items.length > 0;


  // aldshfkdjs AYUDAAAAAAAAAAAAAAAAAAAA
  return (
    <section className="pt-container">
      <h1 className="pt-title">Pacientes</h1>

      {/* ===== Estado vacío ===== */}
      {!hasItems && (
        <div className="pt-empty-state" role="status" aria-live="polite">
          <svg className="pt-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"/>
          </svg>
          <h2>No hay pacientes</h2>
          <p>Agregá el primero para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar paciente
          </button>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasItems && (
        <>
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha de nacimiento</th>
                  <th>Teléfono</th>
                  <th>Responsable legal</th>
                  <th>Obra social</th>
                  <th>Activo</th>
                  <th className="pt-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Apellido">{p.apellido}</td>
                    <td data-label="Fecha de nacimiento">{formatDate(p.fechaNacimiento)}</td>
                    <td data-label="Teléfono">{p.telefono}</td>
                    <td data-label="Responsable legal">{guardianName(p.legalGuardianId)}</td>
                    <td data-label="Obra social">{insuranceName(p.healthInsuranceId)}</td>
                    <td data-label="Activo">
                      <span className={`pt-badge ${p.activo ? "pt-badge--active" : "pt-badge--inactive"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="pt-actions">
                      <button type="button" className="ui-btn ui-btn--outline ui-btn--sm" onClick={() => openEdit(p)}>
                        Editar
                      </button>
                      <button type="button" className="ui-btn ui-btn--danger ui-btn--sm" onClick={() => openDelete(p)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agregar */}
          <div className="pt-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar paciente
            </button>
          </div>
        </>
      )}

      {/* ===== Agregar ===== */}
      {showAdd && (
        <div className="pt-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="pt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pt-add-title"
            aria-describedby="pt-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="pt-add-title">Agregar paciente</h2>
                <p id="pt-add-desc" className="pt-help">Completá los datos del paciente.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="pt-field">
                    <label htmlFor="add-nombre">Nombre</label>
                    <input
                      id="add-nombre"
                      type="text"
                      value={addForm.nombre ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!addErrors.nombre}
                      aria-describedby={addErrors.nombre ? "add-nombre-err" : undefined}
                    />
                    {addErrors.nombre && <p className="pt-error" id="add-nombre-err">{addErrors.nombre}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="add-apellido">Apellido</label>
                    <input
                      id="add-apellido"
                      type="text"
                      value={addForm.apellido ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!addErrors.apellido}
                      aria-describedby={addErrors.apellido ? "add-apellido-err" : undefined}
                    />
                    {addErrors.apellido && <p className="pt-error" id="add-apellido-err">{addErrors.apellido}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="add-fecha">Fecha de nacimiento</label>
                    <input
                      id="add-fecha"
                      type="date"
                      value={addForm.fechaNacimiento ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!addErrors.fechaNacimiento}
                      aria-describedby={addErrors.fechaNacimiento ? "add-fecha-err" : undefined}
                    />
                    {addErrors.fechaNacimiento && <p className="pt-error" id="add-fecha-err">{addErrors.fechaNacimiento}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="add-telefono">Teléfono</label>
                    <input
                      id="add-telefono"
                      type="tel"
                      value={addForm.telefono ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, telefono: e.target.value }))}
                      aria-invalid={!!addErrors.telefono}
                      aria-describedby={addErrors.telefono ? "add-telefono-err" : undefined}
                    />
                    {addErrors.telefono && <p className="pt-error" id="add-telefono-err">{addErrors.telefono}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="add-guardian">Responsable legal</label>
                    <select
                      id="add-guardian"
                      value={addForm.legalGuardianId ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, legalGuardianId: e.target.value }))}
                    >
                      <option value="">Sin responsable</option>
                      {guardians.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre} {g.apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-field">
                    <label htmlFor="add-insurance">Obra social</label>
                    <select
                      id="add-insurance"
                      value={addForm.healthInsuranceId ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, healthInsuranceId: e.target.value }))}
                    >
                      <option value="">Sin obra social</option>
                      {insurances.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-field">
                    <span className="pt-checkline">
                      <input
                        id="add-activo"
                        type="checkbox"
                        checked={!!addForm.activo}
                        onChange={(e) => setAddForm((f) => ({ ...f, activo: e.target.checked }))}
                      />
                      <label htmlFor="add-activo">Activo</label>
                    </span>
                  </div>

                  <div className="pt-modal-actions">
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
                <h2 id="pt-add-title">Confirmar nuevo paciente</h2>
                <p id="pt-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="pt-summary">
                  <li><strong>Nombre:</strong> {addForm.nombre}</li>
                  <li><strong>Apellido:</strong> {addForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(addForm.fechaNacimiento)}</li>
                  <li><strong>Teléfono:</strong> {addForm.telefono}</li>
                  <li><strong>Responsable legal:</strong> {guardianName(addForm.legalGuardianId)}</li>
                  <li><strong>Obra social:</strong> {insuranceName(addForm.healthInsuranceId)}</li>
                  <li><strong>Estado:</strong> {addForm.activo ? "Activo" : "Inactivo"}</li>
                </ul>
                <div className="pt-modal-actions">
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
        <div className="pt-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="pt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pt-edit-title"
            aria-describedby="pt-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="pt-edit-title">Editar paciente</h2>
                <p id="pt-edit-desc" className="pt-help">Actualizá los datos necesarios.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="pt-field">
                    <label htmlFor="edit-nombre">Nombre</label>
                    <input
                      id="edit-nombre"
                      type="text"
                      value={editForm.nombre ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                      aria-invalid={!!editErrors.nombre}
                      aria-describedby={editErrors.nombre ? "edit-nombre-err" : undefined}
                    />
                    {editErrors.nombre && <p className="pt-error" id="edit-nombre-err">{editErrors.nombre}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="edit-apellido">Apellido</label>
                    <input
                      id="edit-apellido"
                      type="text"
                      value={editForm.apellido ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                      aria-invalid={!!editErrors.apellido}
                      aria-describedby={editErrors.apellido ? "edit-apellido-err" : undefined}
                    />
                    {editErrors.apellido && <p className="pt-error" id="edit-apellido-err">{editErrors.apellido}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="edit-fecha">Fecha de nacimiento</label>
                    <input
                      id="edit-fecha"
                      type="date"
                      value={editForm.fechaNacimiento ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, fechaNacimiento: e.target.value }))}
                      aria-invalid={!!editErrors.fechaNacimiento}
                      aria-describedby={editErrors.fechaNacimiento ? "edit-fecha-err" : undefined}
                    />
                    {editErrors.fechaNacimiento && <p className="pt-error" id="edit-fecha-err">{editErrors.fechaNacimiento}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="edit-telefono">Teléfono</label>
                    <input
                      id="edit-telefono"
                      type="tel"
                      value={editForm.telefono ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
                      aria-invalid={!!editErrors.telefono}
                      aria-describedby={editErrors.telefono ? "edit-telefono-err" : undefined}
                    />
                    {editErrors.telefono && <p className="pt-error" id="edit-telefono-err">{editErrors.telefono}</p>}
                  </div>

                  <div className="pt-field">
                    <label htmlFor="edit-guardian">Responsable legal</label>
                    <select
                      id="edit-guardian"
                      value={editForm.legalGuardianId ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, legalGuardianId: e.target.value }))}
                    >
                      <option value="">Sin responsable</option>
                      {guardians.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre} {g.apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-field">
                    <label htmlFor="edit-insurance">Obra social</label>
                    <select
                      id="edit-insurance"
                      value={editForm.healthInsuranceId ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, healthInsuranceId: e.target.value }))}
                    >
                      <option value="">Sin obra social</option>
                      {insurances.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-field">
                    <span className="pt-checkline">
                      <input
                        id="edit-activo"
                        type="checkbox"
                        checked={!!editForm.activo}
                        onChange={(e) => setEditForm((f) => ({ ...f, activo: e.target.checked }))}
                      />
                      <label htmlFor="edit-activo">Activo</label>
                    </span>
                  </div>

                  <div className="pt-modal-actions">
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
                <h2 id="pt-edit-title">Confirmar cambios</h2>
                <p id="pt-edit-desc">Verificá los datos editados.</p>
                <ul className="pt-summary">
                  <li><strong>ID:</strong> {editTarget?.id}</li>
                  <li><strong>Nombre:</strong> {editForm.nombre}</li>
                  <li><strong>Apellido:</strong> {editForm.apellido}</li>
                  <li><strong>Fecha de nacimiento:</strong> {formatDate(editForm.fechaNacimiento)}</li>
                  <li><strong>Teléfono:</strong> {editForm.telefono}</li>
                  <li><strong>Responsable legal:</strong> {guardianName(editForm.legalGuardianId)}</li>
                  <li><strong>Obra social:</strong> {insuranceName(editForm.healthInsuranceId)}</li>
                  <li><strong>Estado:</strong> {editForm.activo ? "Activo" : "Inactivo"}</li>
                </ul>
                <div className="pt-modal-actions">
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
        <div className="pt-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="pt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pt-del-title"
            aria-describedby="pt-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pt-del-title">Eliminar paciente</h2>
            <p id="pt-del-desc">
              ¿Estás segura/o de eliminar a <strong>{deleteTarget.nombre} {deleteTarget.apellido}</strong>?
            </p>
            <div className="pt-modal-actions">
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
        <div className="pt-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="pt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pt-discard-title"
            aria-describedby="pt-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="pt-discard-title">Descartar cambios</h2>
            <p id="pt-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="pt-modal-actions">
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
