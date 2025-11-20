import { NavLink } from "react-router-dom";
import "./patientPortal.css";

export default function PatientPortal() {
  return (
    <section className="patient-portal">
      <h2>Portal Paciente</h2>

      <nav className="patient-portal-nav">

        <NavLink to="/appointment-schedule">Reservar turno</NavLink>
        <NavLink to="/edit-profile">Editar perfil</NavLink>
        
      </nav>

    </section>
  );
}