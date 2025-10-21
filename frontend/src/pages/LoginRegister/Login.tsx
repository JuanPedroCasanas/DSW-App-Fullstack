import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Toast } from "@/components/Toast";
import "./login.css"; 
// import eyeIcon from "./eyeicon.png"; // de alguna manera asi no funciona, pero bueno!

type User = {
  mail: string;
  password: string;
  isActive:boolean;
};
async function handleResponse(res: Response): Promise<{ message: string; type: "success" | "error" }> {
  const resJson = await res.json().catch(() => ({}));

  if (res.ok) {
    const successMessage = `${resJson.message} Id: ${resJson.user?.mail}, Nombre: ${resJson.user?.password}`;
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

export default function Login() {
  const [datos, setDatos] = useState({
    mail: "",
    password: "",
    isActive: true,
  });
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const eyeIconUrl = new URL("./eyeicon.png", import.meta.url).href; // tengo que hacer esta huevada para que me vea el ojito! podes creer!
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

useEffect(() => {
    const toastData = (navigate as any).location?.state?.toastMessage;

    if (toastData) {
        setToast(toastData);
    }
}, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   let { name, value } = e.target;
   let newDatos = { ...datos, [name]: value };
  setDatos(newDatos);
  }
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!datos.mail || !datos.password) {
        const toastData = { 
            message: "Por favor, ingrese su correo electrónico y contraseña.", 
            type: "error" as const 
        };
        setToast(toastData); 
        return}; 
    try {
    const res = await fetch("http://localhost:2000/User/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const data = await res.json();
    if (!res.ok) {
      const toastData = { message: data.message || "Mail o contraseña incorrecto", type: "error" as const };
      setToast(toastData);
      return;}
    
    const name = data.name;
    console.log('Nombre usado para el toast:', name);
    const toastData = { 
        message: "¡Bienvenido ${name}!",
        type: "success" as const
    };
   
    navigate("/", { state: { toastMessage: toastData } });
    
  
    } catch (error) {
    alert("Error de conexión con el servidor");
    console.error(error);
    };
  }

return (
    <main className="login">
      <form className="frame" onSubmit={handleSubmit} noValidate>
        {/* Encabezado */}
        <header className="div">
         {/* <h1 className="text-wrapper">Bienvenido</h1> */}
           {/* <h1 className="login__title">Bienvenido a Narrativas</h1> */}
          <h1 className="login__title">Bienvenido a Narrativas</h1> 
          
          <NavLink to="/register" className="text-wrapper-2">
            ¿Primera vez? Registrarse
          </NavLink>
        </header>

        {/* Email */}
        <div className="div-2">
          <label htmlFor="email" className="text-wrapper-3">
            Correo electrónico
          </label>
          <div className="div-wrapper input">
            <input
              id="mmail"
              name="mail"
              type={showPwd ? "text" : "mail"}
              className="input__control"
              placeholder="psico@narrativas.com.ar"
              value={datos.mail}
              onChange={handleInputChange}
              autoComplete="mail"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="div-2">
          <label htmlFor="password" className="text-wrapper-3">
            Contraseña
          </label>
          <div className="div-3 input input--password">
            <input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              className="input__control"
              placeholder="•••••••••"
              value={datos.password}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="eye"
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPwd((v) => !v)}
            >
              <img className="vector" src={eyeIconUrl} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* recordarme + contraseña olvidada */}
        <div className="div-4">
          <button type="submit" className="btn-primary text-wrapper-6">
            Iniciar sesión
          </button>

          <div className="div-5">
            <label className="div-6">
              <input
                className="checkbox"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-wrapper-7">Recordarme</span>
            </label>

            <NavLink to="/forgot-password" className="text-wrapper-8">
              ¿Olvidaste tu contraseña?
            </NavLink>
          </div>
        </div>
        {/* ===== TOAST ===== */}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
      </form>
    </main>
  );
}