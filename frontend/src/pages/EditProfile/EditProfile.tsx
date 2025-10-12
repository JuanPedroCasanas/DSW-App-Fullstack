import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // si no usás Router, ver nota más abajo
import "./editProfile.css";

export default function EditProfile() {
  
  // ----- Estado: credenciales -----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ----- Estado: perfil -----
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [obraSocialId, setObraSocialId] = useState("");

  // ----- Listado fijo de obras sociales (simulado) -----
  const obrasSociales = [
    { id: "osde", nombre: "OSDE" },
    { id: "swiss", nombre: "Swiss Medical" },
    { id: "galeno", nombre: "Galeno" },
  ];

  // ----- Envíos simulados -----
  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nContraseña: ${password || "(sin cambios)"}`);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Nombre: ${nombre}\nApellido: ${apellido}\nTeléfono: ${telefono}\nObra Social: ${obraSocialId || "(sin seleccionar)"}`
    );
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

  const handleConfirmDelete = () => {
    setShowConfirmDelete(false);
    // Simulación: más adelante marcás el usuario como "inactivo" en backend
    alert("Perfil marcado para eliminación (simulado).");
    console.log("[FRONT-ONLY] Acción de borrar perfil confirmada.");
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

  return (
    <section className="ep-container">
      <h1 className="ep-title">Editar perfil</h1>

      {/* === Form 1: Credenciales === */}
      <form className="ep-card" onSubmit={handleSubmitAuth} noValidate>
        <fieldset className="ep-fieldset">
          <legend className="ep-legend">Credenciales</legend>

          <div className="ep-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ejemplo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="ep-field">
            <label htmlFor="password">Contraseña</label>
            <div className="ep-password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="ep-btn-ghost"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <small className="ep-help">Dejá en blanco si no deseás cambiarla.</small>
          </div>

          <div className="ep-actions">
            <button type="submit" className="ep-btn">Guardar credenciales</button>
          </div>
        </fieldset>
      </form>

      {/* Divider */}
      <hr className="ep-divider" />

      {/* === Form 2: Datos de perfil === */}
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
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="ep-field">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                autoComplete="family-name"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
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
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="ep-field">
            <label htmlFor="obraSocial">Obra Social</label>
            <select
              id="obraSocial"
              value={obraSocialId}
              onChange={(e) => setObraSocialId(e.target.value)}
            >
              <option value="">Seleccionar…</option>
              {obrasSociales.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.nombre}
                </option>
              ))}
            </select>
          </div>

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
    </section>
  );
}