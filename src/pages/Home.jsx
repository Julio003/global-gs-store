function Home() {
  return (
    <div>
      <section className="hero-banner">
        <img
          src="/global-gs-logo.jpg"
          alt="Global-GS"
          className="hero-logo"
        />

        <h1>GLOBAL-GS STORE</h1>

        <p className="hero-slogan">
          Conecta tu Mundo
        </p>

        <p className="hero-description">
          Tecnología, CCTV, Redes, Seguridad Electrónica
          y Soporte Técnico en República Dominicana.
        </p>

        <div className="hero-buttons">
          <a href="/productos" className="hero-btn">
            Ver Catálogo
          </a>

          <a
            href="https://wa.me/18292215896"
            target="_blank"
            rel="noreferrer"
            className="hero-btn whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;