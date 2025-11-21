import Page from "@/components/ui/Page";
import SectionHeader from "@/components/ui/SectionHeader";
import ActionGrid from "@/components/ui/ActionGrid";
import NavButton from "@/components/ui/NavButton";

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
        <NavButton to="/admin/module-list">Listado de Modulos</NavButton>
      </ActionGrid>

    </Page>
  );
}

