import React, { useEffect, useMemo, useState } from "react";
import "./consultingRooms.css";

/** Modelo simple: viene del backend */
type ConsultingRoom = {
  idConsultingRoom: string;
  description: string;
  isActive: boolean;
};

/* ---- Utils ---- */
//const uid = () => Math.random().toString(36).slice(2, 10);
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const validateRoom = (r: Partial<ConsultingRoom>) => {
  const errors: Record<string, string> = {};
  if (!r.description?.trim()) errors.description = "Descripción obligatoria.";
  return errors;
};

export default function ConsultingRooms() {

  /* Estado principal: por defecto vacío */
  const [rooms, setRooms] = useState<ConsultingRoom[]>([]);

  // para ver todos los consultorios
  useEffect(() => {
    (async () => {
      try {
        //const res = await fetch("/api/ConsultingRoom/getAll"); VER por qué no funciona esta llamada
        const res = await fetch("http://localhost:2000/ConsultingRoom/getAll");
        const data = await res.json();
        console.log("Consultorios recibidos:", data);
        setRooms(data);
      } catch (err) {
        console.error("Error al cargar consultorios:", err);
        alert("No se pudieron cargar los consultorios.");
      }
    })();
  }, []);

  
  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<ConsultingRoom>>({
    description: "",
  });
  const [addSnapshot, setAddSnapshot] = useState<Partial<ConsultingRoom> | null>(null);
  const addErrors = useMemo(() => validateRoom(addForm), [addForm]);

  const openAdd = () => {
    const initial = { description: "" };
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
    try {
      const nuevo = {
        description: (addForm.description ?? "").trim(),
      };

      const res = await fetch("http://localhost:2000/ConsultingRoom/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) throw new Error("Error al agregar consultorio");
      
      // Recargar
      const resGet = await fetch("http://localhost:2000/ConsultingRoom/getAll");
      const data: ConsultingRoom[] = await resGet.json();
      setRooms(data);

      setShowAdd(false);

    } catch (err) {
      console.error(err);
      alert("No se pudo agregar el consultorio.");
    }
  };


  /* ---- Editar  ---- */
  const [editTarget, setEditTarget] = useState<ConsultingRoom | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<ConsultingRoom>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<ConsultingRoom> | null>(null);
  const editErrors = useMemo(() => validateRoom(editForm), [editForm]);

  const openEdit = (r: ConsultingRoom) => {
    const initial = { description: r.description };
    setEditTarget(r);
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

    try {
      const actualizado = {
        idConsultingRoom: editTarget.idConsultingRoom,
        description: (editForm.description ?? "").trim(),
        //isActive: editTarget.isActive,
      };

      const res = await fetch("http://localhost:2000/ConsultingRoom/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      });

      if (!res.ok) throw new Error("Error al editar consultorio");

      const actualizadoFinal: ConsultingRoom = await res.json();
      setRooms((prev) =>
        prev.map((r) => (r.idConsultingRoom === editTarget.idConsultingRoom ? actualizadoFinal : r))
      );
      closeEdit();
      
    } catch (err) {
      console.error(err);
      alert("No se pudo editar el consultorio.");
    }
  };

  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<ConsultingRoom | null>(null);
  const openDelete = (r: ConsultingRoom) => setDeleteTarget(r);
  const closeDelete = () => setDeleteTarget(null);
  /*const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRooms((prev) => prev.filter((r) => r.idConsultingRoom !== deleteTarget.idConsultingRoom));
    setDeleteTarget(null);
    alert("Consultorio eliminado (simulado).");
  }; */
  const handleDeleteConfirm = async () => {
  if (!deleteTarget) return;

  try {
    const res = await fetch(
      `http://localhost:2000/ConsultingRoom/delete/${deleteTarget.idConsultingRoom}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Error al eliminar consultorio");

    setRooms((prev) => prev.filter((r) => r.idConsultingRoom !== deleteTarget.idConsultingRoom));
    setDeleteTarget(null);
  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar el consultorio.");
  }
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
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]); //VER !!!!

  const hasRooms = rooms.length > 0;

  // HTML.... probablemente deba pasarlo a otro archivo asi no queda alto spaghetti
  return (
    <section className="cr-container">
      <h1 className="cr-title">Consultorios</h1>

      {/* ===== Estado vacío ===== */}
      {!hasRooms && (
        <div className="cr-empty-state" role="status" aria-live="polite">
          <svg className="cr-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2zM6 6v7.5a.5.5 0 0 0 .5.5H19V6z"
            />
          </svg>
          <h2>No hay consultorios</h2>
          <p>Agregá tu primer consultorio para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar consultorio
          </button>
        </div>
      )}

      {/* ===== Tabla (mostrar)===== */}
      {hasRooms && (
        <>
          <div className="cr-table-wrap">
            <table className="cr-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th className="cr-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.idConsultingRoom}>
                    <td data-label="ID">{r.idConsultingRoom}</td>
                    <td data-label="Descripción">{r.description}</td>
                    <td className="cr-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--outline ui-btn--sm"
                        onClick={() => openEdit(r)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(r)}
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
          <div className="cr-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar consultorio
            </button>
          </div>
        </>
      )}

      {/* ===== Agregar parte 2 ===== */}
      {showAdd && (
        <div className="cr-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="cr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cr-add-title"
            aria-describedby="cr-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="cr-add-title">Agregar consultorio</h2>
                <p id="cr-add-desc" className="cr-help">
                  Completá la descripción del consultorio.
                </p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="cr-field">
                    <label htmlFor="add-descripcion">Descripción</label>
                    <textarea
                      id="add-descripcion"
                      value={addForm.description ?? ""}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, description: e.target.value }))
                      }
                      aria-invalid={!!addErrors.descripcion}
                      aria-describedby={addErrors.descripcion ? "add-descripcion-err" : undefined}
                    />
                    {addErrors.descripcion && (
                      <p className="cr-error" id="add-descripcion-err">
                        {addErrors.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="cr-modal-actions">
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
                <h2 id="cr-add-title">Confirmar nuevo consultorio</h2>
                <p id="cr-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="cr-summary">
                  <li>
                    <strong>Descripción:</strong> {addForm.description}
                  </li>
                </ul>
                <div className="cr-modal-actions">
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

      {/* ===== Editar ===== */}
      {editTarget && (
        <div className="cr-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="cr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cr-edit-title"
            aria-describedby="cr-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="cr-edit-title">Editar consultorio</h2>
                <p id="cr-edit-desc" className="cr-help">
                  Actualizá la descripción.
                </p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="cr-field">
                    <label htmlFor="edit-descripcion">Descripción</label>
                    <textarea
                      id="edit-descripcion"
                      value={editForm.description ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, description: e.target.value }))
                      }
                      aria-invalid={!!editErrors.descripcion}
                      aria-describedby={editErrors.descripcion ? "edit-descripcion-err" : undefined}
                    />
                    {editErrors.descripcion && (
                      <p className="cr-error" id="edit-descripcion-err">
                        {editErrors.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="cr-modal-actions">
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
                <h2 id="cr-edit-title">Confirmar cambios</h2>
                <p id="cr-edit-desc">Verificá los datos editados.</p>
                <ul className="cr-summary">
                  <li>
                    <strong>ID:</strong> {editTarget?.idConsultingRoom}
                  </li>
                  <li>
                    <strong>Descripción:</strong> {editForm.description}
                  </li>
                </ul>
                <div className="cr-modal-actions">
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

      {/* ===== Eliminar ===== */}
      {deleteTarget && (
        <div className="cr-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="cr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cr-del-title"
            aria-describedby="cr-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cr-del-title">Eliminar consultorio</h2>
            <p id="cr-del-desc">
              ¿Estás segura/o de eliminar el consultorio <strong>{deleteTarget.description}</strong>?
            </p>
            <div className="cr-modal-actions">
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
        <div className="cr-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="cr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cr-discard-title"
            aria-describedby="cr-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cr-discard-title">Descartar cambios</h2>
            <p id="cr-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="cr-modal-actions">
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
