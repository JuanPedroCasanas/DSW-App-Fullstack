import React, { useEffect, useMemo, useState } from "react";
import "./occupations.css";
import { Toast } from "@/components/ui/Feedback/Toast";

/** Modelo simple: viene del backend */
type Occupation = {
  id: string;
  name: string;
};

//Genera un toast para las respuestas del backend
async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.occupation?.id}, Nombre: ${resJson.occupation?.name}`;
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
const validateOcc = (o: Partial<Occupation>) => {
  const errors: Record<string, string> = {};
  if (!o.name?.trim()) errors.name = "Nombre obligatorio.";
  return errors;
};

export default function Occupations() {

  /* Estado principal: vacío para mostrar el estado vacío */
  const [items, setItems] = useState<Occupation[]>([]);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

 /*   este funciona pero bueno */
   useEffect(() => {
   (async () => {
 
       const res = await fetch("http://localhost:2000/Occupation/getAll");

      // if (!res.ok) throw new Error("Error al cargar obras sociales"); deberia ir al error del backend
      if (!res.ok){
        const toastData = await handleResponse(res);
        setToast(toastData);
      } else {
        const data: Occupation[] = await res.json();
        setItems(data);
      }

   })()
 }, []); 

  /* ---- Agregar ---- */
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<Occupation>>({ name: "" });
  const [addSnapshot, setAddSnapshot] = useState<Partial<Occupation> | null>(null);
  const addErrors = useMemo(() => validateOcc(addForm), [addForm]);

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
    const res = await fetch("http://localhost:2000/Occupation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: (addForm.name ?? "").trim() }),
    });

    const toastData = await handleResponse(res);
    setToast(toastData);
  
    // Recargar
    const resGet = await fetch("http://localhost:2000/Occupation/getAll");
    const data: Occupation[] = await resGet.json();
    setItems(data);

    setShowAdd(false);

    })();
  };

  /* ---- Editar  ---- */
  const [editTarget, setEditTarget] = useState<Occupation | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<Occupation>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<Occupation> | null>(null);
  const editErrors = useMemo(() => validateOcc(editForm), [editForm]);

  const openEdit = (o: Occupation) => {
    const initial = { name: o.name };
    setEditTarget(o);
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
    if(!editTarget) return;
    (async () => {

      const payload = {
          id: editTarget.id, 
          name: (editForm.name ?? "").trim() 
        };

      const res = await fetch("http://localhost:2000/Occupation/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // Refrescamos localmente
      setItems((prev) =>
        prev.map((o) => (o.id === editTarget.id ? { ...o, name: payload.name } : o))
      ); 

      const toastData = await handleResponse(res);
      setToast(toastData);

      closeEdit();

  })();
};

  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<Occupation | null>(null);
  const openDelete = (o: Occupation) => setDeleteTarget(o);
  const closeDelete = () => setDeleteTarget(null);

  const handleDeleteConfirm = () => {
    if(!deleteTarget) return;
    (async () => {
        
        const res = await fetch(
          `http://localhost:2000/Occupation/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await fetch("http://localhost:2000/Occupation/getAll");
        const data: Occupation[] = await resGet.json();
        setItems(data);

        const toastData = await handleResponse(res);
        setToast(toastData);

      setDeleteTarget(null);

    })();
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
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]); // como siempre... ver...

  const hasItems = items.length > 0;


  // ya ni es chiste, tengo que separar esto en otro archivo jajajajaj es una banda
  return (
    <section className="oc-container">
      <h1 className="oc-title">Especialidades</h1>

      {/* ===== Estado vacío ===== */}
      {!hasItems && (
        <div className="oc-empty-state" role="status" aria-live="polite">
          <svg className="oc-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 0 1 0-8h1V7a5 5 0 0 1 5-5Z"
            />
          </svg>
          <h2>No hay especialidades</h2>
          <p>Agregá la primera especialidad para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar especialidad
          </button>
        </div>
      )}

      {/* ===== Tabla ===== */}
      {hasItems && (
        <>
          <div className="oc-table-wrap">
            <table className="oc-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th className="oc-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id}>
                    <td data-label="ID">{o.id}</td>
                    <td data-label="Nombre">{o.name}</td>
                    <td className="oc-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--outline ui-btn--sm"
                        onClick={() => openEdit(o)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(o)}
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
          <div className="oc-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar especialidad
            </button>
          </div>
        </>
      )}

      {/* ===== Agregar ===== */}
      {showAdd && (
        <div className="oc-modal-backdrop" onClick={tryCloseAdd} role="presentation">
          <div
            className="oc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oc-add-title"
            aria-describedby="oc-add-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {addStep === "form" ? (
              <>
                <h2 id="oc-add-title">Agregar especialidad</h2>
                <p id="oc-add-desc" className="oc-help">Completá el nombre.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="oc-field">
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
                      <p className="oc-error" id="add-nombre-err">{addErrors.name}</p>
                    )}
                  </div>
                  <div className="oc-modal-actions">
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
                <h2 id="oc-add-title">Confirmar nueva especialidad</h2>
                <p id="oc-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="oc-summary">
                  <li><strong>Nombre:</strong> {addForm.name}</li>
                </ul>
                <div className="oc-modal-actions">
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
        <div className="oc-modal-backdrop" onClick={tryCloseEdit} role="presentation">
          <div
            className="oc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oc-edit-title"
            aria-describedby="oc-edit-desc"
            onClick={(e) => e.stopPropagation()}
          >
            {editStep === "form" ? (
              <>
                <h2 id="oc-edit-title">Editar especialidad</h2>
                <p id="oc-edit-desc" className="oc-help">Actualizá el nombre.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="oc-field">
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
                      <p className="oc-error" id="edit-nombre-err">{editErrors.name}</p>
                    )}
                  </div>
                  <div className="oc-modal-actions">
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
                <h2 id="oc-edit-title">Confirmar cambios</h2>
                <p id="oc-edit-desc">Verificá los datos editados.</p>
                <ul className="oc-summary">
                  <li><strong>ID:</strong> {editTarget?.id}</li>
                  <li><strong>Nombre:</strong> {editForm.name}</li>
                </ul>
                <div className="oc-modal-actions">
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
        <div className="oc-modal-backdrop" onClick={closeDelete} role="presentation">
          <div
            className="oc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oc-del-title"
            aria-describedby="oc-del-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="oc-del-title">Eliminar especialidad</h2>
            <p id="oc-del-desc">
              ¿Estás segura/o de eliminar <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="oc-modal-actions">
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
        <div className="oc-modal-backdrop" onClick={closeDiscard} role="presentation">
          <div
            className="oc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="oc-discard-title"
            aria-describedby="oc-discard-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="oc-discard-title">Descartar cambios</h2>
            <p id="oc-discard-desc">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
            <div className="oc-modal-actions">
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