import React, { useEffect, useMemo, useState } from "react";

import { Toast, EmptyState, Modal, Table, SummaryList, ActionGrid, PrimaryButton, FormField, Card } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import { HandleConsultingRoomControllerResponse } from "@/common/utils";
import { ConsultingRoom } from "@/common/types";

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

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // para ver todos los consultorios
   useEffect(() => {
   (async () => {
 
       const res = await fetch("http://localhost:2000/ConsultingRoom/getAll");

      if (!res.ok){
        const toastData = await HandleConsultingRoomControllerResponse(res);
        setToast(toastData);
      } else {
        const data: ConsultingRoom[] = await res.json();
        setRooms(data);
      }

   })()
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

  const handleAddConfirm = () => {
    (async () => {

        const nuevo = {
          description: (addForm.description ?? "").trim(),
        };

        const res = await fetch("http://localhost:2000/ConsultingRoom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevo),
        });

        const toastData = await HandleConsultingRoomControllerResponse(res);
        setToast(toastData);
      
        // Recargar
        const resGet = await fetch("http://localhost:2000/ConsultingRoom/getAll");
        const data: ConsultingRoom[] = await resGet.json();
        setRooms(data);

       setShowAdd(false);

    })();
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

  const handleEditConfirm = () => {
  if (!editTarget) return;
  (async () => {

      const payload = {
        idConsultingRoom: editTarget.id,
        description: (editForm.description ?? "").trim(),
        isActive: editTarget.isActive,
      };

      const res = await fetch("http://localhost:2000/ConsultingRoom/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      // Refrescamos localmente
      setRooms((prev) =>
        prev.map((c) => (c.id === editTarget.id ? { ...c, description: payload.description } : c))
      ); 

      const toastData = await HandleConsultingRoomControllerResponse(res);
      setToast(toastData);

      closeEdit();
      
  })();
};

  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<ConsultingRoom | null>(null);
  const openDelete = (r: ConsultingRoom) => setDeleteTarget(r);
  const closeDelete = () => setDeleteTarget(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    (async () => {
        // http://localhost:2000/ConsultingRoom/delete/${deleteTarget.idConsultingRoom}`
        const res = await fetch(
          `http://localhost:2000/ConsultingRoom/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await fetch("http://localhost:2000/ConsultingRoom/getAll");
        const data: ConsultingRoom[] = await resGet.json();
        setRooms(data);

        const toastData = await HandleConsultingRoomControllerResponse(res);
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
  <Page>
    <SectionHeader title="Consultorios" />

    {!hasRooms && (
      <EmptyState
        title="No hay consultorios"
        description="Agregá tu primer consultorio para comenzar."
        icon={
          <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2zM6 6v7.5a.5.5 0 0 0 .5.5H19V6z"
            />
          </svg>
        }
        action={<PrimaryButton onClick={openAdd}>Agregar consultorio</PrimaryButton>}
      />
    )}

    {/* estructura de la tabla */}
    {hasRooms && (
      <>
      <Card>
        <Table headers={["ID", "Descripción", "Activo", "Acciones"]}>
          {rooms.map((r) => (
            <tr key={r.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
              <td className="px-4 py-3">{r.id}</td>
              <td className="px-4 py-3">{r.description}</td>
              <td className="px-4 py-3">{r.isActive ? "Sí" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <PrimaryButton
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                    onClick={() => openEdit(r)}
                  >
                    Editar
                  </PrimaryButton>
                  <PrimaryButton
                    variant="danger"
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => openDelete(r)}
                  >
                    Eliminar
                  </PrimaryButton>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>


        <div className="grid place-items-center mt-4">
          <PrimaryButton onClick={openAdd}>Agregar consultorio</PrimaryButton>
        </div>
      </>
    )}

    {/* Modal Agregar */}
    {showAdd && (
      <Modal title={addStep === "form" ? "Agregar consultorio" : "Confirmar nuevo consultorio"} onClose={tryCloseAdd}>
        {addStep === "form" ? (
          <form onSubmit={handleAddContinue} className="space-y-4">
            <FormField label="Descripción" htmlFor="add-descripcion">
              <textarea
                id="add-descripcion"
                value={addForm.description ?? ""}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                className="border rounded-lg p-3 w-full"
              />
              {addErrors.descripcion && <p className="text-red-600 text-sm">{addErrors.descripcion}</p>}
            </FormField>
            <ActionGrid>
              <PrimaryButton variant="outline" onClick={tryCloseAdd}>Cancelar</PrimaryButton>
              <PrimaryButton type="submit">Continuar</PrimaryButton>
            </ActionGrid>
          </form>
        ) : (
          <>
            <SummaryList items={[{ label: "Descripción", value: addForm.description ?? "" }]} />
            <ActionGrid>
              <PrimaryButton variant="outline" onClick={() => setAddStep("form")}>Volver</PrimaryButton>
              <PrimaryButton onClick={handleAddConfirm}>Confirmar</PrimaryButton>
            </ActionGrid>
          </>
        )}
      </Modal>
    )}

    {/* modal editar */}
    {editTarget && (
      <Modal
        title={editStep === "form" ? "Editar consultorio" : "Confirmar cambios"}
        onClose={tryCloseEdit}
      >
        {editStep === "form" ? (
          <form onSubmit={handleEditContinue} className="space-y-4">
            <FormField label="Descripción" htmlFor="edit-descripcion">
              <textarea
                id="edit-descripcion"
                value={editForm.description ?? ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                className="border rounded-lg p-3 w-full"
              />
              {/* ajustar el error? dios sabe */}
              {editErrors.description && (
                <p className="text-red-600 text-sm">{editErrors.description}</p>
              )}
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
                { label: "ID", value: editTarget.id },
                { label: "Descripción", value: editForm.description ?? "" },
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

        
    {deleteTarget && (
      <Modal title="Eliminar consultorio" onClose={closeDelete}>
        <p className="text-[#213547] mb-2">
          ¿Estás segura/o de eliminar el consultorio{" "}
          <strong>{deleteTarget.description}</strong>?
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

    {/* descartar cambios */}
    {discardCtx.open && (
      <Modal title="Descartar cambios" onClose={closeDiscard}>
        <p className="text-[#213547] mb-2">
          Tenés cambios sin guardar. ¿Cerrar de todos modos?
        </p>

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

        {/* ===== TOAST ===== */}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}

  </Page>
  );
}
