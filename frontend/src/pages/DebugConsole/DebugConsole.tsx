// DebugConsole.tsx
import { NavLink } from "react-router-dom";
import "./debugConsole.css";

export default function DebugConsole() {
  return (
    <section className="dc-page">
      <header className="dc-header">
        <h2>Portal de debug</h2>
        <p className="dc-subtitle">
          CRUDS
        </p>
      </header>

      {/* Links a los cruds */}
      <nav aria-label="Acciones de debug" className="dc-actions">
        <NavLink to="/admin/consulting-rooms" className="dc-button">Consultorios</NavLink>

        <NavLink to="/admin/modules" className="dc-button">Módulos (a implementar) </NavLink>
        <NavLink to="/admin/appointments" className="dc-button">Turnos (a implementar) </NavLink>
        <NavLink to="/admin/module-types" className="dc-button">Tipos de Módulos (a implementar) </NavLink>

        <NavLink to="/admin/health-insurances" className="dc-button">Obras sociales</NavLink>
        <NavLink to="/admin/occupations" className="dc-button">Especialidades</NavLink>

        <NavLink to="/admin/professionals" className="dc-button">Profesionales</NavLink>
        <NavLink to="/admin/patients" className="dc-button">Pacientes</NavLink>
        <NavLink to="/admin/legal-guardians" className="dc-button">Responsables Legales</NavLink>
      </nav>

    {/* Listados */}
      <p className="dc-subtitle">
          Listados
      </p>
      <nav aria-label="Listados" className="dc-actions">
        <NavLink
          to="/module-list"
          className="dc-button"
          aria-label="Ir al listado de módulos"
        >
          Listado de módulos
        </NavLink>
      </nav>
    </section>
  );
}