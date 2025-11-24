import Page from "@/components/Layout/Page/Page";
import SectionHeader from "@/components/Layout/SectionHeader/SectionHeader";
import ActionGrid from "@/components/ui/ActionGrid/ActionGrid";
import NavButton from "@/components/ui/NavButton/NavButton";

export default function DebugConsolePage() {
  return (
    <Page>
      <SectionHeader
        title="CRUDS"
      />
      <ActionGrid>
        <NavButton to="/admin/consulting-rooms">Consultorios</NavButton>
        <NavButton to="/admin/health-insurances">Obras sociales</NavButton>
        <NavButton to="/admin/specialties">Especialidades</NavButton>
        <NavButton to="/admin/professionals">Profesionales</NavButton>

        <NavButton to="/admin/modules" variant="ghost"> Modulos </NavButton>

        <NavButton to="/admin/appointments" variant="ghost"> Turnos </NavButton>
        <NavButton to="/admin/module-types" variant="ghost"> Tipos de Módulos </NavButton>
        <NavButton to="/admin/patients" variant="ghost"> Pacientes </NavButton>
        <NavButton to="/admin/legal-guardians" variant="ghost"> Responsables Legales </NavButton>

      </ActionGrid>

      <SectionHeader
        title= "Listados"
      />
      <ActionGrid>
        <NavButton to="/admin/module-list">Listado de Módulos</NavButton>
      </ActionGrid>

    </Page>
  );
}

