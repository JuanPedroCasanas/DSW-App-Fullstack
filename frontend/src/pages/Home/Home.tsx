import { useLocation } from "react-router-dom";

import { Toast, ActionGrid, NavButton } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

export default function Home() {
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;

  return (
    <Page>
      <SectionHeader
        title="Bienvenido"
        subtitle="Selecciona el portal al que deseas acceder"
      />

      <ActionGrid>
        <NavButton to="/patient-portal">Portal Paciente</NavButton>
        <NavButton to="/legal-guardian-portal">Portal Responsable Legal</NavButton>
        <NavButton to="/professional-portal">Portal Profesional</NavButton>
        <NavButton to="/debug-console" variant="ghost">
          Portal Debug
        </NavButton>
      </ActionGrid>

      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => {}}
        />
      )}
    </Page>
  );
}
