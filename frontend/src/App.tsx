import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar/Navbar";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/LoginRegister/Login";
import Register from "./pages/LoginRegister/Register";
import ModuleRent from "./pages/ModuleRent/ModuleRent";
import AppointmentSchedule from "./pages/AppointmentSchedule/AppointmentSchedule";
import EditProfile from "./pages/EditProfile/EditProfile";
import ProfessionalPortal from "./pages/ProfessionalPortal/ProfessionalPortal";
import LegalGuardianPortal from "./pages/LegalGuardianPortal/LegalGuardianPortal";
import PatientPortal from "./pages/PatientPortal/PatientPortal";
import GuardedPatients from "./pages/GuardedPatients/GuardedPatients";
import ModuleList from "./pages/ModuleList/ModuleList";
import AppointmentList from "./pages/AppointmentList/AppointmentList";
import DebugConsole from "./pages/DebugConsole/DebugConsole"; 
import ConsultingRooms from "./pages/admin/ConsultingRooms/ConsultingRooms";

import HealthInsurances from "./pages/admin/HealthInsurances/HealthInsurances";
import Occupations from "./pages/admin/Occupations/Occupations";
import Professionals from "./pages/admin/Professionals/Professionals";

import ProfessionalHealthInsurances from "./pages/ProfessionalHealthInsurances/ProfessionalHealthInsurances";
import AuthWatcher from "./common/utils/auth/AuthWatcher";
import ProtectedRoute from "./common/utils/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <AuthWatcher />
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem" }} className="pt-[64px] md:pt-[90px]">
        <Routes>

        {/* ACCESO PUBLICO: */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        {/* USUARIOS LOGUEADOS: */}
        <Route element={<ProtectedRoute />}>

          <Route path="/edit-profile" element=
            {<EditProfile />} />

        </Route>

        {/* PROFESIONAL */}
        <Route element={<ProtectedRoute roles={["professional"]} />}>

          <Route path="/professional-portal" element=
            {<ProfessionalPortal />} />

          <Route path="/professional-health-insurances" element=
            {<ProfessionalHealthInsurances />} />

          <Route path="/module-rent" element=
            {<ModuleRent />} />
        
          <Route path="/appointment-list" element=
            {<AppointmentList/>} />

        </Route>
          
        {/* RESPONSABLE LEGAL */}
        <Route element={<ProtectedRoute roles={["legalGuardian"]} />}>
          <Route path="/legal-guardian-portal" element=
            {<LegalGuardianPortal />} />

          <Route path="/guarded-patients" element=
            {<GuardedPatients />} />

        </Route>
        
        {/* PACIENTE */}
        <Route element={<ProtectedRoute roles={["patient"]} />}>
          <Route path="/patient-portal" element=
            {<PatientPortal />} />
        </Route>

        {/* PACIENTE Y RESPONSABLE LEGAL */}
        <Route element={<ProtectedRoute roles={["patient", "legalGuardian"]} />}>
          <Route path="/appointment-schedule" element=
            {<AppointmentSchedule />} />
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoute  />}>
        {/* descomentar esto cuando haya un usuario con rol admin en la bd
        <Route element={<ProtectedRoute roles={["admin"]} />}>*/}

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

          {/* fin de las rutas que deberian estar restringidas */}

          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
    </>
  );
}
