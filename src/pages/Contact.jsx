import { useState } from "react";

function Contact() {
  const whatsappNumber = "18292215896";
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Consulta General",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construir mensaje de WhatsApp
    const message = `Hola Global-GS, mi nombre es ${formData.name}.
    
Asunto: ${formData.subject}
Teléfono: ${formData.phone || "No especificado"}
Correo: ${formData.email || "No especificado"}

Mensaje:
${formData.message}

Enviado desde el sitio web.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSubmitted(true);
  };

  return (
    <main className="contact-page page">
      <section className="contact-hero">
        <h1>Contacto Global-GS Store</h1>
        <p>¿Tienes dudas o necesitas soporte técnico? Escríbenos y te responderemos de inmediato.</p>
      </section>

      <div className="contact-container">
        {/* Formulario */}
        <section className="contact-form-section">
          <h2>Envíanos un mensaje</h2>
          {submitted ? (
            <div className="contact-success-msg">
              <h3>¡Mensaje preparado!</h3>
              <p>Hemos abierto WhatsApp para que envíes tu consulta. Si no se abrió automáticamente, haz clic abajo:</p>
              <button 
                className="contact-submit-btn" 
                onClick={handleSubmit}
              >
                Volver a enviar por WhatsApp
              </button>
              <button 
                className="contact-reset-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", phone: "", email: "", subject: "Consulta General", message: "" });
                }}
              >
                Escribir otro mensaje
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej: 829-221-5896"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: juan@gmail.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Asunto *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="CCTV y Seguridad">CCTV y Cámaras de Seguridad</option>
                  <option value="Soporte Técnico">Soporte Técnico PC</option>
                  <option value="Desarrollo Web">Desarrollo Web / Sistemas</option>
                  <option value="Compras / Precios">Consulta de Precios / Compras</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje o consulta detallada aquí..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Enviar por WhatsApp
              </button>
            </form>
          )}
        </section>

        {/* Info de contacto */}
        <section className="contact-info-section">
          <h2>Información de Contacto</h2>
          <p className="info-intro">Estamos a tu disposición para ayudarte con cualquier problema tecnológico o requerimiento de seguridad.</p>

          <div className="info-list">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>República Dominicana</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📱</span>
              <div>
                <strong>WhatsApp / Teléfono</strong>
                <p>829-221-5896</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Correo Electrónico</strong>
                <p>juliocvz.jvc@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <strong>Horario de Atención</strong>
                <p>Lunes a Sábado: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-socials">
            <a 
              href="https://wa.me/18292215896" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn wa"
            >
              WhatsApp Directo
            </a>
            <a 
              href="https://www.instagram.com/global_gs" 
              target="_blank" 
              rel="noreferrer" 
              className="social-btn ig"
            >
              Instagram
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Contact;