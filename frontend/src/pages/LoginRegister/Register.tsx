// src/pages/Register.tsx
import { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./login.css"; // Reutilizamos exactamente los estilos del login

type Role = "profesional" | "paciente" | "responsable";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "", // NEW: confirmación
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    rol: "" as "" | Role

  });


  // lo estoy poniendo por separado del const [form, setForm] porque por ahora manejamos únicamente el 
  // register de paciente. Es para no romper el código más que nada. Ni idea, funciona.
  const [especialidad, setEspecialidad] = useState(""); 
  const [healthinsuranceId, setHealthInsurance] = useState("1"); // Valor por defecto para pacientes
  const [dependentForm, setDependentForm] = useState({
    name: "",
    lastName: "",
    birthdate: "",
    legalGuardianId: ""
  });
 
  useEffect(() => {
    if (form.rol !== "profesional") {
      setEspecialidad(""); 
    }
  }, [form.rol]);
  useEffect(() => {  if (form.rol !== "paciente") {
      setHealthInsurance("1");
    }
  }, [form.rol]);
  useEffect(() => {
  if (form.rol !== "responsable") {
      setDependentForm({
        name: "",
        lastName: "",
        birthdate: "",
        legalGuardianId: ""
      });
    }
    }, [form.rol]);
  
  
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
    setDependentForm((f) => ({ ...f, [name]: value }));
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(''); 
    setIsError(false);
    setIsLoading(true); 
  
    // Valida las contraseñas antes de enviar
    if (form.password !== form.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setIsError(true);
      setIsLoading(false);
      return;
    }
    //mapeo de datos a enviar
    let dataToSend: any = {
    name: form.nombre,
    lastName: form.apellido,
    birthdate: form.fechaNacimiento,
    mail: form.email, 
    password: form.password,
    telephone: form.telefono,
    rol: form.rol
  };

    if (!form.rol) {
      alert("Por favor elegí un rol.");
      setIsLoading(false);
      return;
    }
    let endpoint = '';
    let dependentEndpoint = ''; // Nuevo endpoint para el paciente dependiente
    let dependentPayload: any; 
    
    //If para agregar los campos extra según el rol
    if (form.rol=='paciente') {
             
            if (!healthinsuranceId) {
                setMessage("Por favor elegí una obra social.");
                setIsError(true); 
                setIsLoading(false);
                return;
            }
            endpoint = 'http://localhost:2000/Patient/addPatient';
            dataToSend = {...dataToSend, healthinsuranceId: Number(healthinsuranceId) }; 
          }
    else if (form.rol=='profesional') {
            if (!especialidad) {
                setMessage("Por favor elegí una especialidad.");
                setIsError(true);
                setIsLoading(false);
                return;
            }
            endpoint = 'http://localhost:2000/Professional/addProfessional'; 
            dataToSend = {...dataToSend, occupation: especialidad };
          }
            
    else if (form.rol =='responsable') { 
        
        if (!healthinsuranceId) {
          setMessage("Por favor elegí una obra social para el paciente a cargo.");
          setIsError(true); 
          setIsLoading(false);
          return;
        }
        if (!dependentForm.name || !dependentForm.lastName || !dependentForm.birthdate ) {
          setMessage("Por favor completa todos los datos del paciente a cargo.");
          setIsError(true);
          setIsLoading(false);
          return;
        }
        endpoint = 'http://localhost:2000/LegalGuardian/addLegalGuardian'; 
        dependentEndpoint = 'http://localhost:2000/Patient/addDependentPatient';

        dependentPayload = {
            name: dependentForm.name,
            lastName: dependentForm.lastName,
            birthdate: dependentForm.birthdate 
        };
        const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
        });

      const data = await response.json(); // <-- Siempre procesa la respuesta

      if (!response.ok) { 
        setMessage(data.message || 'Error desconocido al registrar el responsable legal.');
        setIsError(true);
        setIsLoading(false);
        return;
      }
      if (form.rol === 'responsable') {
        const legalGuardianId = data.id || data.legalGuardianId; 

        if (!legalGuardianId) { throw new Error("ID del responsable no devuelto."); }

        dependentPayload.legalGuardianId = legalGuardianId;

        const dependentResponse = await fetch(dependentEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dependentPayload)
        });
        
        if (!dependentResponse.ok) {
            const dependentData = await dependentResponse.json();
            setMessage(dependentData.message || 'Error desconocido al registrar el paciente a cargo.');
             return; 
        }

        setMessage('Registro de Responsable y Paciente completado con éxito!');

    } else {
        setMessage(data.message || '¡Registro completado con éxito!');
    }
    try {
        // 3. Usar el endpoint dinámico
        const response = await fetch(endpoint, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
          
        });
        const data = await response.json(); // <--- Faltaba esto
        
        console.log("[REGISTER] status:", response.status, "body:", data); 

        if (response.ok) { 
            setMessage(data.message || '¡Registro completado con éxito!');
            // Limpiar el formulario completo después del éxito
            setForm({ 
                email: "", password: "", confirmPassword: "", 
                nombre: "", apellido: "", fechaNacimiento: "", 
                telefono: "", rol: "" as "" | Role,
            });
            setEspecialidad(""); 
        } else { 
            setMessage(data.message || 'Error desconocido al registrar.');
            setIsError(true);
        }
    } catch (error) {
        // Error de red
        setMessage('🚨 Error de conexión: El servidor no está disponible.');
        setIsError(true);
    } finally {
        // Siempre desactiva el estado de carga al terminar
        setIsLoading(false); 
    }
    console.log("REGISTER payload:", dataToSend);
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
            {/* Nombre */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="nombre">Nombre</label>
              <div className="input">
                <input
                  id="nombre"
                  name="nombre"
                  className="input__control"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>
            </div>

            {/* Apellido */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="apellido">Apellido</label>
              <div className="input">
                <input
                  id="apellido"
                  name="apellido"
                  className="input__control"
                  placeholder="Tu apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="div-2">
              <label className="text-wrapper-3" htmlFor="email">Correo electrónico</label>
              <div className="input">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input__control"
                  placeholder="nombre@dominio.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
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
              <label className="text-wrapper-3" htmlFor="rol">Rol</label>
              <div className="input">
                <select
                  id="rol"
                  name="rol"
                  className="input__control"
                  value={form.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Elegí una opción</option>
                  <option value="profesional">Profesional</option>
                  <option value="paciente">Paciente</option>
                  <option value="responsable">Responsable legal</option>
                </select>
              </div>
            </div>

            {/* Especialidad solo si rol = profesional */}
            {form.rol === "profesional" && (
              <>
                <label htmlFor="especialidad" className="text-wrapper-3" style={{ marginTop: 12 }}>
                  Especialidad
                </label>
                <div className="input">
                  <select
                    id="especialidad"
                    name="especialidad"
                    className="input__control"
                    value={especialidad}                 //  ya no depende de form !!! para no romper el register de paciente
                    onChange={(e) => setEspecialidad(e.target.value)}
                    required
                  >
                    <option value="" disabled>Elegí una especialidad</option>
                    <option value="psicopedagogia">Psicopedagogia</option>
                    <option value="psicologia">Psicologia</option>
                  </select>
                </div>
              </>
            )}
            {/* Obra Social solo si rol = paciente */ }
            {form.rol === "paciente" && (
            <>
              <div className="div-2" style={{ marginTop: 12 }}>
              <label className="text-wrapper-3" htmlFor="healthInsuranceId">
              Obra Social
              </label>
              <div className="input">
                  <select
                    id="healthInsuranceId"
                    name="healthInsuranceId"
                    className="input__control"
                    value={healthinsuranceId} // <- Usa el estado de Obra Social
                    onChange={(e) => setHealthInsurance(e.target.value)} // <- Usa el setter
                    required
                  >
                    <option value="" disabled>Elegí una obra social</option>
                    <option value="1">OSDE</option>
                    <option value="2">Swiss Medical</option>
                    <option value="3">PAMI</option>
                  </select>
              </div>
            </div>
          </>
        )}  
            { /* ID Paciente solo si rol = responsable */}
            {form.rol === "responsable" && (
            <>
              <div className="div-2" style={{ marginTop: 12 }}>
              <label className="text-wrapper-3" htmlFor="idPatient">
              ID Paciente a cargo
              </label>
              <div className="input">
                <input
                id="idPatient"
                name="idPatient"
                className="input__control"
                placeholder="ID del paciente (ej: 123)"
                type="number" // <- Asegúrate de que acepta números
                value={idPatient} // <- Usa el estado de idPatient
                onChange={(e) => setIdPatient(e.target.value)} // <- Usa el setter
                required
              />
              </div>
            </div>
          </>
        )}

            {/* CTA */}
            <div className="div-4">
              <button type="submit" className="btn-primary">Crear cuenta</button>
            </div>

          {/* mensajes generales */}
          {message && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                color: isError ? "#d32f2f" : "#2e7d32",
                fontSize: 14,
              }}
            >
              {message}
            </div>
          )}

          </form>
        </div>
    </main>
  );
  } 
}
