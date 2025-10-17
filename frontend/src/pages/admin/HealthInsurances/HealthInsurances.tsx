import React, { useEffect, useMemo, useState } from "react";
import "./healthInsurances.css";
import { Toast } from "@/components/Toast";


/** Modelo simple: viene del backend */
type HealthInsurance = {
  id: string;
  name: string;
  isActive: boolean;
};

/* ---- Utils  ---- */
//const uid = () => Math.random().toString(36).slice(2, 10);
const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const validateHI = (h: Partial<HealthInsurance>) => {
  const errors: Record<string, string> = {};
  if (!h.name?.trim()) errors.name = "Nombre obligatorio.";
  return errors;
};

export default function HealthInsurances() {

  /* Estado principal: arrancamos vacío para mostrar el estado vacío */
  const [items, setItems] = useState<HealthInsurance[]>([]);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


  /* VER TODAS */
  useEffect(() => {
  (async () => {
    try {

      const res = await fetch("http://localhost:2000/HealthInsurance/getAll");
      if (!res.ok) throw new Error("Error al cargar obras sociales");
      const data: HealthInsurance[] = await res.json();
      setItems(data);

    } catch (e) {
      console.error(e);
      alert("No pude cargar las obras sociales.");
    }
  })();
}, []);


  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<HealthInsurance>>({ name: "" });
  const [addSnapshot, setAddSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  const addErrors = useMemo(() => validateHI(addForm), [addForm]);

  const openAdd = () => {
    const initial = { name: "" };
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
    (async () => {
        const res = await fetch("http://localhost:2000/HealthInsurance/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: (addForm.name ?? "").trim() }),
        });

        const resJson = await res.json();
      
        // Recargar
        const resGet = await fetch("http://localhost:2000/HealthInsurance/getAll");
        const data: HealthInsurance[] = await resGet.json();
        setItems(data);

       setShowAdd(false);
        
       if (res.ok) {
        let successMessage = `${resJson.message} Id: ${resJson.healthInsurance.id}, Nombre: ${resJson.healthInsurance.name}`
        setToast({ message: successMessage, type: "success" });
        } else {
          if (res.status == 500 || res.status == 400) {
            setToast({ message: resJson.message, type: "error" });
          } else {
            let errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
            setToast({ message: errorMessage, type: "error" });
          }
        }
       //alert(`${resJson.message},${resJson.healthInsurance.id}`);

    })();
  };

  /* ---- Editar ---- */
  const [editTarget, setEditTarget] = useState<HealthInsurance | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<HealthInsurance>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  const editErrors = useMemo(() => validateHI(editForm), [editForm]);

  const openEdit = (h: HealthInsurance) => {
    const initial = { name: h.name };
    setEditTarget(h);
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
  (async () => {
      const payload = {
          id: editTarget.id, 
          name: (editForm.name ?? "").trim() };
      const res = await fetch("http://localhost:2000/HealthInsurance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();

      // Refrescamos localmente
      setItems((prev) =>
        prev.map((h) => (h.id === editTarget.id ? { ...h, name: payload.name } : h))
      );

      closeEdit();

      if (res.ok) {
        alert(resJson.healthInsurance.name);
        } else {
          if (res.status == 500 || res.status == 400) {
            alert(resJson.message);
          } else {
            alert(resJson.error);
            alert(resJson.code);
            alert(resJson.message);
          }
        }

  })();
};

  /* ---- Eliminar (confirmación simple) ---- */
  const [deleteTarget, setDeleteTarget] = useState<HealthInsurance | null>(null);
  const openDelete = (h: HealthInsurance) => setDeleteTarget(h);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    (async () => {
      try {
        // http://localhost:2000/ConsultingRoom/delete/${deleteTarget.idConsultingRoom}`
        const res = await fetch(
          `http://localhost:2000/HealthInsurance/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

        if (!res.ok) throw new Error(await res.text());

      // Recargar
      const resGet = await fetch("http://localhost:2000/HealthInsurance/getAll");
      const data: HealthInsurance[] = await resGet.json();
      setItems(data);

      setDeleteTarget(null);

      } catch (e) {
        console.error(e);
        alert("No se pudo eliminar.");
      }
    })();
  };


  /* ---- Modal: DESCARTAR cambios ---- */
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "add") closeAdd();
    if (discardCtx.context === "edit") closeEdit();
    setDiscardCtx({ open: false });
  };

  /* ---- ESC para cerrar (respeta dirty-check) ---- */
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

  const hasItems = items.length > 0;

  return (
    <section className="hi-container">
      <h1 className="hi-title">Obras sociales</h1>

      {/* ===== Estado vacío ===== */}
      {!hasItems && (
        <div className="hi-empty-state" role="status" aria-live="polite">
          <svg className="hi-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 0 1 0-8h1V7a5 5 0 0 1 5-5Z"
            />
          </svg>
          <h2>No hay obras sociales</h2>
          <p>Agregá la primera obra social para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar obra social
          </button>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasItems && (
        <>
          <div className="hi-table-wrap">
            <table className="hi-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Activo</th>
                  <th className="hi-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((h) => (
                  <tr key={h.id}>
                    <td data-label="ID">{h.id}</td>
                    <td data-label="Nombre">{h.name}</td>
                    <td data-label="Activo">{h.isActive ? "Sí" : "No"}</td>
                    <td className="hi-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--outline ui-btn--sm"
                        onClick={() => openEdit(h)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(h)}
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
          <div className="hi-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar obra social
            </button>
          </div>
        </>
      )}

      {/* ===== MODAL: Agregar (2 pasos) ===== */}
      {showAdd && (
        <div className="hi-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="hi-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hi-add-title"
            aria-describedby="hi-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="hi-add-title">Agregar obra social</h2>
                <p id="hi-add-desc" className="hi-help">Completá el nombre.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="hi-field">
                    <label htmlFor="add-nombre">Nombre</label>
                    <input
                      id="add-nombre"
                      type="text"
                      value={addForm.name ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!addErrors.name}
                      aria-describedby={addErrors.name ? "add-nombre-err" : undefined}
                    />
                    {addErrors.name && (
                      <p className="hi-error" id="add-nombre-err">{addErrors.name}</p>
                    )}
                  </div>
                  <div className="hi-modal-actions">
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
                <h2 id="hi-add-title">Confirmar nueva obra social</h2>
                <p id="hi-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="hi-summary">
                  <li><strong>Nombre:</strong> {addForm.name}</li>
                </ul>
                <div className="hi-modal-actions">
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

      {/* ===== MODAL: Editar (2 pasos) ===== */}
      {editTarget && (
        <div className="hi-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="hi-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hi-edit-title"
            aria-describedby="hi-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="hi-edit-title">Editar obra social</h2>
                <p id="hi-edit-desc" className="hi-help">Actualizá el nombre.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="hi-field">
                    <label htmlFor="edit-nombre">Nombre</label>
                    <input
                      id="edit-nombre"
                      type="text"
                      value={editForm.name ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!editErrors.name}
                      aria-describedby={editErrors.name ? "edit-nombre-err" : undefined}
                    />
                    {editErrors.name && (
                      <p className="hi-error" id="edit-nombre-err">{editErrors.name}</p>
                    )}
                  </div>
                  <div className="hi-modal-actions">
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
                <h2 id="hi-edit-title">Confirmar cambios</h2>
                <p id="hi-edit-desc">Verificá los datos editados.</p>
                <ul className="hi-summary">
                  <li><strong>ID:</strong> {editTarget?.id}</li>
                  <li><strong>Nombre:</strong> {editForm.name}</li>
                </ul>
                <div className="hi-modal-actions">
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
        <div className="hi-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="hi-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hi-del-title"
            aria-describedby="hi-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="hi-del-title">Eliminar obra social</h2>
            <p id="hi-del-desc">
              ¿Estás segura/o de eliminar <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="hi-modal-actions">
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

      {/* ===== MODAL: Descartar cambios ===== */}
      {discardCtx.open && (
        <div className="hi-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="hi-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hi-discard-title"
            aria-describedby="hi-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="hi-discard-title">Descartar cambios</h2>
            <p id="hi-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="hi-modal-actions">
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