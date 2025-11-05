// src/pages/Home.tsx
import { NavLink } from "react-router-dom";
 import { useLocation } from 'react-router-dom';
 import { Toast } from "@/components/Toast";

export default function Home() {
    
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;
  return (
    <main className="home">
      <section className="home-hero">

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
        {/* ===== TOAST ===== */}
            {toastMessage && (
              <Toast
                message={toastMessage.message}
                type={toastMessage.type}
                onClose={() => {}}
              />
            )}

      </section>
    </main>
  );
}