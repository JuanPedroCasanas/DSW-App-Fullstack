import { ActionGrid, NavButton} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";


export default function ProfessionalPortal() {

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

    </Page>
  );
}