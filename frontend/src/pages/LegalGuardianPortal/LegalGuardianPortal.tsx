import { ActionGrid, NavButton} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";


export default function LegalGuardianPortal() {

  return (
    <Page>
      <SectionHeader
        title="Portal Responsable Legal"
        subtitle="Selecciona la acción a realizar"
      />

      <ActionGrid>

        <NavButton to="/appointment-schedule">Reservar turno</NavButton>

        <NavButton to="/guarded-patients">Pacientes a cargo</NavButton>

        <NavButton to="/edit-profile">Editar perfil</NavButton>

      </ActionGrid>

    </Page>
  );
}