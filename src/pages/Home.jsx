function Home() {
  return (
    <main className="home-page">
      <section className="home-hero-image">
        <img
          src="/hero-global-gs.jpg"
          alt="Global-GS Store - Catálogo digital"
        />

        <div className="home-hero-actions">
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
    </main>
  );
}

export default Home;