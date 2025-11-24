import Page from "@/components/Layout/Page/Page";
import SectionHeader from "@/components/Layout/SectionHeader/SectionHeader";
import ActionGrid from "@/components/ui/ActionGrid/ActionGrid";
import NavButton from "@/components/ui/NavButton/NavButton";

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