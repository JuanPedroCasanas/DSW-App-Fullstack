import React, { useState, useEffect, useMemo } from 'react';
import './ProfessionalHealthInsurance.css';
import HealthInsurances from '../admin/HealthInsurances/HealthInsurances';
import  {HealthInsurance, Professional} from "./ProfessionalHealthInsuranceTypes"
import { Toast } from "@/components/Toast";

const validateHealthInsurance = (p: Partial<HealthInsurance>) => {
  const errors: Record<string, string> = {};
  if (!p.name?.trim()) errors.nombre = "Nombre obligatorio.";
  return errors;
};

const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function HealthInsuranceProfessional() {

async function handleProfessionalResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Nombre: ${resJson.firstName?.firstName}${resJson.astName?.lastName} `;
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
async function handleHealthInsuranceResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.healthInsurance?.id}, Nombre: ${resJson.name?.name} `;
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

export default function HealthInsurancesByProfessional(){
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId]=useState <number | null>(null);

  // ---------- Agregar (2 pasos + dirty-check) ----------
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");
  const [addForm, setAddForm] = useState<Partial<HealthInsurance>>({
    name: ""
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [addSnapshot, setAddSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  const addErrors = useMemo(() => validateHealthInsurance(addForm), [addForm]);
 /*
  */
  
    useEffect(() => {
    (async () => {
      const res = await fetch ("http://localhost:2000/Professional/getAll?includeInactive=true");
    if (!res.ok){
      const toastData = await handleProfessionalResponse(res);
      setToast(toastData);
    }else{
      const data: Professional[]=await res.json();
      setProfessionals(data);
      if(selectedProfessionalId===null){
        setSelectedProfessionalId(data[0]?.id ?? null);
      }
    }
  })()
    },[]);   
    
    useEffect(() => {
      if(!selectedProfessionalId) return;
    (async () => {
      const res = await fetch (`http://localhost:2000/HealthInsurance/getHealthInsuranceByProfessional/${selectedProfessionalId}?includeInactive=false`);
    
    if (!res.ok){
      const toastData = await handleProfessionalResponse(res);
      setToast(toastData);
    }else{
      const data: HealthInsurance[]=await res.json();
      setHealthInsurances(data)
      }
  })()
    },[selectedProfessionalId]);   
    

  const openAdd = () => {
    const initial = { name:''};
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
      name:(addForm.name ?? "").trim(),
      idProfessional:selectedProfessionalId,
    }
    const res = await fetch('http://localhost:2000/Professional/addHealthInsurance', {
     method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload }),
        });
        if(res.ok) {
      const resGet = await fetch(`http://localhost:2000/HealthInsurance/getHealthInsuranceByProfessional/${selectedProfessionalId}?includeInactive=true`);
      const data: HealthInsurance[] = await resGet.json();
      setHealthInsurances(data); 
    }
    closeAdd()
    const toastData = await handleHealthInsuranceResponse(res);
    setToast(toastData);
  };
 
// ---------- Editar (2 pasos + dirty-check) ----------
  const [editTarget, setEditTarget] = useState<HealthInsurance | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<HealthInsurance>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  const editErrors = useMemo(() => validateHealthInsurance(editForm), [editForm]);
  
  const openEdit = (o: HealthInsurance) => {
    const initial = {
      name: o.name,
    };
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
    
    const payload = {
      idHealthInsurance:editTarget.id,
      name:(editForm.name ?? "").trim()
    };

    const res = await fetch("http://localhost:2000/HealthInsruance/updateHealthInsurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const resGet = await fetch(`http://localhost:2000/HealthInsurance/getHealthInsuranceByProfessional/${selectedProfessionalId}?includeInactive=true`);
      const data: HealthInsurance[] = await resGet.json();
      setHealthInsurances(data); 
    }
    closeEdit();
    const toastData = await handleHealthInsuranceResponse(res);
    setToast(toastData);
  };

  // ---------- Eliminar (confirmación simple) ----------
  const [deleteTarget, setDeleteTarget] = useState<HealthInsurance | null>(null);
  const openDelete = (o: HealthInsurance) => setDeleteTarget(o);
  const closeDelete = () => setDeleteTarget(null);
  
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const res = await fetch('http://localhost:2000/Professional/deleteHealthInsurance/${deleteTarget.id}',
      {method: "POST",
  });
  if (res.ok) {
      const resGet = await fetch(`http://localhost:2000/HealthInsurance/getHealthInsuranceByProfessional/${selectedProfessionalId}?includeInactive=true`);
      const data: HealthInsurance[] = await resGet.json();
      setHealthInsurances(data); 
    }
      closeDelete();
      setDeleteTarget(null);
      const toastData= await handleHealthInsuranceResponse(res);
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
const hasHealthInsurances = HealthInsurances.length > 0;

 return (
  <section className="gp-container">
     <h1 className="gp-title">Obras sociales admitidas </h1>

      <div className="gp-guardian-select">
        <label htmlFor="guardian" className="sr-only">Profesionales</label>
        <select
          value={selectedProfessionalId ?? ''}
          onChange={(e) => setSelectedProfessionalId(Number(e.target.value))}
        >
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
            Id:{g.id},{p.firstName} {p.lastName}
            </option>
          ))}
        </select>
       </div>
       {!hasHealthInsurances && (
        <div className="gp-empty-state" role="status" aria-live="polite">
          {/* Icono simple inline */}
          <svg className="gp-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"/>
          </svg>
          <h2>No posee obras sociales</h2>
          <p>Agregá tu primer obra social para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar obra social
          </button>
        </div>
      )}
         {hasHealthInsurances && (
        <>
          <div className="gp-table-wrap">
            <table className="gp-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Obra Social</th>
                  <th className="gp-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((p) => (
                  <tr key={p.id}>
                    <td data-label="firstName">{p.firstName}</td>
                    <td data-label="lastName">{p.lastName}</td>
                    <td data-label="healthInsurances">{p.healthInsurances && p.healthInsurances.length > 0 ? (
                                                      p.healthInsurances.map((os) => (
                                                      <div key={os.id}>
                                                      {os.name} 
                                                       </div>
                                                        ))
                                                        ) : ( '— Sin obras sociales —'
                                                       )}</td>
                    <td className="gp-actions">
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
       {/* Footer: Agregar */}
          <div className="gp-footer">
            <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
              Agregar Obra Social
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
                <h2 id="gp-add-title">Agregar Obra social</h2>
                <p id="gp-add-desc" className="gp-help">Completá con el nombre de la obra social.</p>
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="gp-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="add-name"
                      type="text"
                      value={addForm.name ?? ""}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!addErrors.name}
                      aria-describedby={addErrors.name? "add-name-err" : undefined}
                    />
                    {addErrors.name && <p className="gp-error" id="add-firstName-err">{addErrors.name}</p>}
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
                <h2 id="gp-add-title">Confirmar nueva obra social</h2>
                <p id="gp-add-desc">Revisá que los datos sean correctos.</p>
                <ul className="gp-summary">
                  <li><strong>name:</strong> {addForm.name}</li>
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
                <h2 id="gp-edit-title">Editar Obra social</h2>
                <p id="gp-edit-desc" className="gp-help">Actualizá los datos necesarios.</p>
                <form onSubmit={handleEditContinue} noValidate>
                  <div className="gp-field">
                    <label htmlFor="edit-firstName">name</label>
                    <input
                      id="edit-firstName"
                      type="text"
                      value={editForm.name ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!editErrors.name}
                      aria-describedby={editErrors.name ? "edit-firstName-err" : undefined}
                    />
                    {editErrors.firstName && <p className="gp-error" id="edit-firstName-err">{editErrors.name}</p>}
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
                  <li><strong>name:</strong> {editForm.name}</li>
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
            <h2 id="gp-del-title">Eliminar Obra social</h2>
            <p id="gp-del-desc">
              ¿Estás seguro de eliminar a <strong>{deleteTarget.name}</strong>?
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

