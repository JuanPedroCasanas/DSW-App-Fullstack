import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./navbar.css";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar al clickear fuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "nav__link" + (isActive ? " is-active" : "");

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`} style={{ height: "var(--nav-h)" }}>
      <nav className="nav__inner" aria-label="Barra de navegación principal">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>

        <img
            src="/icons/brain.png"
            alt=""
            className="nav__logo"
            width={32}
            height={32}
            decoding="async"
        />

          <span className="nav__logo" aria-hidden="true" />
          <span className="nav__title">Narrativas</span>
        </NavLink>

        <button
          className="nav__toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(v => !v)}
        >
          <span className={`nav__toggle-bar ${open ? "x1" : ""}`} />
          <span className={`nav__toggle-bar ${open ? "x2" : ""}`} />
          <span className={`nav__toggle-bar ${open ? "x3" : ""}`} />
        </button>

        <div
          id="nav-menu"
          ref={menuRef}
          className={`nav__menu ${open ? "is-open" : ""}`}
        >
          <ul className="nav__list">
            <li>
              <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
                Portales
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
                Sobre nosotros
              </NavLink>
            </li>

            <li className="nav__cta--mobile"> 
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className="item-link item-link--as-link"
              >
                <span className="text-wrapper">Registrarse</span>
              </NavLink>
            </li>
          </ul>
        </div>
  

        <div className="nav__cta">
          <NavLink to="/login" className="item-link">
            <span className="text-wrapper">Iniciar Sesion</span>
          </NavLink>
        </div>

      </nav>
    </header>
  );
}
