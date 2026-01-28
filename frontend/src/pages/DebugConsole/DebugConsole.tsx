import { ActionGrid, NavButton, Toast} from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";
import { useLocation } from "react-router-dom";

export default function DebugConsolePage() {
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;
  return (
    <Page>
      <SectionHeader
        title="Acciones"
      />
      <ActionGrid>
        <NavButton to="/appointment-schedule">Reservar turno para un paciente</NavButton>
        <NavButton to="/module-rent">Alquilar un módulo para un profesional</NavButton>
        <NavButton to="/professional-health-insurances">Obras sociales admitidas por un profesional</NavButton>
        <NavButton to="/guarded-patients">Pacientes a cargo por un responsable legal</NavButton>
        <NavButton to="/edit-profile">Editar un perfil</NavButton>

      </ActionGrid>


      <SectionHeader
        title="ABM"
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
        <NavButton to="/appointment-list">Listado de turnos por profesional</NavButton>
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

