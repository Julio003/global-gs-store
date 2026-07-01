import { useEffect, useState } from "react";

function Admin() {
  const API_URL = "https://global-gs-backend.onrender.com";

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "Accesorios",
    image: "",
    images: [],
    video: "",
    stock: "",
  };

  const categories = [
    "Accesorios",
    "Bocinas",
    "Cocina",
    "Cámaras de seguridad",
    "Celulares",
    "Computadoras",
    "Herramientas",
    "Impresoras",
    "Oficina",
    "Redes",
    "Soporte técnico",
  ];

  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [researchQuery, setResearchQuery] = useState("");
  const [researchImageUrl, setResearchImageUrl] = useState("");
  const [galleryImageUrl, setGalleryImageUrl] = useState("");

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => (p.stock ?? 0) > 3).length;
  const lowStockProducts = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 3).length;
  const outOfStockProducts = products.filter((p) => (p.stock ?? 0) <= 0).length;
  const inventoryValue = products.reduce((total, p) => total + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
  const restockProducts = products.filter((p) => (p.stock ?? 0) <= 3);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
      setMessage("Error cargando productos");
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
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
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      setUploading(true);
      setMessage("Subiendo imagen...");

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: imageData,
      });

      const data = await response.json();
      if (!data.success) throw new Error("No se pudo subir la imagen");

      updateFormImages([data.imageUrl]);
      setMessage("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      setMessage("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const videoData = new FormData();
    videoData.append("video", file);

    try {
      setUploadingVideo(true);
      setMessage("Subiendo video... esto puede tomar unos segundos");

      const response = await fetch(`${API_URL}/api/upload/video`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: videoData,
      });

      const data = await response.json();
      if (!data.success) throw new Error("No se pudo subir el video");

      setForm((prev) => ({ ...prev, video: data.videoUrl }));
      setMessage("Video subido correctamente");
    } catch (error) {
      console.error(error);
      setMessage("Error subiendo video");
    } finally {
      setUploadingVideo(false);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 7);
    if (files.length === 0) return;

    const availableSlots = 7 - getProductImages(form).length;
    if (availableSlots <= 0) {
      setMessage("Ya tienes el máximo de 7 imágenes para este producto");
      return;
    }

    const imageData = new FormData();
    files.slice(0, availableSlots).forEach((file) => {
      imageData.append("image", file);
    });

    try {
      setUploading(true);
      setMessage("Subiendo imágenes...");

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: imageData,
      });

      const data = await response.json();
      if (!data.success) throw new Error("No se pudieron subir las imágenes");

      updateFormImages(data.imageUrls || [data.imageUrl]);
      setMessage("Imágenes agregadas correctamente");
    } catch (error) {
      console.error(error);
      setMessage("Error subiendo imágenes");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const addGalleryImageUrl = () => {
    const imageUrl = galleryImageUrl.trim();
    if (!imageUrl) { setMessage("Pega primero una URL de imagen"); return; }
    if (getProductImages(form).length >= 7) { setMessage("Ya tienes el máximo de 7 imágenes"); return; }
    updateFormImages([imageUrl]);
    setGalleryImageUrl("");
    setMessage("Imagen agregada a la galería");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setGalleryImageUrl("");
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
      images: getProductImages(form),
      video: form.video || "",
    };

    try {
      const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("No se pudo guardar el producto");

      setMessage(editingId ? "Producto actualizado correctamente" : "Producto guardado correctamente");
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
      images: getProductImages(product),
      video: product.video || "",
      stock: product.stock ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMessage("Editando producto seleccionado");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del catálogo?")) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("No se pudo eliminar el producto");

      setMessage("Producto eliminado correctamente");
      await loadProducts();
      if (editingId === id) resetForm();
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

  const getProductImages = (product) => {
    return [product.image, ...(Array.isArray(product.images) ? product.images : [])]
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index)
      .slice(0, 7);
  };

  const updateFormImages = (imageUrls) => {
    const images = [...getProductImages(form), ...imageUrls.filter(Boolean)]
      .filter((url, index, arr) => arr.indexOf(url) === index)
      .slice(0, 7);
    setForm({ ...form, image: images[0] || "", images });
  };

  const removeFormImage = (imageUrl) => {
    const images = getProductImages(form).filter((item) => item !== imageUrl);
    setForm({ ...form, image: images[0] || "", images });
  };

  const setPrimaryImage = (imageUrl) => {
    const images = [imageUrl, ...getProductImages(form).filter((item) => item !== imageUrl)].slice(0, 7);
    setForm({ ...form, image: imageUrl, images });
  };

  const normalizeText = (value) =>
    String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const toTitleCase = (value) =>
    String(value || "").trim().replace(/\s+/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

  const getSuggestedCategory = (query) => {
    const q = normalizeText(query);
    const rules = [
      { category: "Bocinas", keywords: ["audifono", "auricular", "bocina", "speaker", "sound", "bluetooth"] },
      { category: "Cámaras de seguridad", keywords: ["camara", "cctv", "dvr", "nvr", "hikvision", "dahua", "seguridad"] },
      { category: "Cables", keywords: ["cable", "hdmi", "usb", "tipo c", "type c", "vga", "red"] },
      { category: "Redes", keywords: ["router", "switch", "wifi", "tp-link", "access point", "modem"] },
      { category: "Celulares", keywords: ["celular", "telefono", "iphone", "samsung", "xiaomi", "motorola"] },
      { category: "Computadoras", keywords: ["laptop", "pc", "computadora", "monitor", "teclado", "mouse"] },
      { category: "Impresoras", keywords: ["impresora", "toner", "cartucho", "epson", "canon", "hp"] },
      { category: "Herramientas", keywords: ["herramienta", "tester", "multimetro", "ponchadora", "taladro"] },
    ];
    return rules.find((r) => r.keywords.some((k) => q.includes(k)))?.category || "Accesorios";
  };

  const buildResearchDescription = (query, category) => {
    const name = toTitleCase(query) || "Producto tecnológico";
    const descriptions = {
      Bocinas: `${name} con diseño moderno, sonido claro y conexión práctica para uso diario, oficina o actividades personales.`,
      "Cámaras de seguridad": `${name} ideal para vigilancia residencial o comercial, monitoreo seguro y uso con sistemas de seguridad.`,
      Cables: `${name} práctico para conectar equipos, transferir datos o mejorar la compatibilidad de dispositivos tecnológicos.`,
      Redes: `${name} diseñado para mejorar la conectividad, estabilidad de red y cobertura en hogares, oficinas o negocios.`,
      Celulares: `${name} recomendado para comunicación, productividad y uso diario con diseño funcional.`,
      Computadoras: `${name} útil para trabajo, estudio, oficina y tareas tecnológicas diarias.`,
      Impresoras: `${name} orientado a impresión, oficina, documentos y productividad diaria.`,
      Herramientas: `${name} útil para instalaciones, soporte técnico, mantenimiento y trabajos tecnológicos.`,
    };
    return descriptions[category] || `${name} disponible en Global-GS Store.`;
  };

  const researchSuggestion = (() => {
    const query = researchQuery.trim();
    if (!query) return null;
    const category = getSuggestedCategory(query);
    return { name: toTitleCase(query), category, description: buildResearchDescription(query, category) };
  })();

  const openResearchLink = (type) => {
    const query = researchQuery.trim();
    if (!query) { setMessage("Escribe primero un modelo o nombre de producto"); return; }
    const eq = encodeURIComponent(`${query} especificaciones producto`);
    const eiq = encodeURIComponent(`${query} producto imagen`);
    const links = {
      google: `https://www.google.com/search?q=${eq}`,
      images: `https://www.google.com/search?tbm=isch&q=${eiq}`,
      shopping: `https://www.google.com/search?tbm=shop&q=${eq}`,
      mercado: `https://listado.mercadolibre.com.do/${encodeURIComponent(query)}`,
      amazon: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
    };
    window.open(links[type], "_blank", "noopener,noreferrer");
  };

  const applyResearchSuggestion = () => {
    if (!researchSuggestion) { setMessage("Escribe primero un modelo o nombre de producto"); return; }
    setForm({ ...form, name: form.name || researchSuggestion.name, category: researchSuggestion.category, description: form.description || researchSuggestion.description });
    setMessage("Datos sugeridos aplicados al formulario");
  };

  const applyResearchImage = () => {
    const imageUrl = researchImageUrl.trim();
    if (!imageUrl) { setMessage("Pega primero la URL de una imagen del producto"); return; }
    updateFormImages([imageUrl]);
    setMessage("Imagen aplicada al formulario");
  };

  const formImages = getProductImages(form);

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-header">
          <div>
            <h1>Panel Administrador</h1>
            <p>Agrega, edita y elimina productos reales del catálogo Global-GS Store.</p>
          </div>
          <button type="button" className="logout-btn" onClick={logout}>Cerrar sesión</button>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card"><h3>📦 Productos</h3><strong>{totalProducts}</strong></div>
          <div className="stat-card"><h3>🟢 Disponibles</h3><strong>{availableProducts}</strong></div>
          <div className="stat-card"><h3>🟡 Pocas unidades</h3><strong>{lowStockProducts}</strong></div>
          <div className="stat-card"><h3>🔴 Agotados</h3><strong>{outOfStockProducts}</strong></div>
          <div className="stat-card"><h3>Valor inventario</h3><strong>RD${inventoryValue.toLocaleString("es-DO")}</strong></div>
        </div>

        {restockProducts.length > 0 && (
          <>
            <h2>⚠ Productos por reabastecer</h2>
            <div className="admin-products">
              {restockProducts.map((product) => (
                <div key={product._id} className="admin-product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p>Stock actual: <strong>{product.stock ?? 0}</strong></p>
                    <span>{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <hr style={{ margin: "30px 0" }} />
          </>
        )}

        <section className="admin-research">
          <div className="admin-research-header">
            <div>
              <span>Asistente de registro</span>
              <h2>Buscar datos y fotos del producto</h2>
            </div>
          </div>

          <div className="admin-research-grid">
            <label>
              Modelo, marca o pocas palabras
              <input type="search" value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} placeholder="Ej: Miccell SP62, router TP-Link AC1200, cámara Dahua" />
            </label>
            <div className="admin-research-actions">
              <button type="button" onClick={() => openResearchLink("google")}>Buscar datos</button>
              <button type="button" onClick={() => openResearchLink("images")}>Buscar fotos</button>
              <button type="button" onClick={() => openResearchLink("shopping")}>Ver precios</button>
              <button type="button" onClick={() => openResearchLink("mercado")}>Mercado Libre</button>
              <button type="button" onClick={() => openResearchLink("amazon")}>Amazon</button>
            </div>
          </div>

          {researchSuggestion && (
            <div className="admin-research-suggestion">
              <div>
                <span>Sugerencia local</span>
                <h3>{researchSuggestion.name}</h3>
                <p>{researchSuggestion.description}</p>
                <strong>{researchSuggestion.category}</strong>
              </div>
              <button type="button" onClick={applyResearchSuggestion}>Usar datos en formulario</button>
            </div>
          )}

          <div className="admin-image-helper">
            <label>
              URL de imagen encontrada
              <input type="url" value={researchImageUrl} onChange={(e) => setResearchImageUrl(e.target.value)} placeholder="Pega aquí la dirección de una imagen del producto" />
            </label>
            <button type="button" onClick={applyResearchImage}>Usar esta imagen</button>
          </div>

          {researchImageUrl && (
            <div className="admin-research-preview">
              <img src={researchImageUrl} alt="Vista previa de imagen encontrada" />
            </div>
          )}
        </section>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nombre del producto
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ej: Bocina Miccell" required />
          </label>

          <label>
            Precio
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Ej: 1950" required />
          </label>

          <label>
            Stock disponible
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Ej: 10" required />
          </label>

          <label>
            Categoría
            <select name="category" value={form.category} onChange={handleChange} required>
              {categories.map((item) => (<option key={item} value={item}>{item}</option>))}
            </select>
          </label>

          <label>
            Subir imagen del producto
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          {form.image && (
            <div className="image-preview">
              <p>Imagen principal:</p>
              <img src={form.image} alt="Vista previa del producto" />
            </div>
          )}

          <label>
            URL de imagen principal
            <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="La URL se genera automáticamente al subir imagen" required />
          </label>

          <label>
            Agregar varias imágenes opcionales
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading || formImages.length >= 7} />
          </label>

          <div className="gallery-url-helper">
            <label>
              Agregar imagen por URL
              <input type="url" value={galleryImageUrl} onChange={(e) => setGalleryImageUrl(e.target.value)} placeholder="Pega otra URL de imagen del producto" />
            </label>
            <button type="button" onClick={addGalleryImageUrl}>Agregar imagen</button>
          </div>

          {formImages.length > 0 && (
            <div className="product-gallery-editor">
              <div className="gallery-editor-header">
                <strong>Galería del producto</strong>
                <span>{formImages.length}/7 imágenes</span>
              </div>
              <div className="gallery-editor-grid">
                {formImages.map((imageUrl) => (
                  <div key={imageUrl} className="gallery-editor-item">
                    <img src={imageUrl} alt="Imagen del producto" />
                    <div className="gallery-editor-actions">
                      {form.image === imageUrl ? (
                        <span>Principal</span>
                      ) : (
                        <button type="button" onClick={() => setPrimaryImage(imageUrl)}>Principal</button>
                      )}
                      <button type="button" className="gallery-remove-btn" onClick={() => removeFormImage(imageUrl)}>Quitar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "10px" }}>
            <label>
              🎬 Video del producto (opcional, máx. 35 segundos recomendado)
              <input type="file" accept="video/*,video/mp4,video/quicktime" onChange={handleVideoUpload} disabled={uploadingVideo} />
            </label>

            {uploadingVideo && <p style={{ color: "#f97316", fontSize: "14px" }}>Subiendo video... por favor espera</p>}

            {form.video && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ fontSize: "14px", marginBottom: "6px" }}>Vista previa del video:</p>
                <video src={form.video} controls style={{ width: "100%", maxWidth: "400px", borderRadius: "8px", background: "#000" }} />
                <div style={{ marginTop: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="url" name="video" value={form.video} onChange={handleChange} placeholder="URL del video (se genera al subir)" style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }} />
                  <button type="button" onClick={() => setForm((prev) => ({ ...prev, video: "" }))} style={{ padding: "8px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                    Quitar video
                  </button>
                </div>
              </div>
            )}

            {!form.video && (
              <div style={{ marginTop: "8px" }}>
                <label style={{ fontSize: "13px", color: "#6b7280" }}>
                  O pega una URL de video directamente
                  <input type="url" name="video" value={form.video} onChange={handleChange} placeholder="https://... URL del video" style={{ display: "block", width: "100%", marginTop: "4px", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px" }} />
                </label>
              </div>
            )}
          </div>

          <label>
            Descripción
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe el producto..." required />
          </label>

          <div className="admin-actions">
            <button type="submit" disabled={uploading || uploadingVideo}>
              {uploading || uploadingVideo ? "Subiendo archivo..." : editingId ? "Actualizar producto" : "Guardar producto"}
            </button>
            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar edición</button>
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
                <p>{getProductImages(product).length} imagen(es) {product.video ? "· 🎬 Video" : ""}</p>
                <p>Stock: {product.stock ?? 0} — <b>{getStockStatus(product.stock ?? 0)}</b></p>
              </div>
              <div className="admin-product-actions">
                <button type="button" className="edit-btn" onClick={() => handleEdit(product)}>Editar</button>
                <button type="button" className="delete-btn" onClick={() => handleDelete(product._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Admin;
