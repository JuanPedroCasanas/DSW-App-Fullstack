import { ActionGrid, NavButton, Toast} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { useLocation } from "react-router-dom";

export default function ProfessionalPortal() {
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;

  return (
    <Page>
      <SectionHeader
        title="Portal Profesional"
        subtitle="Selecciona la acción a realizar"
      />

      <ActionGrid>
        <NavButton to="/professional-health-insurances">Obras Sociales admitidas</NavButton>

        <NavButton to="/module-rent">Alquilar módulo</NavButton>

        <NavButton to="/edit-profile">Editar perfil</NavButton>

        <NavButton to="/appointment-list">Listado de turnos</NavButton>
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