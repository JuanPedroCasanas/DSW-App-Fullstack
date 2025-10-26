import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // si no usás Router, ver nota más abajo
import "./editProfile.css";
import { HealthInsurance } from "./editProfileTypes";
import { Toast } from "@/components/Toast";
import { User } from "../LoginRegister/loginRegisterTypes";


async function handleErrorResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));
    if (res.status === 500 || res.status === 400) {
      return { message: resJson.message ?? "Error interno del servidor", type: "error" };
    } else {
      const errorMessage = `Error: ${resJson.error} Codigo: ${resJson.code} ${resJson.message}`
      return { message: errorMessage.trim(), type: "error" };
    }
}

async function handleProfessionalControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.professional?.id}, Apellido y nombre: ${resJson.professional?.lastName} ${resJson.professional?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

async function handleHealthInsuranceControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.healthInsurance?.id}, Nombre: ${resJson.healthInsurance?.name}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

async function handleOccupationControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.occupation?.id}, Nombre: ${resJson.occupation?.name}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

async function handlePatientControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.patient?.id}, Nombre: ${resJson.patient?.lastName} ${resJson.patient?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

async function handleLegalGuardianControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.legalGuardian?.id}, Nombre: ${resJson.legalGuardian?.lastName} ${resJson.legalGuardian?.firstName}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}

async function handleUserControllerResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  if (res.ok) {
    const resJson = await res.json().catch(() => ({}));
    const successMessage = `${resJson.message} Id: ${resJson.user?.id}, Email: ${resJson.user?.mail}, Rol: ${resJson.user?.role}`;
    return { message: successMessage, type: "success" };
  } else {
    return handleErrorResponse(res);
  }
}




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
  const[healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
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
          const toastData = await handleErrorResponse(res);
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
          const toastData = await handleErrorResponse(res);
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

    let toastData = await handleUserControllerResponse(res);

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
      toastData = await handlePatientControllerResponse(res);
    }

    if(selectedUser.legalGuardian) {
      toastData = await handleLegalGuardianControllerResponse(res);
    }

    if(selectedUser.professional) {
      toastData = await handleProfessionalControllerResponse(res);
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
      toastData = await handlePatientControllerResponse(res);
    }

    if(selectedUser.legalGuardian) {
      toastData = await handleLegalGuardianControllerResponse(res);
    }

    if(selectedUser.professional) {
      toastData = await handleProfessionalControllerResponse(res);
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
    <main className="ep-main">
        <section className="ep-container">
          {/* === SELECCIONAR USUARIO === */}
          <h1 className="ep-title">Seleccionar usuario</h1>
            <div className="ep-field">
                <label htmlFor="user">Usuario</label>
              <select
                id="user"
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const user = users.find((u) => u.id === Number(e.target.value));
                  setSelectedUser(user || null);
                }}
              >
                <option value="">Seleccionar…</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id} - {user.mail} — {user.role}
                  </option>
                ))}
              </select>
            </div>
        </section>

        { selectedUser && <section>
          {/* === Cambiar contraseña === */}
          <div className="ep-card">
            <div className="ep-field ep-email-with-btn">
              <label htmlFor="email">Email</label>
              <div className="ep-email-row">
                <input
                  id="email"
                  type="email"
                  value={selectedUser?.mail || ""}
                  readOnly
                  className="ep-input-disabled"
                />
                {!showChangePasswordModal && (
                  <button
                    type="button"
                    className="ep-btn"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    Cambiar contraseña
                  </button>
                )}
              </div>
            </div>
            
          </div>

          {/* === Form Datos de perfil === */}
          <form className="ep-card" onSubmit={handleSubmitProfile} noValidate>
            <fieldset className="ep-fieldset">
              <legend className="ep-legend">Datos del perfil</legend>

              <div className="ep-grid">
                <div className="ep-field">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="ep-field">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    id="apellido"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="ep-field">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+54 9 11 1234-5678"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>

          { (selectedUser.legalGuardian || selectedUser.patient) && (
            <div className="ep-field">
              <label htmlFor="healthInsurance">Obra Social</label>
              <select
                id="healthInsurance"
                value={selectedHealthInsuranceId ?? ""}
                onChange={(e) => setSelectedHealthInsuranceId(Number(e.target.value))}
              >
                <option value="">Seleccionar…</option>
                {healthInsurances.map((healthInsurance) => (
                  <option key={healthInsurance.id} value={healthInsurance.id}>
                    {healthInsurance.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(selectedUser.legalGuardian || selectedUser.patient) && (
              <div className="gp-field">
                <label htmlFor="add-fecha">Fecha de nacimiento</label>
                <input
                  id="add-fecha"
                  type="date"
                  value={birthdate ?? ""}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
          )}
          { selectedUser.professional && (
            <div className="ep-field">
              <label htmlFor="occupation">Especialidad</label>
              <select id="occupation" disabled value={occupationName}>
                <option value="">{occupationName || "Sin especialidad"}</option>
              </select>
            </div>
          )}
              <div className="ep-actions">
                <button type="submit" className="ep-btn">Guardar perfil</button>
              </div>
            </fieldset>
          </form>

          {/* === Footer de acciones globales === */}
          <div className="ep-footer-actions">
            <button type="button" className="ep-btn-outline" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="button" className="ep-btn ep-btn-danger" onClick={openConfirmDelete}>
              Borrar perfil
            </button>
          </div>

          {/* === Modal de confirmación === */}
          {showConfirmDelete && (
            <div
              className="ep-modal-backdrop"
              role="presentation"
              onClick={closeConfirmDelete}
            >
              <div
                className="ep-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ep-del-title"
                aria-describedby="ep-del-desc"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="ep-del-title">Eliminar perfil</h2>
                <p id="ep-del-desc">
                  ¿Estás seguro de que querés eliminar el perfil con todos sus datos?
                </p>
                <div className="ep-modal-actions">
                  <button type="button" className="ep-btn-outline" onClick={closeConfirmDelete}>
                    Cancelar
                  </button>
                  <button type="button" className="ep-btn ep-btn-danger" onClick={handleConfirmDelete}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === Modal de editar contraseña === */}
          {showChangePasswordModal && (
            <div
              className="ep-modal-backdrop"
              role="presentation"
              onClick={() => setShowChangePasswordModal(false)}
            >
              <div
                className="ep-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="change-pass-title"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="change-pass-title">Cambiar contraseña</h2>

                <div className="ep-field">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="ep-field">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Contraseña nueva"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="ep-field">
                  <input
                    type={showNewConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña nueva"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="ep-modal-actions">
                  <button
                    type="button"
                    className="ep-btn"
                    onClick={() => {
                      handleSubmitAuth(currentPassword, newPassword, confirmPassword);
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="ep-btn-outline"
                    onClick={() => closeSubmitAuth()}
                  >
                    Cancelar
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
  }
    </main>
  );
}