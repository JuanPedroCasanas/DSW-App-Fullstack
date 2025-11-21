
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ActionGrid from "@/components/ui/ActionGrid";
import NavButton from "@/components/ui/NavButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar al navegar
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Cerrar al clickear fuera del menu del telefonito
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  // Helper para estilos de enlaces (activo/inactivo)
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block rounded-lg px-3 py-2 transition-colors",
      "hover:bg-cyan-50 hover:text-cyan-700",
      isActive ? "bg-cyan-100 text-cyan-700" : "text-gray-900",
    ].join(" ");

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "bg-white border-b border-gray-200",
        "transition-shadow",
        scrolled ? "shadow-md" : "",
        "pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))]",
      ].join(" ")}
      // Altura como variable (matching tu CSS): 64px mobile, 90px md+
      style={{ ["--nav-h" as any]: "64px" }}
    >
      {/* Wrapper interno */}
      <div className="h-[var(--nav-h)] md:h-[90px] max-w-6xl mx-auto flex items-center gap-3 py-2 md:py-0">

        <NavLink
          to="/"
          className="inline-flex items-center gap-3 font-bold text-base md:text-lg select-none"
          aria-label="Ir a inicio"
        >
          <img
            src="/icons/brain.png"
            alt="Logo Narrativas"
            className="h-7 w-auto md:h-8 rounded-md shadow-[inset_0_0_0_2px_rgba(0,0,0,.04)]"
            loading="eager"
            decoding="async"
          />
          <span className="leading-none">Narrativas</span>
        </NavLink>

        {/* Toggle (hamburguesa) - visible en mobile */}
        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-controls="primary-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={[
            "md:hidden ml-auto",
            "w-11 h-11 border border-black/10 bg-gray-100 rounded-xl",
            "inline-flex flex-col items-center justify-center gap-[5px]",
            "transition-colors active:scale-[0.99]",
          ].join(" ")}
        >
          {/* Barras que se transforman en “X” */}
          <span
            className={[
              "h-[2px] w-5 bg-current rounded-sm transition-transform duration-200",
              open ? "translate-y-[7px] rotate-45" : "",
            ].join(" ")}
          />
          <span
            className={[
              "h-[2px] w-5 bg-current rounded-sm transition-opacity duration-200",
              open ? "opacity-0" : "opacity-100",
            ].join(" ")}
          />
          <span
            className={[
              "h-[2px] w-5 bg-current rounded-sm transition-transform duration-200",
              open ? "-translate-y-[7px] -rotate-45" : "",
            ].join(" ")}
          />
        </button>

        {/* Menú desktop (visible ≥ md) */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          <NavLink to="/portales" className={linkClass}>
            Portales
          </NavLink>
          <NavLink to="/sobre-nosotros" className={linkClass}>
            Sobre nosotros
          </NavLink>
        </div>

        {/* CTA a la derecha en desktop */}
        <div className="hidden md:inline-flex ml-auto">
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="text-cyan-700 hover:underline font-semibold">
              Usuario: Pepe
            </NavLink>
            <NavButton to="/login" variant="solid">
              Iniciar Sesión
            </NavButton>
          </div>
        </div>
      </div>

      {/* Menú móvil (tarjeta bajo la barra) */}
      <div
        ref={menuRef}
        id="primary-menu"
        className={[
          "md:hidden",
          "absolute inset-x-0 top-[calc(var(--nav-h)+6px)]",
          "mx-4 p-3 rounded-xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,.08)]",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        {/* Links principales */}
        <ul className="grid gap-2 list-none p-0 m-0">
          <li>
            <NavLink to="/portales" className={linkClass}>
              Portales
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre-nosotros" className={linkClass}>
              Sobre nosotros
            </NavLink>
          </li>
        </ul>

        {/* CTA en mobile: usa tus componentes */}
        <div className="mt-2">
          <ActionGrid>
            <NavButton to="/registrarse" variant="solid">
              Registrarse
            </NavButton>
            <NavButton to="/login" variant="ghost">
              Iniciar sesión
            </NavButton>
          </ActionGrid>
        </div>
      </div>
    </nav>
  );
}