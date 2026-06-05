function Home() {
  return (
    <main className="home-page">
      <section className="home-hero-image">
        <img
          src="/og-image.jpg"
          alt="Global-GS Store"
        />
      </section>

      <div className="home-buttons">
        <a href="/productos" className="home-btn catalogo">
          Ver Catálogo
        </a>

        <a
          href="https://wa.me/18292215896"
          target="_blank"
          rel="noreferrer"
          className="home-btn whatsapp"
        >
          WhatsApp
        </a>
      </div>
    </main>
  );
}

export default Home;