import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./login.css"; // creamos este archivo en el paso 2
// import eyeIcon from "./eyeicon.png"; // de alguna manera asi no funciona, pero bueno!

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState('');      
  const [isError, setIsError] = useState(false);   
  const [isLoading, setIsLoading] = useState(false); 

  const eyeIconUrl = new URL("./eyeicon.png", import.meta.url).href; // tengo que hacer esta huevada para que me vea el ojito! podes creer!
  
  // Precarga "Recordarme" si ya guardaste un email antes
  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) setEmail(saved);
  }, []);
  
  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const { name, value } = e.target;
  
  // Usamos un switch para actualizar la variable de estado correcta
  switch (name) {
    case "email":
      setEmail(value);
      break;
    case "password":
      setPassword(value);
      break;
  }
}

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true); 

    const endpoint = 'http://localhost:2000/User/login'; 
    
    const dataToSend = {
        mail: email,
        password: password,
    };
    
    try {
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        
        if (response.ok) {
            const data = await response.json(); 
            
            
            if (remember) {
                localStorage.setItem("rememberEmail", email);
            } else {
                localStorage.removeItem("rememberEmail");
            }
            
          
            setMessage("¡Inicio de sesión exitoso!");
            
            
        } else {
     
            const errorData = await response.json(); 
           
            setMessage(errorData.message || 'Correo o contraseña incorrectos.'); 
            setIsError(true);
        }

    } catch (error) {
       
        setMessage('🚨 Error de conexión: El servidor no está disponible.');
        setIsError(true);
    } finally {
        setIsLoading(false); // Desactivar carga siempre
    }
}

  return (
    <main className="login">
      <form className="frame" onSubmit={onSubmit} noValidate>
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
              id="email"
              name="email"
              type="email"
              className="input__control"
              placeholder="ejemplo: psico@narrativas.com.ar"
              value={email}
              onChange={handleChange}
              autoComplete="email"
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
              value={password}
              onChange={handleChange}
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
      </form>
    </main>
  );
} 