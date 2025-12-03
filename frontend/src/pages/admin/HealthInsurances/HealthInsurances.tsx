import React, { useEffect, useMemo, useState } from "react";

import { HealthInsurance } from "./healthInsurancesTypes";

import { Toast, EmptyState, Modal, Table, SummaryList, ActionGrid, PrimaryButton, FormField, Card } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

//Genera un toast para las respuestas del backend
async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.healthInsurance?.id}, Nombre: ${resJson.healthInsurance?.name}`;
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

      const res = await fetch("http://localhost:2000/HealthInsurance/getAll");

      if (!res.ok){
        const toastData = await handleResponse(res);
        setToast(toastData);
      } else {
        const data: HealthInsurance[] = await res.json();
        setItems(data);

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
        console.log("addForm.name=", addForm.name);
        const res = await fetch("http://localhost:2000/HealthInsurance/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: (addForm.name ?? "").trim() }),
        });

        const toastData = await handleResponse(res);
        setToast(toastData);
      
        // Recargar
        const resGet = await fetch("http://localhost:2000/HealthInsurance/getAll");
        const data: HealthInsurance[] = await resGet.json();
        setItems(data);

       setShowAdd(false);
        

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
          idHealthInsurance: editTarget.id, 
          name: (editForm.name ?? "").trim() };

      const res = await fetch("http://localhost:2000/HealthInsurance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // Refrescamos localmente
      setItems((prev) =>
        prev.map((h) => (h.id === editTarget.id ? { ...h, name: payload.name } : h))
      ); 

      const toastData = await handleResponse(res);
      setToast(toastData);

      closeEdit();
      
  })();
};

  /* ---- Eliminar (confirmación simple) ---- */
  const [deleteTarget, setDeleteTarget] = useState<HealthInsurance | null>(null);
  const openDelete = (h: HealthInsurance) => setDeleteTarget(h);
  const closeDelete = () => setDeleteTarget(null);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    (async () => {
        // http://localhost:2000/ConsultingRoom/delete/${deleteTarget.idConsultingRoom}`
        const res = await fetch(
          `http://localhost:2000/HealthInsurance/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await fetch("http://localhost:2000/HealthInsurance/getAll");
        const data: HealthInsurance[] = await resGet.json();
        setItems(data);

        const toastData = await handleResponse(res);
        setToast(toastData);

      setDeleteTarget(null);

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
    <Page>
      <SectionHeader title="Obras sociales" />

      {/* Estado vacío */}
      {!hasItems && (
        <EmptyState
          title="No hay obras sociales"
          description="Agregá la primera obra social para comenzar."
          icon={
            <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a5 5 0 0 1 5 5v1h1a4 4 0 0 1 0 8h-1v1a5 5 0 0 1-10 0v-1H6a4 4 0 0 1 0-8h1V7a5 5 0 0 1 5-5Z"
              />
            </svg>
          }
          action={<PrimaryButton onClick={openAdd}>Agregar obra social</PrimaryButton>}
        />
      )}

      {/* Tabla */}
      {hasItems && (
        <>
          <Card>
            <Table headers={["ID", "Nombre", "Activo", "Acciones"]}>
              {items.map((h) => (
                <tr key={h.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="px-4 py-3">{h.id}</td>
                  <td className="px-4 py-3">{h.name}</td>
                  <td className="px-4 py-3">{h.isActive ? "Sí" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <PrimaryButton variant="outline" size="sm" onClick={() => openEdit(h)}>
                        Editar
                      </PrimaryButton>
                      <PrimaryButton variant="danger" size="sm" onClick={() => openDelete(h)}>
                        Eliminar
                      </PrimaryButton>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>

          <div className="grid place-items-center mt-4">
            <PrimaryButton onClick={openAdd}>Agregar obra social</PrimaryButton>
          </div>
        </>
      )}

      {/* Modal: Agregar (2 pasos) */}
      {showAdd && (
        <Modal
          title={addStep === "form" ? "Agregar obra social" : "Confirmar nueva obra social"}
          onClose={tryCloseAdd}
        >
          {addStep === "form" ? (
            <form onSubmit={handleAddContinue} className="space-y-4">
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

              <ActionGrid>
                <PrimaryButton variant="outline" onClick={tryCloseAdd}>
                  Cancelar
                </PrimaryButton>
                <PrimaryButton type="submit">Continuar</PrimaryButton>
              </ActionGrid>
            </form>
          ) : (
            <>
              <SummaryList items={[{ label: "Nombre", value: addForm.name ?? "" }]} />
              <ActionGrid>
                <PrimaryButton variant="outline" onClick={() => setAddStep("form")}>
                  Volver
                </PrimaryButton>
                <PrimaryButton onClick={handleAddConfirm}>Confirmar</PrimaryButton>
              </ActionGrid>
            </>
          )}
        </Modal>
      )}

      {/* Modal: Editar (2 pasos) */}
      {editTarget && (
        <Modal
          title={editStep === "form" ? "Editar obra social" : "Confirmar cambios"}
          onClose={tryCloseEdit}
        >
          {editStep === "form" ? (
            <form onSubmit={handleEditContinue} className="space-y-4">
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

              <ActionGrid>
                <PrimaryButton variant="outline" onClick={tryCloseEdit}>
                  Cancelar
                </PrimaryButton>
                <PrimaryButton type="submit">Continuar</PrimaryButton>
              </ActionGrid>
            </form>
          ) : (
            <>
              <SummaryList
                items={[
                  { label: "ID", value: String(editTarget.id) },
                  { label: "Nombre", value: editForm.name ?? "" },
                ]}
              />
              <ActionGrid>
                <PrimaryButton variant="outline" onClick={() => setEditStep("form")}>
                  Volver
                </PrimaryButton>
                <PrimaryButton onClick={handleEditConfirm}>Confirmar</PrimaryButton>
              </ActionGrid>
            </>
          )}
        </Modal>
      )}

      {/* Modal: Eliminar */}
      {deleteTarget && (
        <Modal title="Eliminar obra social" onClose={closeDelete}>
          <p className="text-[#213547] mb-2">
            ¿Estás segura/o de eliminar <strong>{deleteTarget.name}</strong>?
          </p>
          <ActionGrid>
            <PrimaryButton variant="outline" onClick={closeDelete}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={handleDeleteConfirm}>
              Eliminar
            </PrimaryButton>
          </ActionGrid>
        </Modal>
      )}

      {/* Modal: Descartar */}
      {discardCtx.open && (
        <Modal title="Descartar cambios" onClose={closeDiscard}>
          <p className="text-[#213547] mb-2">Tenés cambios sin guardar. ¿Cerrar de todos modos?</p>
          <ActionGrid>
            <PrimaryButton variant="outline" onClick={closeDiscard}>
              Seguir editando
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={confirmDiscard}>
              Descartar
            </PrimaryButton>
          </ActionGrid>
        </Modal>
      )}

      {/* Toast (una sola vez) */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </Page>
  );


}