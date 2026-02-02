import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";
import { UserRole } from "./common/types";

import { Home, Login, Register, ModuleRent, AppointmentSchedule, EditProfile, ProfessionalPortal, LegalGuardianPortal, PatientPortal, GuardedPatients, ModuleList, AppointmentList, DebugConsole, ConsultingRooms, HealthInsurances, Occupations,
Professionals, ProfessionalHealthInsurances
} from "./pages";

import AuthWatcher from "./common/utils/auth/AuthWatcher";
import ProtectedRoute from "./common/utils/auth/ProtectedRoute";
import Footer from "./components/Layout/Footer/Footer";

export default function App() {
  return (
     <div className="min-h-dvh flex flex-col">

      <AuthWatcher />
      <Navbar />

      <main className="flex-1 pt-[64px] md:pt-[90px]">
        <div className="mx-auto max-w-[1100px] px-4 py-4">


        <Routes>

        {/* ACCESO PUBLICO: */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        {/* USUARIOS LOGUEADOS: */}
        <Route element={<ProtectedRoute />}>

          <Route path="/edit-profile" element=
            {<EditProfile />} />

        </Route>

        {/* PROFESIONAL */}
        <Route element={<ProtectedRoute roles={[UserRole.Professional]} />}>

          <Route path="/professional-portal" element=
            {<ProfessionalPortal />} />

        </Route>

        <Route element={<ProtectedRoute roles={[UserRole.Professional, UserRole.Admin]} />}>

          <Route path="/professional-health-insurances" element=
            {<ProfessionalHealthInsurances />} />

          <Route path="/module-rent" element=
            {<ModuleRent />} />
        
          <Route path="/appointment-list" element=
            {<AppointmentList/>} />

        </Route>
          
        {/* RESPONSABLE LEGAL */}
        <Route element={<ProtectedRoute roles={[UserRole.LegalGuardian]} />}>

          <Route path="/legal-guardian-portal" element=
            {<LegalGuardianPortal />} />

        </Route>

        <Route element={<ProtectedRoute roles={[UserRole.LegalGuardian, UserRole.Admin]} />}>

          <Route path="/guarded-patients" element=
            {<GuardedPatients />} />

        </Route>
        
        {/* PACIENTE */}
        <Route element={<ProtectedRoute roles={[UserRole.Patient]} />}>
          <Route path="/patient-portal" element=
            {<PatientPortal />} />
        </Route>

        {/* PACIENTE Y RESPONSABLE LEGAL */}
        <Route element={<ProtectedRoute roles={[UserRole.LegalGuardian, UserRole.Patient, UserRole.Admin]} />}>
          <Route path="/appointment-schedule" element=
            {<AppointmentSchedule />} />
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoute roles={[UserRole.Admin]}  />}>

          <Route path="/debug-console" element={
            <DebugConsole />} />
          <Route path="/admin/consulting-rooms" element=
            {<ConsultingRooms />} />
          <Route path="/admin/health-insurances" element= 
            {<HealthInsurances />} />
          <Route path="/admin/occupations" element=
            {<Occupations />} />
          <Route path="/admin/professionals" element=
            {<Professionals />} />
          <Route path="/module-list" element=
            {<ModuleList />} />

        </Route>

          {/* fin de las rutas restringidas */}

          <Route path="*" element={<h1>Página no encontrada</h1>} />

        </Routes>

         </div>
      </main>

      <Footer / >

    </div>
  );
}
