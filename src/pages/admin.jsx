import { useEffect, useState } from "react";

function Admin() {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "Accesorios",
    image: "",
    stock: "",
  };

  const categories = [
    "Accesorios",
    "Audio",
    "Cables",
    "Cámaras de seguridad",
    "Celulares",
    "Computadoras",
    "Herramientas",
    "Impresoras",
    "Oficina",
    "Redes",
    "Smartwatch",
    "Soporte técnico",
  ];

  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const totalProducts = products.length;

const availableProducts = products.filter(
  (product) => (product.stock ?? 0) > 3
).length;

const lowStockProducts = products.filter(
  (product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 3
).length;

const outOfStockProducts = products.filter(
  (product) => (product.stock ?? 0) <= 0
).length;

  const loadProducts = async () => {
    try {
      const response = await fetch("https://global-gs-backend.onrender.com");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setMessage("Error cargando productos");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploading(true);
      setMessage("Subiendo imagen...");

      const response = await fetch("https://global-gs-backend.onrender.com", {
        method: "POST",
        body: imageData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("No se pudo subir la imagen");
      }

      setForm({
        ...form,
        image: data.imageUrl,
      });

      setMessage("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      setMessage("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      const url = editingId
        ? `https://global-gs-backend.onrender.com/api/products/${editingId}`
        : "https://global-gs-backend.onrender.com/api/products";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el producto");
      }

      setMessage(
        editingId
          ? "Producto actualizado correctamente"
          : "Producto guardado correctamente"
      );

      await loadProducts();
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar el producto");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMessage("Editando producto seleccionado");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este producto del catálogo?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch("https://global-gs-backend.onrender.com", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      setMessage("Producto eliminado correctamente");
      await loadProducts();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al eliminar el producto");
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return "Agotado";
    if (stock <= 3) return "Pocas unidades";
    return "Disponible";
  };

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-header">
          <div>
            <h1>Panel Administrador</h1>
            <p>
              Agrega, edita y elimina productos reales del catálogo Global-GS
              Store.
            </p>
          </div>

          <button type="button" className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
        <div className="dashboard-stats">
  <div className="stat-card">
    <h3>📦 Productos</h3>
    <strong>{totalProducts}</strong>
  </div>

  <div className="stat-card">
    <h3>🟢 Disponibles</h3>
    <strong>{availableProducts}</strong>
  </div>

  <div className="stat-card">
    <h3>🟡 Pocas unidades</h3>
    <strong>{lowStockProducts}</strong>
  </div>

  <div className="stat-card">
    <h3>🔴 Agotados</h3>
    <strong>{outOfStockProducts}</strong>
  </div>
</div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nombre del producto
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Bocina Miccell"
              required
            />
          </label>

          <label>
            Precio
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Ej: 1950"
              required
            />
          </label>

          <label>
            Stock disponible
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Ej: 10"
              required
            />
          </label>

          <label>
            Categoría
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subir imagen del producto
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          {form.image && (
            <div className="image-preview">
              <p>Vista previa:</p>
              <img src={form.image} alt="Vista previa del producto" />
            </div>
          )}

          <label>
            URL de imagen generada
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="La URL se genera automáticamente al subir imagen"
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe el producto..."
              required
            />
          </label>

          <div className="admin-actions">
            <button type="submit" disabled={uploading}>
              {uploading
                ? "Subiendo imagen..."
                : editingId
                ? "Actualizar producto"
                : "Guardar producto"}
            </button>

            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {message && <p className="admin-message">{message}</p>}

        <hr style={{ margin: "40px 0" }} />

        <h2>Productos registrados</h2>

        <div className="admin-products">
          {products.map((product) => (
            <div key={product._id} className="admin-product-card">
              <img src={product.image} alt={product.name} />

              <div className="admin-product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span>{product.category}</span>
                <strong>RD${product.price.toLocaleString("es-DO")}</strong>
                <p>
                  Stock: {product.stock ?? 0} —{" "}
                  <b>{getStockStatus(product.stock ?? 0)}</b>
                </p>
              </div>

              <div className="admin-product-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Admin;