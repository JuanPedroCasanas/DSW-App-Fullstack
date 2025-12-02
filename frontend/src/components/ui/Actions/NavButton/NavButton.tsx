
// NavButton.tsx
import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
};

export default function NavButton({ to, children, variant = "solid" }: Props) {
  const base =
    [
      // Layout/shape
      "inline-flex items-center justify-center rounded-[10px] w-full md:w-auto md:min-w-[180px]",
      // Typography
      "text-sm leading-none font-semibold",
      // Spacing
      "px-3.5 py-3",
      // Transitions/feedback
      "transition-all duration-150 ease-in-out",
      // Accesibilidad focus-visible
      "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3",
      "focus-visible:outline-[var(--color-primary)]",
      // Pequeño realce interior como el inset-shadow del CSS
      "shadow-inner",
    ].join(" ");

  const solid = [
    "bg-[var(--color-primary)] text-white",
    "hover:brightness-95",
    "active:translate-y-[1px]",
  ].join(" ");

  const ghost = [
    "bg-transparent",
    "text-[var(--color-primary)]",
    "border-2 border-[var(--color-primary)]",
    "hover:bg-black/5",
    "active:bg-black/10 active:translate-y-[1px]",
  ].join(" ");

  const classes = `${base} ${variant === "solid" ? solid : ghost}`;

  return (
    <NavLink to={to} className={classes}>
      {children}
    </NavLink>
  );
}

