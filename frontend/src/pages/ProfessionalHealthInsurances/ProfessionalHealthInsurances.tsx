import React, { useState, useEffect } from 'react';

import { Toast, EmptyState, Table, PrimaryButton, Card, FilterBar, FormField, Modal, DialogActions, SummaryList } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import {
  HandleProfessionalControllerResponse,
  HandleHealthInsuranceControllerResponse,
} from '@/common/utils';

import { HealthInsurance, Professional, UserRole } from '@/common/types';
import { authFetch } from '@/common/utils/auth/AuthFetch';
import { useAuth } from "@/common/utils/auth/AuthContext";
import { API_BASE } from '@/lib/api';

const sameJSON = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function ProfessionalHealthInsurances(){
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.Admin;
  const isProfessional = user?.role === UserRole.Professional;

  const myProfessionalId = (user as any)?.idProfessional ?? (user as any)?.id;

  const [selectedProfessionalHealthInsurances, setSelectedProfessionalHealthInsurances] = useState<HealthInsurance[] | null>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [selectedHealthInsuranceId, setSelectedHealthInsuranceId]=useState <number | undefined>(undefined);
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
  
  
  useEffect(() => {
    (async () => {
      // rol admin
      if (isAdmin) {
        const res = await authFetch(`${API_BASE}/Professional/getAllWithHealthInsurances?includeInactive=false`);
        if (!res.ok) {
          const toastData = await HandleProfessionalControllerResponse(res);
          setToast(toastData);
          return;
        }
        const data: Professional[] = await res.json();
        setProfessionals(data);
       
        setSelectedProfessional((prev) => prev ?? data[0] ?? null);
        return;
      }

      // rol profesional
      if (isProfessional) {
        // trae todos y dsp filtra por id de profesional
        // deberia ver de crearle el metodo en el controlador

        const res = await authFetch(`${API_BASE}/Professional/getAllWithHealthInsurances?includeInactive=false`);
        if (!res.ok) {
          const toastData = await HandleProfessionalControllerResponse(res);
          setToast(toastData);
          return;
        }
        const data: Professional[] = await res.json();
        const me = data.find((p) => p.id === myProfessionalId) ?? null;
        setProfessionals(me ? [me] : []);
        setSelectedProfessional(me);
      }
    })();
  }, [isAdmin, isProfessional, myProfessionalId]);


  useEffect(() => {
    if (selectedProfessional) {
      setSelectedProfessionalHealthInsurances(selectedProfessional.healthInsurances ?? []);
    } else {
      setSelectedProfessionalHealthInsurances([]);
    }
  }, [selectedProfessional]);

  // 3) Traer catálogo de obras sociales y filtrar las que aún NO están asociadas al profesional
  useEffect(() => {
    if (!selectedProfessional) return;
    (async () => {
      const res = await authFetch(`${API_BASE}/HealthInsurance/getAll?includeInactive=false`);
      if (!res.ok) {
        const toastData = await HandleHealthInsuranceControllerResponse(res);
        setToast(toastData);
      } else {
        const data: HealthInsurance[] = await res.json();
        const filteredHealthInsurances = data.filter(
          (hI) => !selectedProfessional.healthInsurances?.some((profHI) => profHI.id === hI.id)
        );
        setHealthInsurances(filteredHealthInsurances);
      }
    })();
  }, [selectedProfessional]);

  // 4) Setear primer opción del select (cuando hay OS disponibles)
  useEffect(() => {
    if (healthInsurances.length > 0) {
      setSelectedHealthInsuranceId(healthInsurances[0].id);
    } else {
      setSelectedHealthInsuranceId(undefined);
    }
  }, [healthInsurances]);


// carga de OS
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

  const handleAddContinue = () => {
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
    
    const res = await authFetch(`${API_BASE}/Professional/allowHealthInsurance`, {
     method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( payload ),
      });
    
    if(res.ok) {
      const resGet = await authFetch(`${API_BASE}/Professional/getAllWithHealthInsurances?includeInactive=false`);
      const data: Professional[] = await resGet.json();
      setProfessionals(isAdmin ? data : data.filter((p) => p.id === selectedProfessional.id)); 

      const updated = data.find((p) => p.id === selectedProfessional.id);
            setSelectedProfessional(updated ?? null);
            setSelectedProfessionalHealthInsurances(updated?.healthInsurances ?? []);

    }
    closeAdd()
    const toastData = await HandleProfessionalControllerResponse(res);
    setToast(toastData);
  };

  // Eliminar
  const [deleteTarget, setDeleteTarget] = useState<HealthInsurance | null>(null);
  const openDelete = (o: HealthInsurance) => setDeleteTarget(o);
  const closeDelete = () => setDeleteTarget(null);
  
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !selectedProfessional) return;

    const payload = {
      idProfessional: selectedProfessional.id,
      idHealthInsurance: deleteTarget.id,
    }

    const res = await authFetch(`${API_BASE}/Professional/forbidHealthInsurance`,
      {method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( payload ),
  });
  if (res.ok) {
      const resGet = await authFetch(`${API_BASE}/Professional/getAllWithHealthInsurances?includeInactive=false`);
      const data: Professional[] = await resGet.json();
      setProfessionals(data); 
      if (selectedProfessional) {
        const updated = data.find(p => p.id === selectedProfessional.id);
        setSelectedProfessional(updated ?? null);
      }
    }
      closeDelete();
      setDeleteTarget(null);
      const toastData= await HandleProfessionalControllerResponse(res);
      setToast(toastData);
  };
  
 // DESCARTAR cambios
    const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "add" | "edit" }>({
      open: false,
    });
    const closeDiscard = () => setDiscardCtx({ open: false });
    const confirmDiscard = () => {
      if (discardCtx.context === "add") closeAdd();
      setDiscardCtx({ open: false });
    };

  // uso del esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (discardCtx.open) return closeDiscard();
      if (showAdd) return tryCloseAdd();
      if (deleteTarget) return closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAdd, deleteTarget, discardCtx.open, addForm,addSnapshot]);


 return (
    <Page>
      <SectionHeader title="Obras sociales admitidas" />

      {/* Selector de profesional para admin. Y para profesional: simplemente NADA!! :D */}
      {isAdmin && (
        <FilterBar>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Profesional" htmlFor="guardian">
              <select
                id="guardian"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={selectedProfessional?.id ?? ""}
                onChange={(e) => {
                  const professional = professionals.find((p) => p.id === Number(e.target.value));
                  setSelectedProfessional(professional ?? null);
                }}
              >
                {[...professionals]
                  .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {`Id: ${p.id}, ${p.firstName} ${p.lastName}`}
                    </option>
                  ))}
              </select>
            </FormField>
          </div>
        </FilterBar>
      )}



      {/* Estado vacío */}
      {!selectedProfessional?.healthInsurances?.length && (
        <EmptyState
          title="No posee obras sociales"
          description="Agregá tu primer obra social con la que trabajes para comenzar."
          icon={
            <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.14-8 4.78V21h16v-2.22C20 16.14 16.42 14 12 14Z"
              />
            </svg>
          }
          action={<PrimaryButton onClick={openAdd}>Agregar obra social</PrimaryButton>}
        />
      )}

      {/* Tabla */}
      {!!selectedProfessionalHealthInsurances?.length && (
        <>
          <Card>
            <Table headers={["Id Obra Social", "Nombre Obra Social", " "]}>
              {selectedProfessionalHealthInsurances.map((pHI) => (
                <tr key={pHI.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="px-4 py-3">{pHI.id}</td>
                  <td className="px-4 py-3">{pHI.name}</td>
                  <td className="px-4 py-3 text-left">
                    <PrimaryButton variant="danger" size="sm" onClick={() => openDelete(pHI)}>
                      Eliminar
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>

          {/* Footer: Agregar */}
          <div className="mt-4 flex justify-right">
            <PrimaryButton onClick={openAdd}>Agregar obra social</PrimaryButton>
          </div>
        </>
      )}

      {/* para cuando no hay OS disponibles*/}
      {showAdd && healthInsurances.length === 0 && (
        <Modal title="No hay obras sociales disponibles" onClose={tryCloseAdd}>
          <p className="text-[#213547] mb-2">
            Ya se agregaron todas las obras sociales existentes para este profesional.
          </p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={tryCloseAdd}>
              Cerrar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* agregar (si todavia quedan OS) */}
      {showAdd && healthInsurances.length > 0 && (
        <Modal
          title={addStep === "form" ? "Agregar obra social" : "Confirmar nueva obra social"}
          onClose={tryCloseAdd}
        >
          {addStep === "form" ? (
            <>
              <FormField label="Obras Sociales" htmlFor="healthInsurances">
                <select
                  id="healthInsurances"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={selectedHealthInsuranceId ?? healthInsurances?.[0]?.id ?? ""}
                  onChange={(e) => setSelectedHealthInsuranceId(Number(e.target.value))}
                  disabled={!healthInsurances?.length}
                  aria-label="healthInsurances"
                  title="healthInsurances"
                >
                  {healthInsurances.map((hI) => (
                    <option key={hI.id} value={hI.id}>
                      {`Id ${hI.id} - ${hI.name}`}
                    </option>
                  ))}
                </select>
              </FormField>

              <DialogActions>
                <PrimaryButton variant="outline" onClick={tryCloseAdd}>
                  Cancelar
                </PrimaryButton>
                <PrimaryButton onClick={handleAddContinue}>Continuar</PrimaryButton>
              </DialogActions>
            </>
          ) : (
            <>
              <p className="text-[#213547] mb-2">Revisá que los datos sean correctos.</p>

              <SummaryList
                items={[
                  { label: "Id", value: String(selectedHealthInsuranceId ?? "") },
                  {
                    label: "Nombre",
                    value: healthInsurances.find((hI) => hI.id === selectedHealthInsuranceId)?.name ?? "",
                  },
                ]}
              />

              <DialogActions>
                <PrimaryButton variant="outline" onClick={() => setAddStep("form")}>
                  Volver
                </PrimaryButton>
                <PrimaryButton onClick={handleAddConfirm}>Confirmar</PrimaryButton>
              </DialogActions>
            </>
          )}
        </Modal>
      )}

      {/* Eliminar */}
      {deleteTarget && (
        <Modal title="Eliminar obra social" onClose={closeDelete}>
          <p className="text-[#213547] mb-2">
            ¿Estás seguro de eliminar a <strong>{deleteTarget.name}</strong>?
          </p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={closeDelete}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={handleDeleteConfirm}>
              Eliminar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* Descartar cambios */}
      {discardCtx.open && (
        <Modal title="Descartar cambios" onClose={closeDiscard}>
          <p className="text-[#213547] mb-2">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={closeDiscard}>
              Seguir editando
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={confirmDiscard}>
              Descartar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Page>


  );
}

