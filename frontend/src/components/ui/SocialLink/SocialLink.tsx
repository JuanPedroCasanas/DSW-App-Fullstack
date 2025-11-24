type SocialLinkProps = {
  href: string;
  label: string; // texto visible
  ariaLabel?: string;
  icon?: "instagram"; // ampliable
  className?: string;
};

export default function SocialLink({
  href,
  label,
  ariaLabel,
  icon = "instagram",
  className = "",
}: SocialLinkProps) {
  const base =
    "inline-flex items-center gap-2 text-cyan-600 font-semibold hover:underline";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel ?? `Ir al perfil: ${label}`}
      className={`${base} ${className}`}
    >
      {icon === "instagram" && (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM18.5 6.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"
          />
        </svg>
      )}
      <span>{label}</span>
    </a>
  );
}
