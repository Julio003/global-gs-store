function Services() {
  return (
    <main className="services-page">
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