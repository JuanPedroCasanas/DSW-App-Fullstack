import { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./login.css"; // Reutilizamos exactamente los estilos del login
import { HealthInsurance, Occupation } from "./loginRegisterTypes";
import { Toast } from "@/components/Toast";

type Role = "Paciente" | "Profesional" | "Responsable Legal" | "";

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


export default function Register() {


const [form, setForm] = useState<{
  mail: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fechaNacimiento: string;
  telefono: string;
  role: Role;
}>({
  mail: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  fechaNacimiento: "",
  telefono: "",
  role: "Paciente",
});

  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);;
  const [selectedOccupationId, setSelectedOccupationId]  = useState<number | null>(null);
  const [selectedHealthInsuranceId, setSelectedHealthInsuranceId]  = useState<number | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchOccupations = async () => {
      const res = await fetch("http://localhost:2000/Occupation/getAll");
      if (!res.ok){
        const toastData = await handleErrorResponse(res);
        setToast(toastData);
      } else {
        const data: Occupation[] = await res.json();
        setOccupations(data);
        if (selectedOccupationId === null) {
          setSelectedOccupationId(data[0]?.id ?? null);
        }
      }
    }

    const fetchHealthInsurances = async () => {
      const res = await fetch("http://localhost:2000/HealthInsurance/getAll?includeInactive=false");
      if (!res.ok){
        const toastData = await handleErrorResponse(res);
        setToast(toastData);
      } else {
        const data: HealthInsurance[] = await res.json();
        setHealthInsurances(data);
        if (selectedHealthInsuranceId === null) {
          setSelectedHealthInsuranceId(data[0]?.id ?? null);
        }
      }
    }

    if(form.role == "Profesional") {
      fetchOccupations();
    }
    if(form.role == "Paciente" || form.role == "Responsable Legal") {
      fetchHealthInsurances();
    }
  }, [form.role]);


  //Seleccion inicial de IDs cuando carga la pagina, lo hice asi para que aguante hasta que se pueblen los select
  useEffect(() => {
    if (form.role === "Profesional" && occupations.length > 0 && selectedOccupationId === null) {
      setSelectedOccupationId(occupations[0].id);
    }
  }, [occupations]);

  useEffect(() => {
    if ((form.role === "Paciente" || form.role === "Responsable Legal") &&
          healthInsurances.length > 0 && selectedHealthInsuranceId === null) {
      setSelectedHealthInsuranceId(healthInsurances[0].id);
    }
  }, [healthInsurances]);

  

  
  
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [message, setMessage] = useState('');      // Para mensajes de éxito o error
  const [isError, setIsError] = useState(false);    // Para marcar si el mensaje es un error
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón durante la petición

  // Mismo truco del ojito que en Login.tsx
  const eyeIconUrl = useMemo(() => {
    try {
      return new URL("./eyeicon.png", import.meta.url).href;
    } catch {
      return "";
    }
  }, []);

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    // 1. VALIDACIÓN DE CONTRASEÑAS
    if (form.password !== form.confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        setIsError(true);
        setIsLoading(false);
        return;
    }

    // 2. MAPEO DE DATOS BASE (DEL USUARIO PRINCIPAL)
    let dataToSend: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        birthdate: form.fechaNacimiento,
        mail: form.mail,
        password: form.password,
        telephone: form.telefono,
        role: form.role,
        idHealthInsurance: Number(selectedHealthInsuranceId)
    };

    if (!form.role) {
        alert("Por favor elegí un rol.");
        setIsLoading(false);
        return;
    }
    
    let endpoint = '';
    let dependentEndpoint = ''; 
    let dependentPayload: any = null; // Inicializado a null para el rol 'Responsable Legal'
    
    // --- 3. LÓGICA DE PREPARACIÓN DE ENDPOINTS Y PAYLOADS (SIN ASYNC/AWAIT) ---
    
    if (form.role=== 'Paciente') {
        if (!selectedHealthInsuranceId) {
            setMessage("Por favor elegí una obra social.");
            setIsError(true); 
            setIsLoading(false);
            return;
        }
        endpoint = 'http://localhost:2000/Patient/addIndPatient';
        dataToSend = {...dataToSend, idHealthInsurance: selectedHealthInsuranceId }; 
    }

    else if (form.role === 'Profesional') {
        if (!selectedOccupationId) {
            setMessage("Por favor elegí una occupation.");
            setIsError(true);
            setIsLoading(false);
            return;
        }
        endpoint = 'http://localhost:2000/Professional/add'; 
        dataToSend = {...dataToSend, idOccupation: selectedOccupationId };
    }
    
    else if (form.role=== 'Responsable Legal') { 
        // Validación de Obra Social del Responsable Legal (se adjunta a dataToSend)
        if (!selectedHealthInsuranceId) {
            setMessage("Por favor elegí una obra social.");
            setIsError(true); 
            setIsLoading(false);
            return;
        }
        
        // Adjuntar Obra Social al payload del Responsable Legal
        dataToSend = {...dataToSend, idHealthInsurance: selectedHealthInsuranceId }; 

        // Definir los dos endpoints
        endpoint = 'http://localhost:2000/LegalGuardian/add'; // 1ra petición

    } else {
        setMessage("Rol no válido.");
        setIsError(true);
        setIsLoading(false);
        return;
    }
    
    try {
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
      });

      if(response.ok) { //Para no limpiarle toda la form al usuario si sale algo mal
        setForm({ mail: "", password: "", confirmPassword: "", firstName: "", lastName: "", fechaNacimiento: "", telefono: "", role: "" });
        setOccupations; 
        setHealthInsurances;
      }

      let toastData;

      if(form.role === "Profesional") {
        toastData = await handleProfessionalControllerResponse(response)
      } else if(form.role === "Paciente") {
        toastData = await handlePatientControllerResponse(response)
      } else if(form.role === "Responsable Legal") {
        toastData = await handleLegalGuardianControllerResponse(response)
      }
      if(toastData) {
        setToast(toastData);
      }
    } catch (error) {
        // Error de red
        setMessage('🚨 Error de conexión: El servidor no está disponible.');
        setIsError(true);
    } finally {
        setIsLoading(false); 
    }
}
 
  return (
    <main className="login">{/* mismo wrapper que Login para no hacer 45 mil .css */}
        <div className="frame">
          {/* Encabezado en el mismo estilo que Login/Anima (anima = la ia de figma) */}
          <div className="div">
            <h1 className="login__title">Bienvenido a Narrativas</h1>
            <h1 className="login__title">Registrarse</h1>
            <NavLink className="text-wrapper-2" to="/login">
              ¿Ya tenés cuenta? Iniciar sesión
            </NavLink>
          </div>

          {/* Formulario */}
          <form className="div-2" onSubmit={onSubmit} noValidate>
            {/* firstName */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="firstName">Nombre</label>
              <div className="input">
                <input
                  id="firstName"
                  name="firstName"
                  className="input__control"
                  placeholder="Tu nombre"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            {/* lastName */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="lastName">Apellido</label>
              <div className="input">
                <input
                  id="lastName"
                  name="lastName"
                  className="input__control"
                  placeholder="Tu apellido"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            {/* mail */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="mail">Correo electrónico</label>
              <div className="input">
                <input
                  id="mail"
                  name="mail"
                  type="mail"
                  className="input__control"
                  placeholder="mail@dominio.com"
                  value={form.mail}
                  onChange={handleChange}
                  autoComplete="mail"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="password">Contraseña</label>
              <div className="input input--password">
                <input
                  id="password"
                  name="password"
                  className="input__control"
                  type={showPwd ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="eye"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setShowPwd((v) => !v)}
                >
                  {eyeIconUrl ? <img className="vector" src={eyeIconUrl} alt="" /> : "👁"}
                </button>
              </div>
            </div>


          {/* Repetir contraseña */}
          <div className="div-2">
            <label className="text-wrapper-3" htmlFor="confirmPassword">Repetir contraseña</label>
            <div className="input input--password">
              <input
                id="confirmPassword"
                name="confirmPassword"
                className="input__control"
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Repetí tu contraseña"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
                aria-invalid={
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? true
                    : undefined
                }
                aria-describedby="confirmPwdHelp"
              />
              <button
                type="button"
                className="eye"
                aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowConfirmPwd((v) => !v)}
              >
                {eyeIconUrl ? <img className="vector" src={eyeIconUrl} alt="" /> : "👁"}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <small id="confirmPwdHelp" style={{ color: "#d32f2f", marginTop: 4, display: "block" }}>
                Las contraseñas no coinciden.
              </small>
            )}
          </div>


            {/* Fecha de nacimiento */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <div className="input">
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  className="input__control"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  max={todayISO}
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="telefono">Teléfono</label>
              <div className="input">
                <input
                  id="telefono"
                  name="telefono"
                  className="input__control"
                  type="tel"
                  inputMode="tel"
                  placeholder="+54 9 341 123 4567"
                  value={form.telefono}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Rol */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="role">Rol</label>
              <div className="input">
                <select
                  id="role"
                  name="role"
                  className="input__control"
                  value={form.role}
                  onChange={handleChange}
                  required
                >                  
                  <option>Paciente</option>
                  <option>Responsable Legal</option>
                  <option>Profesional</option>
                </select>
              </div>
            </div>

            {/* /* occupation solo si rol = profesional */ }
            {form.role === "Profesional" && (
              <>
                <label htmlFor="occupation" className="text-wrapper-3" style={{ marginTop: 12 }}>
                  Especialidad
                </label>
                <div className="input">
                  <select
                    id="occupation"
                    name="occupation"
                    className="input__control"
                    value={selectedOccupationId ?? ""}
                    onChange={(e) => setSelectedOccupationId(Number(e.target.value))}
                    required
                  >                  
                    {occupations.map(g => (
                      <option key={g.id} value={g.id}>
                        Id: {g.id}, {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/*OBRA SOCIAL: Visible si el rol es Paciente' O RESPONSABLE */}
            {(form.role=== "Paciente" || form.role=== "Responsable Legal") && (
              <>
                <div className="div-2" style={{ marginTop: 12 }}>
                  <label className="text-wrapper-3" htmlFor="idHealthInsurance">
                    Obra Social
                  </label>
                  <div className="input">
                    <select
                      id="idHealthInsurance"
                      name="idHealthInsurance"
                      className="input__control"
                      value={selectedHealthInsuranceId ?? 1} //1 es id de particular 
                      onChange={(e) => {setSelectedHealthInsuranceId(Number(e.target.value))}}
                      required
                    >
                      {healthInsurances.map(g => (
                        <option key={g.id} value={g.id}>
                          Id: {g.id}, {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
         
            {/* CTA */}
              <div className="div-4">
                <button type="submit" className="btn-primary">Crear cuenta</button>
              </div>

            </form>
        </div>
        {/* ===== TOAST ===== */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
    </main>
  );
} 

