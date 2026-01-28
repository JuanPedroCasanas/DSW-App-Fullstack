import { ActionGrid, NavButton, Toast} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { useLocation } from "react-router-dom";


export default function PatientPortal() {
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;

  return (
    <Page>
      <SectionHeader
        title="Portal Paciente"
        subtitle="Selecciona la acción a realizar"
      />

      <ActionGrid>

        <NavButton to="/appointment-schedule">Reservar turno</NavButton>

        <NavButton to="/edit-profile">Editar perfil</NavButton>

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