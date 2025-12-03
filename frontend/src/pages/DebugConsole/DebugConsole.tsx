import { ActionGrid, NavButton} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

export default function DebugConsolePage() {
  return (
    <Page>
      <SectionHeader
        title="CRUDS"
      />
      <ActionGrid>
        <NavButton to="/admin/consulting-rooms">Consultorios</NavButton>
        <NavButton to="/admin/health-insurances">Obras sociales</NavButton>
        <NavButton to="/admin/occupations">Especialidades</NavButton>
        <NavButton to="/admin/professionals">Profesionales</NavButton>

      </ActionGrid>

      <SectionHeader
        title= "Listados"
      />
      <ActionGrid>
        <NavButton to="/module-list">Listado de Módulos</NavButton>
      </ActionGrid>

    </Page>
  );
}

