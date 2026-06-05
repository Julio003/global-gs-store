import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <section className="home-hero-image">
        <img src="/og-image.jpg" alt="Global-GS Store" />
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