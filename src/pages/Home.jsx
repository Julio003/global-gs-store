import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Home() {
  const API_URL = "https://global-gs-backend.onrender.com";
  const whatsappNumber = "18292215896";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("es-DO");
  };

  const getStockStatus = (stock) => {
    if ((stock ?? 0) <= 0) return "Agotado";
    if ((stock ?? 0) <= 3) return "Pocas unidades";
    return "Disponible";
  };

  const handleWhatsApp = (product) => {
    if ((product.stock ?? 0) <= 0) {
      alert("Este producto está agotado actualmente.");
      return;
    }

    const message = `Hola Global-GS, estoy interesado en comprar este producto:

Producto: ${product.name}
Precio: RD$${formatPrice(product.price)}
Categoría: ${product.category || "Sin categoría"}
Disponibilidad: ${getStockStatus(product.stock)}

Por favor, envíenme disponibilidad, forma de pago y método de entrega.

Mi nombre:
Mi teléfono:
Mi correo:

Visto en Global-GS Store.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  const availableProducts = products.filter((product) => (product.stock ?? 0) > 0);

  const featuredProducts =
    availableProducts.length > 0
      ? availableProducts.slice(0, 4)
      : products.slice(0, 4);

  return (
    <main className="home-page">
      <section className="hero-slider" style={{ maxWidth: '1300px', margin: '15px auto', overflow: 'hidden', borderRadius: '20px' }}>
  <Swiper
    modules={[Autoplay, Navigation, Pagination]}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
    }}
    navigation
    pagination={{ clickable: true }}
    loop={true}
    style={{ height: 'auto', maxVerticalAlign: 'middle' }}
  >
    <SwiperSlide>
      <img src="/slide1.jpg" alt="Global-GS 1" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide2.jpg" alt="Global-GS 2" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide3.jpg" alt="Global-GS 3" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide4.jpg" alt="Global-GS 4" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide5.jpg" alt="Global-GS 5" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide6.jpg" alt="Global-GS 6" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide7.jpg" alt="Global-GS 7" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>

    {/* DIAPOSITIVA 8: Reemplazo de la imagen con marca de agua por estructura limpia de código */}
    <SwiperSlide>
      <div className="slide-soporte-tecnico" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '450px', background: '#ffffff' }}>
        <div className="soporte-content" style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <div style={{ borderLeft: '5px solid var(--orange, #FF6A13)', paddingLeft: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: 'var(--navy, #002B49)', margin: 0, textTransform: 'uppercase', fontWeight: 'bold', fontSize: '28px' }}>SOPORTE TÉCNICO</h2>
          </div>
          <h3 style={{ color: 'var(--orange, #FF6A13)', marginTop: 0, fontSize: '20px', fontWeight: 'bold' }}>MANTENIMIENTO EXPERTO</h3>
          <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '16px' }}>No solo instalamos, sino que cuidamos su inversión. Nuestro equipo técnico está disponible para mantenimientos preventivos y correctivos.</p>
          <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '16px', marginBottom: 0 }}>Garantizamos que sus equipos operen con el máximo rendimiento, minimizando tiempos de inactividad.</p>
        </div>
        
        {/* Lado derecho con diseño corporativo limpio */}
        <div className="soporte-graphics" style={{ background: 'linear-gradient(135deg, #002B49 0%, #001f35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', position: 'relative' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '300px', zIndex: 1 }}>
            <span style={{ fontSize: '50px', color: '#FF6A13', display: 'block', marginBottom: '15px' }}>🛠️</span>
            <h4 style={{ margin: '10px 0 5px 0', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>Asistencia Profesional</h4>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Infraestructura protegida y optimizada siempre.</p>
          </div>
        </div>
      </div>
    </SwiperSlide>

    <SwiperSlide>
      <img src="/slide9.jpg" alt="Global-GS 9" style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', backgroundColor: '#ffffff', display: 'block' }} />
    </SwiperSlide>
  </Swiper>
</section>

      <div className="home-buttons">
        <Link to="/productos" className="home-btn catalogo">
          Ver Catálogo
        </Link>

        <a
          href="https://wa.me/18292215896"
          target="_blank"
          rel="noreferrer"
          className="home-btn whatsapp"
        >
          WhatsApp
        </a>
      </div>

      <section className="featured-section">
        <div className="featured-header">
          <div>
            <span className="featured-label">Productos recomendados</span>
            <h2>Destacados Global-GS</h2>
            <p>
              Productos seleccionados del catálogo para clientes, hogares,
              oficinas y empresas.
            </p>
          </div>

          <Link to="/productos" className="featured-view-all">
            Ver todos
          </Link>
        </div>

        {loading ? (
          <p className="empty-message">Cargando productos destacados...</p>
        ) : featuredProducts.length > 0 ? (
          <div className="featured-grid">
            {featuredProducts.map((product) => {
              const productId = product._id || product.id;
              const stock = product.stock ?? 0;

              return (
                <article className="featured-card" key={productId}>
                  <Link to={`/producto/${productId}`} className="featured-img">
                    <img
                      src={product.image || "/og-image.jpg"}
                      alt={product.name || "Producto Global-GS"}
                    />
                  </Link>

                  <div className="featured-info">
                    <div className="featured-meta">
                      <span>{product.category || "Sin categoría"}</span>
                      <strong>
                        {stock > 0
                          ? `Disponible (${stock})`
                          : "Agotado"}
                      </strong>
                    </div>

                    <Link to={`/producto/${productId}`} className="featured-title">
                      <h3>{product.name}</h3>
                    </Link>

                    <p>{product.description}</p>

                    <strong className="featured-price">
                      RD${formatPrice(product.price)}
                    </strong>

                    {stock > 0 ? (
                      <button
                        className="featured-buy"
                        onClick={() => handleWhatsApp(product)}
                      >
                        Comprar por WhatsApp
                      </button>
                    ) : (
                      <button className="featured-buy disabled-button" disabled>
                        Producto agotado
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-message">
            Todavía no hay productos registrados.
          </p>
        )}
      </section>
    </main>
  );
}

export default Home;