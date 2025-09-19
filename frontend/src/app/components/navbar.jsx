// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Sombreado cuando se hace scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar al click fuera del menú (en mobile)
  useEffect(() => {
    const onClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " is-active" : "");

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        {/* Marca / Logo */}
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
          {/* Podés reemplazar por <img src="/logo.svg" alt="Tu Marca"Name="nav__logo-dot" aria-hidden="true" />
          <span className="nav__brand-text">Calcifer & Howl</span>
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="nav__toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-controls="primary-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav__toggle-bar ${open ? "x1" : ""}`} />
          <span className={`nav__toggle-bar ${open ? "x2" : ""}`} />
          <span className={`nav__toggle-bar ${open ? "x3" : ""}`} />
        </button>

        {/* Menú */}
        <nav
          id="primary-nav"
          className={`nav__menu ${open ? "is-open" : ""}`}
          ref={menuRef}
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
                Inicio
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
                Sobre nosotros
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
                Contacto
              </NavLink>
            </li>
          </ul>

          {/* CTA opcional a la derecha */}
          <div className="nav__cta">
            <a className="btn btn--primary" href="https://example.com" target </div>
        </nav>
      </div>
    </header>
  );
}
