// src/pages/Home.tsx
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">

        {/* mobile-first */}
        <NavLink
          to="/alquilar-modulo"
          className="cta-primary"
          aria-label="Ir a alquilar modulo"
        >
          Alquilar módulo
        </NavLink>

        <NavLink
          to="/reservar-turno"
          className="cta-primary"
          aria-label="Ir a reservar turno"
        >
          Reservar turno
        </NavLink>
      </section>
    </main>
  );
}