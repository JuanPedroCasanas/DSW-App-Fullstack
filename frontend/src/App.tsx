import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ModuleRent from "./pages/ModuleRent";
import AppointmentSchedule from "./pages/AppointmentSchedule";


export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> {/* lo voy a borrar en el futuro, total el contacto está en About */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Lo ideal sería restringir estas rutas, lo dejo para el futuro */}
          <Route path="/alquilar-modulo" element={<ModuleRent />} />
          <Route path="/reservar-turno" element={<AppointmentSchedule />} />


          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
    </>
  );
}
