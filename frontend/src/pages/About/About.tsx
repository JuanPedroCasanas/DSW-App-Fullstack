import { SocialLink } from "@/components/ui";
import { Page, SectionHeader } from "@/components/Layout";

export default function About() {
  return (
    <Page>
      <div className="max-w-[1100px] mx-auto grid gap-6 md:grid-cols-[minmax(0,420px)_1fr]">
        
        {/* Columna izquierda: imagen */}
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}NarrativasBanner.PNG`}
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
    </Page>
  );
}
