import { useLocation } from "react-router-dom";

import { Toast, ActionGrid, NavButton, SocialLink } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

export default function Home() {
  const location = useLocation();
  const toastMessage = location.state?.toastMessage;

  return (
    <Page>
      <SectionHeader
        title="Bienvenido"
        subtitle="Selecciona el portal al que deseas acceder"
      />

      <ActionGrid>
        <NavButton to="/patient-portal">Portal Paciente</NavButton>
        <NavButton to="/legal-guardian-portal">Portal Responsable Legal</NavButton>
        <NavButton to="/professional-portal">Portal Profesional</NavButton>
        <NavButton to="/debug-console" variant="ghost">
          Portal Debug
        </NavButton>
      </ActionGrid>

    <div className="max-w-[1100px] mx-auto grid gap-6 md:grid-cols-[minmax(0,420px)_1fr] mt-6">
            
            {/* Columna izquierda: imagen */}
            <img
              src={`NarrativasBanner.PNG`}
              alt="Banner Narrativas"
              className="w-full aspect-square object-cover rounded-xl bg-white shadow-md"
            />

            {/* Columna derecha: texto */}
            <div className="grid gap-4">
              <SectionHeader title="Sobre Narrativas" />
              <p className="text-base leading-relaxed text-black/90">
                Somos un equipo interdisciplinario de profesionales que trabajamos
                con el objetivo de generar experiencias singulares, alojando los
                bagajes de sentidos que cada uno trae en relación a su historia.
              </p>
              <p className="text-base leading-relaxed text-black/90">
                Nos proponemos favorecer el proceso de construcción de pensamientos
                e identidades, mediante diversos lenguajes en una narrativa propia
                que da cuenta de un contexto cultural, lingüístico y social.
              </p>
              <p className="text-base leading-relaxed text-black/90">
                Si querés conocer más, ver novedades y actividades, seguinos en
                Instagram:{" "}
                
              <SocialLink
                href="https://instagram.com/narrativas_fisherton"
                label="narrativas_fisherton"
                ariaLabel="Ir al Instagram de narrativas_fisherton"
                className="mt-1"
              />

              </p>
            </div>
          </div>


      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => {}}
        />
      )}
    </Page>
  );
}
