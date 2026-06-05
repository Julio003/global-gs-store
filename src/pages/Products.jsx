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

  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.category || "Sin categoría")),
  ];

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "Agotado", className: "stock-out" };
    if (stock <= 3) return { label: "Pocas unidades", className: "stock-low" };
    return { label: "Disponible", className: "stock-available" };
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const description = product.description || "";
    const productCategory = product.category || "Sin categoría";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

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
Precio: RD$${Number(product.price || 0).toLocaleString("es-DO")}
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
          placeholder="Buscar producto..."
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

      <section className="products-grid">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock ?? 0);

          return (
            <article className="product-card" key={product._id}>
              <img
                src={product.image}
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

                <Link to={`/producto/${product._id}`} className="product-link">
                  <h2>{product.name}</h2>
                </Link>

                <p>{product.description}</p>

                <strong className="product-price">
                  RD${Number(product.price || 0).toLocaleString("es-DO")}
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