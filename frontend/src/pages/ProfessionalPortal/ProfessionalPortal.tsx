import Page from "@/components/Layout/Page/Page";
import SectionHeader from "@/components/Layout/SectionHeader/SectionHeader";
import ActionGrid from "@/components/ui/ActionGrid/ActionGrid";
import NavButton from "@/components/ui/NavButton/NavButton";

export default function ProfessionalPortal() {

  return (
    <Page>
      <SectionHeader
        title="Portal Profesional"
        subtitle="Selecciona la acción a realizar"
      />

      <ActionGrid>
        <NavButton to="/professional-health-insurance">Obras Sociales admitidas</NavButton>

        <NavButton to="/module-rent">Alquilar módulo</NavButton>

        <NavButton to="/edit-profile">Editar perfil</NavButton>

        <NavButton to="/appointment-list">Listado de turnos</NavButton>
      </ActionGrid>

    </Page>
  );
}