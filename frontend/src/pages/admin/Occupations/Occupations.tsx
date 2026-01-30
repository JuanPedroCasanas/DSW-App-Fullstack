import React, { useEffect, useMemo, useState } from "react";

import { Toast, EmptyState, Modal, Table, SummaryList, DialogActions, PrimaryButton, FormField, Card } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import type { Occupation } from '@/common/types';
import { HandleOccupationControllerResponse } from '@/common/utils/';
import { authFetch } from "@/common/utils/auth/AuthFetch";

import { API_BASE } from '@/lib/api';


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
 
       const res = await authFetch(`${API_BASE}/occupation/getAll`);

      // if (!res.ok) throw new Error("Error al cargar obras sociales"); deberia ir al error del backend
      if (!res.ok){
        const toastData = await HandleOccupationControllerResponse(res);
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
    const res = await authFetch(`${API_BASE}/occupation/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: (addForm.name ?? "").trim() }),
    });

    const toastData = await HandleOccupationControllerResponse(res);
    setToast(toastData);
  
    // Recargar
    const resGet = await authFetch(`${API_BASE}/occupation/getAll`);
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
          idOccupation: editTarget.id, 
          name: (editForm.name ?? "").trim() 
        };

      const res = await authFetch(`${API_BASE}/occupation/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // Refrescamos localmente
      setItems((prev) =>
        prev.map((o) => (o.id === editTarget.id ? { ...o, name: payload.name } : o))
      ); 

      const toastData = await HandleOccupationControllerResponse(res);
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
        
        const res = await authFetch(
          `${API_BASE}/occupation/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await authFetch(`${API_BASE}/occupation/getAll`);
        const data: Occupation[] = await resGet.json();
        setItems(data);

        const toastData = await HandleOccupationControllerResponse(res);
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
  <Page>
    <SectionHeader title="Especialidades" />

    {/* Estado vacío */}
    {!hasItems && (
      <EmptyState
        title="No hay especialidades"
        description="Agregá la primera especialidad para comenzar."
        icon={
          <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 0 1 0-8h1V7a5 5 0 0 1 5-5Z"
            />
          </svg>
        }
        action={<PrimaryButton onClick={openAdd}>Agregar especialidad</PrimaryButton>}
      />
    )}

    {/* Tabla */}
    {hasItems && (
      <>
        <Card>
          <Table headers={["ID", "Nombre", "Acciones"]}>
            {items.map((o) => (
              <tr key={o.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-3">{o.id}</td>
                <td className="px-4 py-3">{o.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <PrimaryButton variant="outline" size="sm" onClick={() => openEdit(o)}>
                      Editar
                    </PrimaryButton>
                    <PrimaryButton variant="danger" size="sm" onClick={() => openDelete(o)}>
                      Eliminar
                    </PrimaryButton>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <div className="grid place-items-center mt-4">
          <PrimaryButton onClick={openAdd}>Agregar especialidad</PrimaryButton>
        </div>
      </>
    )}

    {/* Modal: Agregar */}
    {showAdd && (
      <Modal
        title={addStep === "form" ? "Agregar especialidad" : "Confirmar nueva especialidad"}
        onClose={tryCloseAdd}
      >
        {addStep === "form" ? (
          <form onSubmit={handleAddContinue} className="space-y-4" noValidate>
            <FormField label="Nombre" htmlFor="add-nombre">
              <input
                id="add-nombre"
                name="name"
                type="text"
                value={addForm.name ?? ""}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
              {addErrors.name && <p className="text-red-600 text-sm mt-1">{addErrors.name}</p>}
            </FormField>

            {/* Botones del diálogo */}
            <DialogActions>
              <PrimaryButton variant="outline" onClick={tryCloseAdd}>
                Cancelar
              </PrimaryButton>
              <PrimaryButton type="submit">Continuar</PrimaryButton>
            </DialogActions>
          </form>
        ) : (
          <>
            <SummaryList items={[{ label: "Nombre", value: addForm.name ?? "" }]} />

            {/* Botones del diálogo */}
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

    {/* Modal: Editar */}
    {editTarget && (
      <Modal title={editStep === "form" ? "Editar especialidad" : "Confirmar cambios"} onClose={tryCloseEdit}>
        {editStep === "form" ? (
          <form onSubmit={handleEditContinue} className="space-y-4" noValidate>
            <FormField label="Nombre" htmlFor="edit-nombre">
              <input
                id="edit-nombre"
                name="name"
                type="text"
                value={editForm.name ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
              {editErrors.name && <p className="text-red-600 text-sm mt-1">{editErrors.name}</p>}
            </FormField>

            {/* Botones del diálogo */}
            <DialogActions>
              <PrimaryButton variant="outline" onClick={tryCloseEdit}>
                Cancelar
              </PrimaryButton>
              <PrimaryButton type="submit">Continuar</PrimaryButton>
            </DialogActions>
          </form>
        ) : (
          <>
            <SummaryList
              items={[
                { label: "ID", value: String(editTarget.id) },
                { label: "Nombre", value: editForm.name ?? "" },
              ]}
            />

            {/* Botones del diálogo */}
            <DialogActions>
              <PrimaryButton variant="outline" onClick={() => setEditStep("form")}>
                Volver
              </PrimaryButton>
              <PrimaryButton onClick={handleEditConfirm}>Confirmar</PrimaryButton>
            </DialogActions>
          </>
        )}
      </Modal>
    )}

    {/* Modal: Eliminar */}
    {deleteTarget && (
      <Modal title="Eliminar especialidad" onClose={closeDelete}>
        <p className="text-[#213547] mb-2">
          ¿Estás segura/o de eliminar <strong>{deleteTarget.name}</strong>?
        </p>

        {/* Botones del diálogo */}
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

    {/* Modal: Descartar cambios */}
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