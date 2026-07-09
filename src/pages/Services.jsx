import Seo, { SITE_URL } from "../components/Seo";

function Services() {
  return (
    <main className="services-page">
      <Seo
        title="Servicios de tecnologia, CCTV, redes y soporte | Global-GS Store"
        description="Servicios Global-GS: instalacion de camaras CCTV, redes WiFi, cableado estructurado, soporte tecnico, desarrollo web y tiendas online en Republica Dominicana."
        path="/servicios"
        keywords="servicios tecnologia RD, instalacion CCTV, camaras seguridad, redes WiFi, soporte tecnico, desarrollo web, tiendas online"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Servicios tecnologicos Global-GS",
          provider: {
            "@type": "Store",
            name: "Global-GS Store",
            url: SITE_URL,
          },
          areaServed: "Republica Dominicana",
          serviceType: [
            "Instalacion CCTV",
            "Redes y cableado estructurado",
            "Soporte tecnico",
            "Desarrollo web",
            "Tiendas online",
          ],
          url: `${SITE_URL}/servicios`,
        }}
      />

      <section className="services-hero">
        <h1>Servicios Global-GS</h1>

        <p>
          Soluciones tecnológicas para hogares, negocios,
          emprendedores y empresas.
        </p>
      </section>

      <section className="services-grid">
        <article className="service-card">
          <h2>🌐 Desarrollo Web Full Stack</h2>

          <ul>
            <li>Páginas web corporativas</li>
            <li>Tiendas en línea</li>
            <li>Paneles administrativos</li>
            <li>Sistemas empresariales</li>
            <li>Bases de datos</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>📹 CCTV y Seguridad Electrónica</h2>

          <ul>
            <li>Instalación de cámaras</li>
            <li>DVR y NVR</li>
            <li>Monitoreo remoto</li>
            <li>Mantenimiento</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>🌐 Redes y Conectividad</h2>

          <ul>
            <li>WiFi empresarial</li>
            <li>Cableado estructurado</li>
            <li>Routers y switches</li>
            <li>Optimización de redes</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>🛠️ Soporte Técnico</h2>

          <ul>
            <li>Mantenimiento PC</li>
            <li>Instalación de software</li>
            <li>Diagnóstico</li>
            <li>Asistencia remota</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>💻 Tecnología y Accesorios</h2>

          <ul>
            <li>Audio y multimedia</li>
            <li>Accesorios</li>
            <li>Equipos de red</li>
            <li>Soluciones para oficina</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default Services;
