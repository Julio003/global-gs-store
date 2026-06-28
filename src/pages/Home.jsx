import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const slidesData = [
  {
    id: 1,
    tag: "Tecnología & Innovación",
    title: "Global-GS Store",
    subtitle: "Tu mejor opción en Tecnología",
    description: "Catálogo digital con el mejor soporte técnico, equipos de redes y cámaras de seguridad en República Dominicana.",
    buttonText: "Ver Catálogo",
    buttonLink: "/productos",
    image: "/slide_store.png",
    gradient: "linear-gradient(135deg, #001a44 0%, #003b7a 100%)"
  },
  {
    id: 2,
    tag: "Seguridad Electrónica",
    title: "CCTV & Videovigilancia",
    subtitle: "Protege lo que más importa",
    description: "Instalación profesional de sistemas de cámaras de alta definición con monitoreo remoto en vivo desde tu celular.",
    buttonText: "Contactar por WhatsApp",
    buttonLink: "https://wa.me/18292215896",
    image: "/slide_cctv.png",
    gradient: "linear-gradient(135deg, #0d1e3d 0%, #1e3a8a 100%)"
  },
  {
    id: 3,
    tag: "Desarrollo de Software",
    title: "Desarrollo Web & Tiendas Online",
    subtitle: "Lleva tu negocio al siguiente nivel",
    description: "Creamos sitios web corporativos y tiendas de comercio electrónico personalizadas para impulsar tus ventas.",
    buttonText: "Ver Servicios",
    buttonLink: "/servicios",
    image: "/slide_web.png",
    gradient: "linear-gradient(135deg, #001a44 0%, #0f172a 100%)"
  },
  {
    id: 4,
    tag: "Redes & Conectividad",
    title: "Redes & Cableado Estructurado",
    subtitle: "Conectividad de alta velocidad",
    description: "Instalación de WiFi empresarial, redes estructuradas y configuración de equipos de comunicación estables.",
    buttonText: "Saber más",
    buttonLink: "/servicios",
    image: "/slide_networks.png",
    gradient: "linear-gradient(135deg, #0b1a30 0%, #003b7a 100%)"
  }
];

function Home() {
  const API_URL = "https://global-gs-backend.onrender.com";
  const whatsappNumber = "18292215896";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProductId, setExpandedProductId] = useState(null);

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

  useEffect(() => {
    document.title = "Global-GS Store | Tecnología y Seguridad Electrónica en República Dominicana";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Catálogo digital Global-GS. Encuentra lo mejor en tecnología, accesorios, CCTV, redes, seguridad electrónica y soporte técnico especializado en RD."
      );
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest(".featured-card")) {
        setExpandedProductId(null);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
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
      <section className="hero-slider">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {slidesData.map((slide) => (
            <SwiperSlide key={slide.id} style={{ background: slide.gradient }}>
              <div className="slide-info-container">
                <span className="slide-tag">{slide.tag}</span>
                <h2>{slide.title}</h2>
                <h3 className="slide-subtitle">{slide.subtitle}</h3>
                <p className="slide-description">{slide.description}</p>
                {slide.buttonLink.startsWith("http") ? (
                  <a
                    href={slide.buttonLink}
                    target="_blank"
                    rel="noreferrer"
                    className="slide-cta-btn"
                  >
                    {slide.buttonText}
                  </a>
                ) : (
                  <Link to={slide.buttonLink} className="slide-cta-btn">
                    {slide.buttonText}
                  </Link>
                )}
              </div>
              <div className="slide-media-container">
                <img src={slide.image} alt={slide.title} />
              </div>
            </SwiperSlide>
          ))}
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

                  <div 
                    className="featured-info"
                    onClick={(e) => {
                      if (!e.target.closest(".featured-buy") && !e.target.closest(".featured-title") && !e.target.closest(".featured-img")) {
                        setExpandedProductId(expandedProductId === productId ? null : productId);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
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

                    <p className={expandedProductId === productId ? "expanded" : ""}>
                      {product.description}
                    </p>

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