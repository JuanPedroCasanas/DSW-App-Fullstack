// src/pages/Home.tsx
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">

        {/* mobile-first */}
        <NavLink
          to="/patient-portal"
          className="cta-primary"
          aria-label="Ir al portal de paciente"
        >
          Portal Paciente
        </NavLink>

        <NavLink
          to="/legal-guardian-portal"
          className="cta-primary"
          aria-label="Ir al portal del responsable legal"
        >
          Portal Responsable Legal
        </NavLink>

        <NavLink
          to="/professional-portal"
          className="cta-primary"
          aria-label="Ir al portal del profesional"
        >
          Portal Profesional
        </NavLink>

        <NavLink
          to="/debug-console"
          className="cta-primary"
          aria-label="Ir a la consola debug"
        >
          Portal Debug
        </NavLink>

      </section>
    </main>
  );
}