const API_URL = "https://global-gs-backend.onrender.com";
const FALLBACK_URL = "/products-fallback.json";

const readProducts = async (response, sourceName) => {
  if (!response.ok) {
    throw new Error(`${sourceName} respondio con estado ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(`${sourceName} no devolvio un catalogo valido`);
  }

  return data;
};

export const fetchProductCatalog = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await readProducts(response, "El servidor");

    return { products, usingFallback: false };
  } catch (apiError) {
    console.warn("Backend no disponible; usando respaldo del catalogo.", apiError);

    const fallbackResponse = await fetch(FALLBACK_URL, { cache: "no-cache" });
    const products = await readProducts(fallbackResponse, "El respaldo");

    return { products, usingFallback: true };
  }
};
