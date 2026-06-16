function Services() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <h1>Servicios Global-GS</h1>

        <p>
          Soluciones tecnológicas para hogares, negocios,
          emprendedores y empresas.
        </p>
      </section>

      <section className="services-grid">
        <article className="service-card">
          <h2>🌐 Desarrollo Web Full Stack</h2>

          <ul>
            <li>Páginas web corporativas</li>
            <li>Tiendas en línea</li>
            <li>Paneles administrativos</li>
            <li>Sistemas empresariales</li>
            <li>Bases de datos</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>📹 CCTV y Seguridad Electrónica</h2>

          <ul>
            <li>Instalación de cámaras</li>
            <li>DVR y NVR</li>
            <li>Monitoreo remoto</li>
            <li>Mantenimiento</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>🌐 Redes y Conectividad</h2>

          <ul>
            <li>WiFi empresarial</li>
            <li>Cableado estructurado</li>
            <li>Routers y switches</li>
            <li>Optimización de redes</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>🛠️ Soporte Técnico</h2>

          <ul>
            <li>Mantenimiento PC</li>
            <li>Instalación de software</li>
            <li>Diagnóstico</li>
            <li>Asistencia remota</li>
          </ul>
        </article>

        <article className="service-card">
          <h2>💻 Tecnología y Accesorios</h2>

          <ul>
            <li>Audio y multimedia</li>
            <li>Accesorios</li>
            <li>Equipos de red</li>
            <li>Soluciones para oficina</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default Services;
const axios = require('axios');

// Configura tus variables de entorno o utiliza directamente tus credenciales
const WHATSAPP_TOKEN = 'tu_token_permanente_aquí';
const PHONE_NUMBER_ID = '1161573340376637'; // Tu ID de número de teléfono
const RECIPIENT_NUMBER = '+18292215896'; // El número al que enviarás el mensaje

// Función para enviar el mensaje
async function enviarMensajeWhatsApp() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: RECIPIENT_NUMBER,
        type: "text",
        text: {
          body: "¡Hola Julio! Este es un mensaje de prueba desde Global GS Store 🚀"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Mensaje enviado con éxito:', response.data);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
  }
}

// Llama a la función para probar
enviarMensajeWhatsApp();
