import { ActionGrid, NavButton} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { useAuth } from "@/common/utils/auth/AuthContext";


export default function PatientPortal() {

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

    </Page>
  );
}