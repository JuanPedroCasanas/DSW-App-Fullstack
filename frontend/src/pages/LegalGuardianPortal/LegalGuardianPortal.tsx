import { NavLink } from "react-router-dom";
import './legalGuardianPortal.css';

export default function LegalGuardianPortal() {
  return (
    <section className="legalGuardian-portal">
      <h2>Portal Responsable Legal</h2>

      <nav className="legalGuardian-portal-nav">

        <NavLink
          to="/appointment-schedule"
          className="cta-primary"
          aria-label="Ir a reservar turno"
        >
          Reservar turno
        </NavLink>

        <NavLink
          to="/guarded-patients"
          className="cta-primary"
          aria-label="Ir a paciente a cargo"
        >
          Pacientes a cargo
        </NavLink>

        <NavLink
          to="/edit-profile"
          className="cta-primary"
          aria-label="Ir a editar perfil"
        >
          Editar perfil
        </NavLink>

      </nav>

    </section>
  );
}

/*export default function PatientPortal() {
  return (
    <section className="patient-portal">
      <h2>Portal Paciente</h2>

      <nav className="patient-portal-nav">

        <NavLink to="/appointment-schedule">Reservar turno</NavLink>
        <NavLink to="/edit-profile">Editar perfil</NavLink>
        
      </nav>

    </section>
  );
} */