import React, { useEffect, useState } from "react";
import { Professional } from "@/common/types";

import { Toast, EmptyState, Modal, Table, DialogActions, PrimaryButton, Card } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import { HandleProfessionalControllerResponse } from "@/common/utils";


/* ---- Utils ---- */

export default function Professionals() {
  /** Estado principal: por defecto con algunos ejemplos */
  const [list, setList] = useState<Professional[]>([]);

  /*Pantallita de error o exito al terminar una accion*/
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // para ver todos los profesionales
   useEffect(() => {
   (async () => {
 
       const res = await fetch("http://localhost:2000/Professional/getAll");

      if (!res.ok){
        const toastData = await HandleProfessionalControllerResponse(res);
        setToast(toastData);
      } else {
        const data: Professional[] = await res.json();
        setList(data);
      }

   })()
 }, []); 

  
  /* ---- Eliminar ---- */
  const [deleteTarget, setDeleteTarget] = useState<Professional | null>(null);
  const openDelete = (p: Professional) => setDeleteTarget(p);
  const closeDelete = () => setDeleteTarget(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    (async () => {
        const res = await fetch(
          `http://localhost:2000/Professional/delete/${deleteTarget.id}`, 
          {
            method: "DELETE",
        });

      // Recargar
        const resGet = await fetch("http://localhost:2000/Professional/getAll");
        const data: Professional[] = await resGet.json();
        setList(data); 

        const toastData = await HandleProfessionalControllerResponse(res);
        setToast(toastData);

      setDeleteTarget(null);

    })();
  };


  /* ---- Descartar cambios ---- */
  const [discardCtx, setDiscardCtx] = useState<{ open: boolean; context?: "edit" }>({
    open: false,
  });
  const closeDiscard = () => setDiscardCtx({ open: false });

  
  /* ---- ESC para cerrar ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (discardCtx.open) return closeDiscard();
      if (deleteTarget) return closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ deleteTarget, discardCtx.open]);

  const hasItems = list.length > 0;

  /* ---- Render ---- */
  return (
    <Page>
      <SectionHeader title="Profesionales" />

      {/* Estado vacío */}
      {!hasItems && (
        <EmptyState
          title="Aún no hay profesionales registrados"
          description="Agregá el primer profesional para comenzar."
          icon={
            <svg className="w-12 h-12 text-cyan-600" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m-8.5 8a8.5 8.5 0 0 1 17 0z"
              />
            </svg>
          }
          action={<PrimaryButton onClick={() => {/* opcional: abrir alta futura */}}>Agregar profesional</PrimaryButton>}
        />
      )}


    {/* Tabla */}
    {hasItems && (
      <Card>
        <Table headers={["ID", "Nombre", "Apellido", "Especialidad (ID)", "Teléfono", "Activo", "Acciones"]}>
          {[...list] 
            .sort((a, b) => Number(a.id) - Number(b.id)) // orden ascendente por ID
            .map((p) => (
              <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.firstName}</td>
                <td className="px-4 py-3">{p.lastName}</td>
                <td className="px-4 py-3">{`${p.occupation?.name} (${p.occupation?.id})`}</td>
                <td className="px-4 py-3">{p.telephone ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-1 text-sm rounded-full border bg-emerald-50 text-emerald-800 border-emerald-300">
                      Sí
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 text-sm rounded-full border bg-rose-50 text-rose-800 border-rose-300">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PrimaryButton variant="danger" size="sm" onClick={() => openDelete(p)}>
                    Inhabilitar
                  </PrimaryButton>
                </td>
              </tr>
            ))}
        </Table>
      </Card>
    )}


      {/* Modal: Inhabilitar */}
      {deleteTarget && (
        <Modal title="Inhabilitar profesional" onClose={closeDelete}>
          <p className="text-[#213547] mb-2">
            ¿Estás segura/o de inhabilitar a <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?
          </p>
          <DialogActions>
            <PrimaryButton variant="outline" onClick={closeDelete}>
              Cancelar
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={handleDeleteConfirm}>
              Inhabilitar
            </PrimaryButton>
          </DialogActions>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Page>


  );
}
