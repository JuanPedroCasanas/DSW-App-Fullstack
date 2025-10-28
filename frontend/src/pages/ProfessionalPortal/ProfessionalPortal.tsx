// src/pages/Home.tsx
import { NavLink } from "react-router-dom";

export default function ProfessionalPortal() {
  return (
    <main className="home">
      <h2>Portal Profesional</h2>

        <NavLink
          to="/professional-health-insurances"
          className="cta-primary"
          aria-label="Ir a listado de obras sociales"
        >
          Obras Sociales admitidas
        </NavLink>

        <NavLink
          to="/module-rent"
          className="cta-primary"
          aria-label="Ir a alquilar modulo"
        >
          Alquilar módulo
        </NavLink>

        <NavLink
          to="/edit-profile"
          className="cta-primary"
          aria-label="Ir a editar perfil"
        >
          Editar perfil
        </NavLink>

        <NavLink
          to="/appointment-list"
          className="cta-primary"
          aria-label="Ir a informe de turnos"
        >
          Listado de turnos
        </NavLink>
        
    </main>
  );
}