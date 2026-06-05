import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const API_URL = "https://global-gs-backend.onrender.com";
  const whatsappNumber = "18292215896";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : [];

        const foundProduct = products.find(
          (item) => item._id === id || item.id === id
        );

        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("es-DO");
  };

  const getStockStatus = (stock) => {
    const currentStock = Number(stock || 0);

    if (currentStock <= 0) {
      return {
        label: "Agotado",
        className: "stock-out",
      };
    }

    if (currentStock <= 3) {
      return {
        label: "Pocas unidades",
        className: "stock-low",
      };
    }

    return {
      label: "Disponible",
      className: "stock-available",
    };
  };

  const handleWhatsApp = () => {
    if (!product) return;

    if ((product.stock ?? 0) <= 0) {
      alert("Este producto está agotado actualmente.");
      return;
    }

    const stockStatus = getStockStatus(product.stock ?? 0);

    const message = `Hola Global-GS, estoy interesado en comprar este producto:

Producto: ${product.name}
Precio: RD$${formatPrice(product.price)}
Categoría: ${product.category || "Sin categoría"}
Disponibilidad: ${stockStatus.label}
Stock: ${product.stock ?? 0} unidades

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

  if (loading) {
    return <p className="empty-message">Cargando producto...</p>;
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-not-found">
          <h1>Producto no encontrado</h1>
          <p>Este producto no está disponible o fue eliminado del catálogo.</p>

          <Link to="/productos" className="back-button">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  const stockStatus = getStockStatus(product.stock ?? 0);

  return (
    <main className="product-detail-page">
      <section className="product-detail-card">
        <div className="product-detail-image">
          <img
            src={product.image || "/og-image.jpg"}
            alt={product.name || "Producto Global-GS"}
          />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">
            {product.category || "Sin categoría"}
          </span>

          <h1>{product.name}</h1>

          <div className="product-detail-stock-row">
            <span className={`stock-badge ${stockStatus.className}`}>
              {stockStatus.label}
              {(product.stock ?? 0) > 0
                ? ` (${product.stock} unidades)`
                : ""}
            </span>
          </div>

          <strong className="product-detail-price">
            RD${formatPrice(product.price)}
          </strong>

          <p className="product-detail-description">
            {product.description || "Producto disponible en Global-GS Store."}
          </p>

          <div className="product-detail-actions">
            {(product.stock ?? 0) > 0 ? (
              <button
                className="product-detail-buy"
                onClick={handleWhatsApp}
              >
                Comprar por WhatsApp
              </button>
            ) : (
              <button
                className="product-detail-buy disabled-button"
                disabled
              >
                Producto agotado
              </button>
            )}

            <Link to="/productos" className="product-detail-back">
              Volver al catálogo
            </Link>
          </div>

          <div className="product-detail-benefits">
            <div>
              <strong>Garantía</strong>
              <span>Productos de calidad</span>
            </div>

            <div>
              <strong>Soporte</strong>
              <span>Asistencia técnica</span>
            </div>

            <div>
              <strong>Entrega</strong>
              <span>Consulta disponibilidad</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;