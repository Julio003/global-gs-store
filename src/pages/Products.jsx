import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const API_URL = "https://global-gs-backend.onrender.com";
  const whatsappNumber = "18292215896";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

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

  const normalizeText = (value) => {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("es-DO");
  };

  const getProductId = (product) => product._id || product.id;

  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.category || "Sin categoría")),
  ];

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "Agotado", className: "stock-out" };
    if (stock <= 3) return { label: "Pocas unidades", className: "stock-low" };
    return { label: "Disponible", className: "stock-available" };
  };

  const getSearchScore = (product, query) => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return 0;

    const words = normalizedQuery.split(/\s+/).filter(Boolean);
    const name = normalizeText(product.name);
    const description = normalizeText(product.description);
    const categoryName = normalizeText(product.category);
    const searchable = `${name} ${description} ${categoryName}`;

    let score = 0;

    if (name === normalizedQuery) score += 140;
    if (name.includes(normalizedQuery)) score += 90;
    if (categoryName.includes(normalizedQuery)) score += 45;
    if (description.includes(normalizedQuery)) score += 35;

    words.forEach((word) => {
      if (name.includes(word)) score += 24;
      if (categoryName.includes(word)) score += 12;
      if (description.includes(word)) score += 8;
    });

    if (words.length > 1 && words.every((word) => searchable.includes(word))) {
      score += 30;
    }

    return score;
  };

  const searchResults = search.trim()
    ? products
        .map((product) => ({
          product,
          score: getSearchScore(product, search),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.product)
    : [];

  const assistantProduct = searchResults[0] || null;
  const relatedProducts = searchResults.slice(1, 4);

  const filteredProducts = products.filter((product) => {
    const query = normalizeText(search);
    const productCategory = product.category || "Sin categoría";
    const searchable = normalizeText(
      `${product.name || ""} ${product.description || ""} ${productCategory}`
    );

    const matchesSearch =
      !query || query.split(/\s+/).every((word) => searchable.includes(word));

    const matchesCategory =
      category === "Todos" || productCategory === category;

    return matchesSearch && matchesCategory;
  });

  const handleWhatsApp = (product) => {
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
    return <p className="empty-message">Cargando productos...</p>;
  }

  return (
    <main className="products-page">
      <section className="products-hero">
        <h1>Catálogo Global-GS Store</h1>
        <p>Busca productos, revisa precios y compra por WhatsApp.</p>
      </section>

      <section className="catalog-toolbar">
        <input
          type="search"
          placeholder="Buscar por modelo, nombre, categoría o descripción..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="category-buttons">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item ? "category-btn active" : "category-btn"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {search.trim() && (
        <section className="search-assistant">
          <div className="assistant-header">
            <div>
              <span>Asistente de búsqueda</span>
              <h2>Resultado para: “{search}”</h2>
            </div>

            <button type="button" onClick={() => setSearch("")}>
              Limpiar
            </button>
          </div>

          {assistantProduct ? (
            <div className="assistant-result">
              <Link
                to={`/producto/${getProductId(assistantProduct)}`}
                className="assistant-image"
              >
                <img
                  src={assistantProduct.image || "/og-image.jpg"}
                  alt={assistantProduct.name || "Producto Global-GS"}
                />
              </Link>

              <div className="assistant-info">
                <span className="assistant-match">Mejor coincidencia</span>
                <h3>{assistantProduct.name}</h3>
                <p>{assistantProduct.description}</p>

                <div className="assistant-meta">
                  <strong>RD${formatPrice(assistantProduct.price)}</strong>
                  <span>{assistantProduct.category || "Sin categoría"}</span>
                  <span
                    className={`stock-badge ${
                      getStockStatus(assistantProduct.stock ?? 0).className
                    }`}
                  >
                    {getStockStatus(assistantProduct.stock ?? 0).label}
                    {(assistantProduct.stock ?? 0) > 0
                      ? ` (${assistantProduct.stock})`
                      : ""}
                  </span>
                </div>

                <div className="assistant-actions">
                  <Link to={`/producto/${getProductId(assistantProduct)}`}>
                    Ver información
                  </Link>

                  {(assistantProduct.stock ?? 0) > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleWhatsApp(assistantProduct)}
                    >
                      Comprar por WhatsApp
                    </button>
                  ) : (
                    <button type="button" className="disabled-button" disabled>
                      Producto agotado
                    </button>
                  )}
                </div>
              </div>

              {relatedProducts.length > 0 && (
                <div className="assistant-related">
                  <h4>También puede servirte</h4>

                  {relatedProducts.map((product) => (
                    <Link
                      key={getProductId(product)}
                      to={`/producto/${getProductId(product)}`}
                    >
                      <img
                        src={product.image || "/og-image.jpg"}
                        alt={product.name || "Producto Global-GS"}
                      />
                      <span>{product.name}</span>
                      <strong>RD${formatPrice(product.price)}</strong>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="assistant-empty">
              No encontramos un producto con ese modelo o palabra. Prueba con
              una marca, categoría o parte del nombre.
            </p>
          )}
        </section>
      )}

      <section className="products-grid">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock ?? 0);
          const productId = getProductId(product);

          return (
            <article className="product-card" key={productId}>
              <img
                src={product.image || "/og-image.jpg"}
                alt={product.name || "Producto Global-GS"}
              />

              <div className="product-info">
                <span className="product-category">
                  {product.category || "Sin categoría"}
                </span>

                <span className={`stock-badge ${stockStatus.className}`}>
                  {stockStatus.label}
                  {(product.stock ?? 0) > 0
                    ? ` (${product.stock} unidades)`
                    : ""}
                </span>

                <Link to={`/producto/${productId}`} className="product-link">
                  <h2>{product.name}</h2>
                </Link>

                <p>{product.description}</p>

                <strong className="product-price">
                  RD${formatPrice(product.price)}
                </strong>

                {(product.stock ?? 0) > 0 ? (
                  <button
                    className="buy-button"
                    onClick={() => handleWhatsApp(product)}
                  >
                    Comprar por WhatsApp
                  </button>
                ) : (
                  <button className="buy-button disabled-button" disabled>
                    Producto agotado
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {filteredProducts.length === 0 && (
        <p className="empty-message">
          No encontramos productos con esa búsqueda.
        </p>
      )}
    </main>
  );
}

export default Products;
