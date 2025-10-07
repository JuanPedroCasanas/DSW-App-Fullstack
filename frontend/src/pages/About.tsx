// src/pages/About.tsx


// según la IA: Si algún día tu app se deploya, por ejemplo, en https://midominio.com/app/, 
// conviene usar el BASE_URL de Vite para que el path se adapte solo:
const bannerUrl = `${import.meta.env.BASE_URL}NarrativasBanner.PNG`
//dios sabrá. Por ahora funciona.

export default function About() {
  return (
    <main className="about-container">
      <h2 className="about-title">Sobre Narrativas</h2>

      <section className="about-grid">
        {/* Columna izquierda: imagen cuadrada */}
        <div className="about-left">
          <img
            src={bannerUrl}  // como está en /public, a veces funciona poner: "/NarrativasBanner.PNG" directamente (por si no se ve la imagen)
            alt="Narrativas — banner"
            className="about-image"
          />
        </div>

        {/* Columna derecha: texto + Instagram */}
        <div className="about-right">
          <p>
            Somos un equipo interdisciplinario de profesionales que trabajamos con el 
            objetivo de generar experiencias singulares, alojando los begajes de sentidos que 
            cada uno trae en relación a su historia.
            Nos proponemos favorecer el proceso de construcción de pensamientos e 
            identidades, mediante diversos lenguajes en una narrativa propia que da cuenta
            de un contexto cultural, linguístico y social.
          </p>
          <p>
            Si querés conocer más, ver novedades y actividades, seguinos en Instagram: {' '}
            <a href="https://instagram.com/narrativas_fisherton">
              narrativas_fisherton
            </a> 
          </p>
        </div>
      </section>
    </main>
  );
}
