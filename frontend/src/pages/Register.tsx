// src/pages/Register.tsx
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import "@/styles/login.css"; // Reutilizamos exactamente los estilos del login

type Role = "profesional" | "paciente" | "responsable";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    rol: "" as "" | Role,
  });
  const [showPwd, setShowPwd] = useState(false);

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rol) {
      alert("Por favor elegí un rol.");
      return;
    }
    console.log("REGISTER payload:", form);
    // TODO: enviar a tu backend/Firebase
  }

  return (
    <main className="login">{/* mismo wrapper que Login */}
        <div className="frame">
          {/* Encabezado en el mismo estilo que Login/Anima */}
          <div className="div">
            <h1 className="login__title">Bienvenido a Narrativas</h1>
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

            {/* CTA */}
            <div className="div-4">
              <button type="submit" className="btn-primary">Crear cuenta</button>
            </div>
          </form>
        </div>
    </main>
  );
}