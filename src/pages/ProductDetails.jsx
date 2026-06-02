import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const whatsappNumber = "18292215896";

  useEffect(() => {
    fetch(`https://global-gs-backend.onrender.com/api/products`)
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find(
          (item) => item._id === id
        );

        setProduct(foundProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const getStockStatus = (stock) => {
    if (stock <= 0) return "Agotado";
    if (stock <= 3) return "Pocas unidades";
    return "Disponible";
  };

  const handleWhatsApp = () => {
    const message = `Hola Global-GS, estoy interesado en:

${product.name}

Precio: RD$${product.price.toLocaleString("es-DO")}`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  if (loading) {
    return <p className="empty-message">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="empty-message">Producto no encontrado.</p>;
  }

  return (
    <main className="page">
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: "500px",
          objectFit: "cover",
          borderRadius: "20px",
        }}
      />

      <h1>{product.name}</h1>

      <p>
        <strong>Categoría:</strong> {product.category}
      </p>

      <p>
        <strong>Disponibilidad:</strong>{" "}
        {getStockStatus(product.stock ?? 0)}
      </p>

      <p>
        <strong>Stock:</strong> {product.stock ?? 0}
      </p>

      <h2>
        RD$
        {product.price.toLocaleString("es-DO")}
      </h2>

      <p>{product.description}</p>

      {(product.stock ?? 0) > 0 ? (
        <button
          className="buy-button"
          onClick={handleWhatsApp}
        >
          Comprar por WhatsApp
        </button>
      ) : (
        <button
          className="buy-button disabled-button"
          disabled
        >
          Producto agotado
        </button>
      )}
    </main>
  );
}

export default ProductDetails;