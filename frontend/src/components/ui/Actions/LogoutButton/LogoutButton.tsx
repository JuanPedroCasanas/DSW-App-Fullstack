import { useLogout } from "@/common/utils/auth/UseLogout";

// uso: <LogoutButton />

export default function LogoutButton({ className = "", label = "Cerrar sesión" }) {
  const logout = useLogout();
  return (
    <button
      type="button"
      onClick={logout}
      className={`
        "inline-flex items-center justify-center rounded-[10px] w-full md:w-auto md:min-w-[180px] text-sm leading-none font-semibold px-3.5 py-3 transition-all duration-150 ease-in-out focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-primary)] shadow-inner bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 active:translate-y-[1px]"
        ${className}`}
    >
      {label}
    </button>
  );
}
