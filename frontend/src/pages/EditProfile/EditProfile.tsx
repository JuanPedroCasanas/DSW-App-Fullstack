import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // si no usás Router, ver nota más abajo

import { Toast, ActionGrid, PrimaryButton, FormField, Card, InputPassword } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

import {
  HandleErrorResponse,
  HandleProfessionalControllerResponse,
  HandlePatientControllerResponse,
  HandleLegalGuardianControllerResponse,
  HandleUserControllerResponse
} from '@/common/utils';

import { User } from "../LoginRegister/loginRegisterTypes"; // este deberia estar en el import de abajo de @/common/types
import { HealthInsurance } from "@/common/types";


export default function EditProfile() {

  // ----- Usuario seleccionado -----
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // ----- Estado: credenciales -----

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

  // ----- Estado: perfil -----
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [telephone, setTelephone] = useState("");

  //Especialidad
  const [occupationName, setOccupationName] = useState("");
  //OS
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
  const [selectedHealthInsuranceId, setSelectedHealthInsuranceId] = useState<number | null>(null);

  //Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  //Usuarios
  const[users, setUsers] = useState<User[]>([]);

  //Popular OSs
  useEffect(() => {
    (async () => {
  
        const res = await fetch("http://localhost:2000/HealthInsurance/getAll?includeInactive=false");
  
        if (!res.ok){
          const toastData = await HandleErrorResponse(res);
          setToast(toastData);
        } else {
          const data: HealthInsurance[] = await res.json();
          setHealthInsurances(data);
  
        }
  
    })();
  }, []);

  //Popular Usuarios (En AD Se sacaran estos datos del user logueado)
  useEffect(() => {
    (async () => {
        const res = await fetch("http://localhost:2000/User/getAll?includeInactive=false");
  
        if (!res.ok){
          const toastData = await HandleErrorResponse(res);
          setToast(toastData);
        } else {
          const data: User[] = await res.json();
          setUsers(data);
        }
    })();
  }, []);


  //Autocompletar campos a partir del selected user
  useEffect(() => {
    if (!selectedUser) {
      setFirstName("");
      setLastName("");
      setTelephone("");
      setSelectedHealthInsuranceId(null);
      return;
    }

    // Prioridad: patient > legalGuardian > professional
    if (selectedUser.patient) {
      setFirstName(selectedUser.patient.firstName);
      setLastName(selectedUser.patient.lastName);
      setTelephone(selectedUser.patient.telephone);
      setBirthdate(selectedUser.patient.birthdate?.split("T")[0] || "");
      setSelectedHealthInsuranceId(selectedUser.patient.healthInsurance);
    } else if (selectedUser.legalGuardian) {
      setFirstName(selectedUser.legalGuardian.firstName);
      setLastName(selectedUser.legalGuardian.lastName);
      setTelephone(selectedUser.legalGuardian.telephone);
      setBirthdate(selectedUser.legalGuardian.birthdate.split("T")[0] || "");
      setSelectedHealthInsuranceId(selectedUser.legalGuardian.healthInsurance);
    } else if (selectedUser.professional) {
      setFirstName(selectedUser.professional.firstName);
      setLastName(selectedUser.professional.lastName);
      setTelephone(selectedUser.professional.telephone || "");
      setOccupationName(selectedUser.professional.occupation?.name || "");
      // Para profesionales no aplicaría healthInsurance
      setSelectedHealthInsuranceId(null);
    }
  }, [selectedUser]);


  // ----- Envíos simulados -----
  const handleSubmitAuth = async (currentPwd: string, newPwd: string, confirmPwd: string) => {
    if (newPwd !== confirmPwd) {
      setToast({ message: "Las contraseñas no coinciden", type: "error" });
      return;
    }
    if(!selectedUser) {
      return;
    }
    const payload = {
          idUser: selectedUser.id,
          oldPassword: currentPassword,
          newPassword: confirmPwd,
    }

    const res = await fetch(`http://localhost:2000/User/updatePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let toastData = await HandleUserControllerResponse(res);

    if(toastData) {
      setToast(toastData);
    }

    closeSubmitAuth()
  };

  const closeSubmitAuth = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePasswordModal(false);
  }


  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedUser) return;
    //Payload general para todas las clases
    let payload = {
          firstName: (firstName ?? "").trim(),
          lastName: (lastName ?? "").trim(),
          telephone: (telephone ?? "").trim(),
          idHealthInsurance: null as number | null,
          birthdate: "",
          idProfessional: undefined as number | undefined,
          idPatient: undefined as number | undefined,
          idLegalGuardian: undefined as number | undefined,
        };

    //Payloads y rutas especificas

    let route: string = "";

    if(selectedUser.patient) {
      payload.birthdate = (birthdate ?? "").trim();
      payload.idPatient = selectedUser.patient.id;
      payload.idHealthInsurance = selectedHealthInsuranceId;
      route = "/Patient/updateIndPatient";
    }

    if(selectedUser.legalGuardian) {
      payload.birthdate = (birthdate ?? "").trim();
      payload.idLegalGuardian = selectedUser.legalGuardian.id;
      payload.idHealthInsurance = selectedHealthInsuranceId;
      route = "/LegalGuardian/update";
    }

    if(selectedUser.professional) {
      payload.idProfessional = selectedUser.professional.id;
      route = "/Professional/update";
    }

    if(!route) {
      return
    }
    const res = await fetch(`http://localhost:2000${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let toastData;

    if(selectedUser.patient) {
      toastData = await HandlePatientControllerResponse(res);
    }

    if(selectedUser.legalGuardian) {
      toastData = await HandleLegalGuardianControllerResponse(res);
    }

    if(selectedUser.professional) {
      toastData = await HandleProfessionalControllerResponse(res);
    }
    if(toastData) {
      setToast(toastData);
    }
  };

  // ----- Cancelar edición -----
  const navigate = useNavigate();
  const handleCancel = () => {
    // Volver a la pantalla anterior; si no hay historial, ir a la home
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
    // Si NO usás react-router, reemplazá lo de arriba por: window.history.back();
  };

  // ----- Modal "Borrar perfil" -----
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const openConfirmDelete = () => setShowConfirmDelete(true);
  const closeConfirmDelete = () => setShowConfirmDelete(false);

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    if(!selectedUser) return;
    //Payload general para todas las clases

    //Id y rutas especificas
    let id: number | undefined = undefined as number | undefined;
    let route: string = "";
    
    if(selectedUser.patient) {
      id = selectedUser.patient.id;
      route = "/Patient/delete";
    }

    if(selectedUser.legalGuardian) {
      id = selectedUser.legalGuardian.id;
      route = "/LegalGuardian/delete";
    }

    if(selectedUser.professional) {
      id = selectedUser.professional.id;
      route = "/Professional/delete";
    }

    if(!route) {
      return
    }
    const res = await fetch(`http://localhost:2000${route}/${id}`, {
      method: "DELETE"
    });

    let toastData;

    if(selectedUser.patient) {
      toastData = await HandlePatientControllerResponse(res);
    }

    if(selectedUser.legalGuardian) {
      toastData = await HandleLegalGuardianControllerResponse(res);
    }

    if(selectedUser.professional) {
      toastData = await HandleProfessionalControllerResponse(res);
    }
    if(toastData) {
      setToast(toastData);
    }
  };

  // Cerrar modal con ESC
  useEffect(() => {
    if (!showConfirmDelete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowConfirmDelete(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirmDelete]);

  useEffect(() => {
    if (!showChangePasswordModal) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowChangePasswordModal(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showChangePasswordModal]);

  return (

    <Page>
        <main className="grid min-h-screen">
            <section className="max-w-3xl mx-auto p-4 sm:p-6">
            <SectionHeader title="Seleccionar usuario" />
            <FormField label="Usuario" htmlFor="user">
                <select
                id="user"
                className="border rounded-lg p-3 w-full text-gray-700 focus:ring-2 focus:ring-cyan-500"
                value={selectedUser?.id ?? ""}
                onChange={(e) => {
                    const user = users.find((u) => u.id === Number(e.target.value));
                    setSelectedUser(user ?? null);
                }}
                >
                <option value="">Seleccionar…</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.id} - {user.mail} — {user.role}
                    </option>
                ))}
                </select>
            </FormField>
            </section>

            {selectedUser && (
            <section className="space-y-6">
                {/* === Email + Cambiar contraseña === */}
                <Card>
                <FormField label="Email" htmlFor="email">
                    <div className="flex flex-wrap gap-3">
                    <input
                        id="email"
                        type="email"
                        value={selectedUser.mail}
                        readOnly
                        className="border rounded-lg p-3 w-full sm:flex-1 bg-gray-100"
                    />
                    {!showChangePasswordModal && (      
                        <PrimaryButton
                        onClick={() => setShowChangePasswordModal(true)}
                        size="sm"
                        variant="solid"
                        >
                        Cambiar contraseña
                        </PrimaryButton>
                    )}
                    </div>
                </FormField>
                </Card>

                {/* === Formulario perfil === */}
                <form className="space-y-4" onSubmit={handleSubmitProfile} noValidate>
                <Card>
                    <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold mb-4">Datos del perfil</legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Nombre" htmlFor="nombre">
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border rounded-lg p-3 w-full"
                            />
                        </FormField>
                        <FormField label="Apellido" htmlFor="apellido">
                        <input
                            id="apellido"
                            type="text"
                            placeholder="Apellido"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border rounded-lg p-3 w-full"
                        />
                        </FormField>
                    </div>

                    <FormField label="Teléfono" htmlFor="telefono">
                        <input
                        id="telefono"
                        type="tel"
                        placeholder="+54 9 11 1234-5678"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="border rounded-lg p-3 w-full"
                        />
                    </FormField>

                    {(selectedUser.legalGuardian || selectedUser.patient) && (
                        <>
                        <FormField label="Obra Social" htmlFor="healthInsurance">
                            <select
                            id="healthInsurance"
                            value={selectedHealthInsuranceId ?? ""}
                            onChange={(e) => setSelectedHealthInsuranceId(Number(e.target.value))}
                            className="border rounded-lg p-3 w-full"
                            >
                            <option value="">Seleccionar…</option>
                            {healthInsurances.map((h) => (
                                <option key={h.id} value={h.id}>
                                {h.name}
                                </option>
                            ))}
                            </select>
                        </FormField>

                        <FormField label="Fecha de nacimiento" htmlFor="add-fecha">
                            <input
                            id="add-fecha"
                            type="date"
                            value={birthdate ?? ""}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="border rounded-lg p-3 w-full"
                            />
                        </FormField>
                        </>
                    )}

                    {selectedUser.professional && (
                        <FormField label="Especialidad" htmlFor="occupation">
                        <select id="occupation" disabled value={occupationName} className="border rounded-lg p-3 w-full">
                            <option>{occupationName || "Sin especialidad"}</option>
                        </select>
                        </FormField>
                    )}

                    <div className="flex justify-center">
                        
                    
                    <ActionGrid>
                        <PrimaryButton type="submit">Guardar perfil</PrimaryButton>
                    </ActionGrid>

                    </div>

                    </fieldset>
                </Card>
                </form>

                {/* === Footer acciones === */}

                    <div className="flex justify-end gap-3 mt-6">
                        <PrimaryButton onClick={handleCancel} size="sm">
                            Cancelar
                        </PrimaryButton>
                        <PrimaryButton onClick={openConfirmDelete} size="sm" variant="danger">
                            Borrar perfil
                        </PrimaryButton>
                    </div>
            </section>
            )}

            {/* === Modal cambiar contraseña === */}
            
            {showChangePasswordModal && (
            <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                role="presentation"
                onClick={() => setShowChangePasswordModal(false)}
            >
                <div
                    className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="change-pass-title"
                    onClick={(e) => e.stopPropagation()}
                >
                <h2 id="change-pass-title" className="text-lg font-semibold mb-4">
                    Cambiar contraseña
                </h2>

                {/* Campos de contraseña */}
                <div className="space-y-4">
                    <InputPassword
                        label="Contraseña Actual"
                        id="currentPassword"
                        name="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        showPwd={showCurrentPassword}
                        toggleShowPwd={() => setShowCurrentPassword(!showCurrentPassword)}
                        eyeIconUrl="/icons/eyeicon.png"
                    />
                    <InputPassword
                        label="Nueva contraseña"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        showPwd={showNewPassword}
                        toggleShowPwd={() => setShowNewPassword(!showNewPassword)}
                        eyeIconUrl="/icons/eyeicon.png"
                    />
                    <InputPassword
                        label="Repetir nueva contraseña"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        showPwd={showNewConfirmPassword}
                        toggleShowPwd={() => setShowNewConfirmPassword(!showNewConfirmPassword)}
                        eyeIconUrl="/icons/eyeicon.png"
                    />
                </div>

                {/* Botones del modal */}
                    <div className="flex justify-end gap-3 mt-6">
                        <PrimaryButton
                            onClick={() => handleSubmitAuth(currentPassword, newPassword, confirmPassword)}
                            size="sm"
                            variant="solid"
                        >
                        Guardar
                        </PrimaryButton>

                        <PrimaryButton onClick={closeSubmitAuth} size="sm" variant="outline">
                            Cancelar
                        </PrimaryButton>
                    </div>


                </div>
            </div>
            )}

        </main>

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