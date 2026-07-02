import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "https://global-gs-backend.onrender.com";
  const whatsappNumber = "18292215896";

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const products = Array.isArray(data) ? data : [];
        setProducts(products);
        const foundProduct = products.find((item) => item._id === id || item.id === id);
        const foundImages = foundProduct
          ? [foundProduct.image, ...(Array.isArray(foundProduct.images) ? foundProduct.images : [])].filter(Boolean)
          : [];
        setProduct(foundProduct || null);
        setActiveImage(foundImages[0] || "/og-image.jpg");
        setShowVideo(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const getProductId = (productData) => productData?._id || productData?.id;

  const formatPrice = (price) => Number(price || 0).toLocaleString("es-DO");

  const getStockStatus = (stock) => {
    const s = Number(stock || 0);
    if (s <= 0) return { label: "Agotado", className: "stock-out" };
    if (s <= 3) return { label: "Pocas unidades", className: "stock-low" };
    return { label: "Disponible", className: "stock-available" };
  };

  const getProductImages = (productData) => {
    return [productData.image, ...(Array.isArray(productData.images) ? productData.images : [])]
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index)
      .slice(0, 7);
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

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const categoryProducts = product
    ? products.filter((item) => (item.category || "Sin categoría") === (product.category || "Sin categoría"))
    : [];

  const currentIndex = categoryProducts.findIndex((item) => getProductId(item) === getProductId(product));
  const previousProduct =
    categoryProducts.length > 1
      ? categoryProducts[(currentIndex - 1 + categoryProducts.length) % categoryProducts.length]
      : null;
  const nextProduct =
    categoryProducts.length > 1
      ? categoryProducts[(currentIndex + 1) % categoryProducts.length]
      : null;

  const goToProduct = (targetProduct) => {
    const targetId = getProductId(targetProduct);

    if (!targetId || targetId === getProductId(product)) return;

    navigate(`/producto/${targetId}`);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null || categoryProducts.length <= 1) return;

    const distance = touchStartX - event.changedTouches[0].clientX;
    const minSwipeDistance = 55;

    if (distance > minSwipeDistance && nextProduct) {
      goToProduct(nextProduct);
    }

    if (distance < -minSwipeDistance && previousProduct) {
      goToProduct(previousProduct);
    }

    setTouchStartX(null);
  };

  if (loading) return <p className="empty-message">Cargando producto...</p>;

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-not-found">
          <h1>Producto no encontrado</h1>
          <p>Este producto no está disponible o fue eliminado del catálogo.</p>
          <Link to="/productos" className="back-button">Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  const stockStatus = getStockStatus(product.stock ?? 0);
  const productImages = getProductImages(product);
  const currentImage = activeImage || productImages[0] || "/og-image.jpg";
  const hasVideo = Boolean(product.video);

  return (
    <main
      className="product-detail-page"
      onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <section className="product-detail-card">
        {categoryProducts.length > 1 && (
          <div className="product-swipe-nav" aria-label="Navegar productos de la misma categoría">
            <button type="button" onClick={() => goToProduct(previousProduct)} aria-label="Producto anterior">
              ‹
            </button>
            <div>
              <span>{product.category || "Sin categoría"}</span>
              <strong>
                {currentIndex + 1} de {categoryProducts.length}
              </strong>
            </div>
            <button type="button" onClick={() => goToProduct(nextProduct)} aria-label="Producto siguiente">
              ›
            </button>
          </div>
        )}

        <div className="product-detail-image">

          {hasVideo && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  background: !showVideo ? "#001f5b" : "#e5e7eb",
                  color: !showVideo ? "#fff" : "#111",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                📷 Fotos
              </button>
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  background: showVideo ? "#001f5b" : "#e5e7eb",
                  color: showVideo ? "#fff" : "#111",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                🎬 Video
              </button>
            </div>
          )}

          {hasVideo && showVideo ? (
            <video
              src={product.video}
              controls
              autoPlay
              style={{
                width: "100%",
                borderRadius: "12px",
                background: "#000",
                maxHeight: "420px",
                objectFit: "contain",
              }}
            />
          ) : (
            <>
              <div className="product-main-media">
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={product.name || "Producto Global-GS"}
                  onError={(event) => {
                    event.currentTarget.src = "/og-image.jpg";
                  }}
                />
              </div>

              {productImages.length > 1 && (
                <div className="product-detail-gallery">
                  {productImages.map((imageUrl, index) => (
                    <button
                      key={imageUrl}
                      type="button"
                      className={currentImage === imageUrl ? "gallery-thumb active" : "gallery-thumb"}
                      onClick={() => setActiveImage(imageUrl)}
                      aria-label={`Ver imagen ${index + 1}`}
                    >
                      <img src={imageUrl} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}

                  {hasVideo && (
                    <button
                      type="button"
                      className="gallery-thumb"
                      onClick={() => setShowVideo(true)}
                      aria-label="Ver video del producto"
                    >
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: "#001f5b",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        minHeight: "60px",
                      }}>
                        ▶️
                      </div>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category || "Sin categoría"}</span>

          <h1>{product.name}</h1>

          <div className="product-detail-stock-row">
            <span className={`stock-badge ${stockStatus.className}`}>
              {stockStatus.label}
              {(product.stock ?? 0) > 0 ? ` (${product.stock} unidades)` : ""}
            </span>
          </div>

          <strong className="product-detail-price">RD${formatPrice(product.price)}</strong>

          <p className="product-detail-description">
            {product.description || "Producto disponible en Global-GS Store."}
          </p>

          <div className="product-detail-actions">
            {(product.stock ?? 0) > 0 ? (
              <button className="product-detail-buy" onClick={handleWhatsApp}>
                Comprar por WhatsApp
              </button>
            ) : (
              <button className="product-detail-buy disabled-button" disabled>
                Producto agotado
              </button>
            )}
            <Link to="/productos" className="product-detail-back">
              Volver al catálogo
            </Link>
          </div>

          {categoryProducts.length > 1 && (
            <section className="related-product-strip" aria-label="Más productos de esta categoría">
              <div className="related-product-header">
                <span>Más en esta categoría</span>
                <strong>
                  {currentIndex + 1}/{categoryProducts.length}
                </strong>
              </div>

              <div className="related-product-row">
                {categoryProducts.map((item) => {
                  const itemId = getProductId(item);
                  const isCurrent = itemId === getProductId(product);

                  return (
                    <button
                      key={itemId}
                      type="button"
                      className={isCurrent ? "related-product-pill active" : "related-product-pill"}
                      onClick={() => goToProduct(item)}
                      disabled={isCurrent}
                    >
                      <img src={item.image || "/og-image.jpg"} alt={item.name || "Producto Global-GS"} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

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

      {categoryProducts.length > 1 && (
        <nav className="product-bottom-nav" aria-label="Cambiar producto">
          <button type="button" onClick={() => goToProduct(previousProduct)}>
            ‹ Anterior
          </button>
          <span>
            {currentIndex + 1}/{categoryProducts.length}
          </span>
          <button type="button" onClick={() => goToProduct(nextProduct)}>
            Siguiente ›
          </button>
        </nav>
      )}
    </main>
  );
}

export default ProductDetails;
