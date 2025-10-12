import { NavLink } from "react-router-dom";

export default function PatientPortal() {
  return (
    <main className="home">
      <h2>Portal Paciente</h2>
      <section className="home-hero">

        {/* mobile-first */}
        <NavLink
          to="/appointment-schedule"
          className="cta-primary"
          aria-label="Ir a reservar turno"
        >
          Reservar turno
        </NavLink>
        
        <NavLink
          to="/edit-profile"
          className="cta-primary"
          aria-label="Ir a editar perfil"
        >
          Editar perfil
        </NavLink>
        
      </section>
    </main>
  );
}