import { SocialLink } from "@/components/ui";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 text-left">
            <h3 className="text-sm font-semibold text-gray-900">Ubicación</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Barrio Fisherton, Rosario, Santa Fe, Argentina.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/5493416488065"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 font-semibold hover:underline"
                  aria-label="Abrir WhatsApp"
                >
                  WhatsApp: <span className="text-gray-800 font-normal">+54 9 341 6488065</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:narrativasfisherton@gmail.com"
                  className="text-cyan-700 font-semibold hover:underline"
                  aria-label="Enviar email"
                >
                  Email: <span className="text-gray-800 font-normal">narrativasfisherton@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-sm font-semibold text-gray-900">Redes</h3>
            <SocialLink
              href="https://www.instagram.com/narrativas_fisherton/"
              label="@narrativas_fisherton"
              ariaLabel="Ir a Instagram de Narrativas Fisherton"
              icon="instagram"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">© {year} Narrativas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}