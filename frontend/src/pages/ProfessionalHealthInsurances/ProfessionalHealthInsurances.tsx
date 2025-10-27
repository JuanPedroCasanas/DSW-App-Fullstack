import React, { useState, useEffect, useMemo } from 'react';
import './ProfessionalHealthInsurance.css';
import HealthInsurances from '../admin/HealthInsurances/HealthInsurances';
import  {HealthInsurance, Professional} from "./ProfessionalHealthInsurancesTypes"
import { Toast } from "@/components/Toast";

const validateHealthInsurance = (p: Partial<HealthInsurance>) => {
  const errors: Record<string, string> = {};
  if (!p.name?.trim()) errors.nombre = "Nombre obligatorio.";
  return errors;
};

const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

 // export default function HealthInsuranceProfessional() {

async function handleProfessionalControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Nombre: ${resJson.professional?.firstName}${resJson.professional?.lastName} `;
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

async function handleHealthInsuranceControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.healthInsurance?.id}, Nombre: ${resJson.healthInsurance.name} `;
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
  const [selectedProfessionalHealthInsurances, setSelectedProfessionalHealthInsurances] = useState<HealthInsurance[] | null>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [selectedHealthInsuranceId, setSelectedHealthInsuranceId]=useState <number | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional]=useState <Professional | null>(null);

  // ---------- Agregar (2 pasos + dirty-check) ----------
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<"form" | "confirm">("form");


  const [addForm, setAddForm] = useState<Partial<HealthInsurance>>({
    name: ""
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [addSnapshot, setAddSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  
  //Fetch profesionales + sus obras sociales
  useEffect(() => {
    (async () => {
      const res = await fetch ("http://localhost:2000/Professional/getAllWithHealthInsurances?includeInactive=false");
    if (!res.ok){
      const toastData = await handleProfessionalControllerResponse(res);
      setToast(toastData);
    }else{
      const data: Professional[]=await res.json();
      setProfessionals(data);
      if(selectedProfessional===null){
        setSelectedProfessional(data[0]);
      }
    }
  })()
    },[]);

  //Setear obras sociales del profesional
  useEffect(() => {
    if(selectedProfessional)
    setSelectedProfessionalHealthInsurances(selectedProfessional?.healthInsurances ?? []);
  }, [selectedProfessional]);


  //Fetch obras sociales
  useEffect(() => {
      if(!selectedProfessional) return;
      (async () => {
        const res = await fetch (`http://localhost:2000/HealthInsurance/getAll?includeInactive=false`);
        if (!res.ok){
          const toastData = await handleHealthInsuranceControllerResponse(res);
          setToast(toastData);
        } else {
          const data: HealthInsurance[] = await res.json();
          //Filtrar por las cuales NO estan en el arreglo de OSs admitidas por el profesional cosa de solo dejarle agregar nuevas.
          const filteredHealthInsurances = data.filter(
            hI => !selectedProfessional.healthInsurances.some(
              profHealthInsurance => profHealthInsurance.id === hI.id 
            )
          );
          setHealthInsurances(filteredHealthInsurances);
        }
      })()
    },[selectedProfessional]);   
  
  //Setear primer valor
  useEffect(() => {
  if (healthInsurances.length > 0) {
    setSelectedHealthInsuranceId(healthInsurances[0].id);
  } else {
    setSelectedHealthInsuranceId(null);
  }
}, [healthInsurances]);

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
    setAddStep("confirm");
  };

  const handleAddConfirm = async () => {

    if(!selectedHealthInsuranceId || !selectedProfessional) {
      return;
    }


    const payload = {
      idProfessional: selectedProfessional.id,
      idHealthInsurance: selectedHealthInsuranceId,
    }
    
    const res = await fetch('http://localhost:2000/Professional/allowHealthInsurance', {
     method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( payload ),
      });
    
    if(res.ok) {
      const resGet = await fetch(`http://localhost:2000/Professional/getAllWithHealthInsurances?includeInactive=false`);
      const data: Professional[] = await resGet.json();
      setProfessionals(data); 
      if (selectedProfessional) {
        const updated = data.find(p => p.id === selectedProfessional.id);
        if(updated) {
          setSelectedProfessionalHealthInsurances([...updated.healthInsurances]);
        } else {
          setSelectedProfessionalHealthInsurances([]);
        }
      }
    }
    closeAdd()
    const toastData = await handleProfessionalControllerResponse(res);
    setToast(toastData);
  };
 
// ---------- Editar (2 pasos + dirty-check) ----------
  const [editTarget, setEditTarget] = useState<HealthInsurance | null>(null);
  const [editStep, setEditStep] = useState<"form" | "confirm">("form");
  const [editForm, setEditForm] = useState<Partial<HealthInsurance>>({});
  const [editSnapshot, setEditSnapshot] = useState<Partial<HealthInsurance> | null>(null);
  const editErrors = useMemo(() => validateHealthInsurance(editForm), [editForm]);
  

  // ---------- Eliminar (confirmación simple) ----------
  const [deleteTarget, setDeleteTarget] = useState<HealthInsurance | null>(null);
  const openDelete = (o: HealthInsurance) => setDeleteTarget(o);
  const closeDelete = () => setDeleteTarget(null);
  
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !selectedProfessional) return;

    const payload = {
      idProfessional: selectedProfessional.id,
      idHealthInsurance: deleteTarget.id,
    }

    const res = await fetch(`http://localhost:2000/Professional/forbidHealthInsurance`,
      {method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( payload ),
  });
  if (res.ok) {
      const resGet = await fetch(`http://localhost:2000/Professional/getAllWithHealthInsurances?includeInactive=false`);
      const data: Professional[] = await resGet.json();
      setProfessionals(data); 
      if (selectedProfessional) {
        const updated = data.find(p => p.id === selectedProfessional.id);
        setSelectedProfessional(updated ?? null);
      }
    }
      closeDelete();
      setDeleteTarget(null);
      const toastData= await handleProfessionalControllerResponse(res);
      setToast(toastData);
  };
  
 // ---------- Modal genérico: DESCARTAR cambios ----------
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });
  const confirmDiscard = () => {
    if (discardCtx.context === "add") closeAdd();
    setDiscardCtx({ open: false });
  };

  // ---------- ESC para cerrar (respeta dirty-check) ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (discardCtx.open) return closeDiscard();
      if (showAdd) return tryCloseAdd();
      if (deleteTarget) return closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAdd, editTarget, deleteTarget, discardCtx.open, addForm, editForm, addSnapshot, editSnapshot]);


 return (
  <section className="gp-container">
     <h1 className="gp-title">Obras sociales admitidas </h1>

      <div className="gp-guardian-select">
        <label htmlFor="guardian" className="sr-only">Profesionales</label>
        <select
          value={selectedProfessional?.id ?? ''}
          onChange={(e) => {
                    const professional = professionals.find((p) => p.id === Number(e.target.value));
                    setSelectedProfessional(professional || null);
                  }
          }
        >
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
            Id: {p.id}, {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
       </div>
       {(selectedProfessional?.healthInsurances?.length === 0) && (
        <div className="gp-empty-state" role="status" aria-live="polite">
          {/* Icono simple inline */}
          <svg className="gp-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"/>
          </svg>
          <h2>No posee obras sociales</h2>
          <p>Agregá tu primer obra social con la que trabajes para comenzar.</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd}>
            Agregar obra social
          </button>
        </div>
      )}
         {(selectedProfessionalHealthInsurances?.length !== 0) && (
        <>
          <div className="gp-table-wrap">
            <table className="gp-table">
              <thead>
                <tr>
                  <th>Id OS</th>
                  <th>Nombre OS</th>
                  <th className="gp-col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {selectedProfessionalHealthInsurances?.map((pHI) => (
                  <tr key={pHI.id}>
                    <td data-label="Id">{pHI.id}</td>
                    <td data-label="Nombre">{pHI.name}</td>
                    <td className="gp-actions">
                      <button
                        type="button"
                        className="ui-btn ui-btn--danger ui-btn--sm"
                        onClick={() => openDelete(pHI)}
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
                <form onSubmit={handleAddContinue} noValidate>
                  <div className="gp-field">
                    <label htmlFor="name">Obras Sociales</label>
                    <select
                      value={selectedHealthInsuranceId ?? healthInsurances[0].id ?? ""}
                      onChange={e => setSelectedHealthInsuranceId(Number(e.target.value))}
                      aria-label="healthInsurances"
                      title="healthInsurances"
                    >
                      {healthInsurances.map(hI => (
                        <option key={hI.id} value={hI.id}>
                          {`Id ${hI.id} - ${hI.name}`}
                        </option>
                      ))}
                    </select>
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
                  <li><strong>Id </strong>{selectedHealthInsuranceId}</li>
                  <li><strong>Nombre </strong>{healthInsurances.find(hI => hI.id === selectedHealthInsuranceId)?.name}</li>
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

