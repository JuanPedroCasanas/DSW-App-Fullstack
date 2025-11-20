// src/pages/Home.tsx
import { NavLink } from "react-router-dom";
import './professionalPortal.css';

export default function ProfessionalPortal() {
  return (
    <section className="professional-portal">
      <h2>Portal Profesional</h2>

      <nav className="professional-portal-nav">

        <NavLink
          to="/professional-health-insurances"
        >
          Obras Sociales admitidas
        </NavLink>

        <NavLink
          to="/module-rent"
        >
          Alquilar módulo
        </NavLink>

        <NavLink
          to="/edit-profile"
        >
          Editar perfil
        </NavLink>

        <NavLink
          to="/appointment-list"
        >
          Listado de turnos
        </NavLink>
        
<<<<<<< HEAD
    </main>
=======
      </nav>

    </section>
>>>>>>> entrega-reg
  );
}
