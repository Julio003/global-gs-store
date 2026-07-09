import Seo from "../components/Seo";

function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <Seo
        title="Politica de privacidad | Global-GS Store"
        description="Politica de privacidad de Global-GS Store sobre datos de clientes, pedidos, soporte y contacto."
        path="/politica-privacidad"
      />

      <h1>Política de Privacidad</h1>

      <p>
        En Global-GS Store respetamos y protegemos la privacidad de nuestros
        clientes y visitantes.
      </p>

      <h2>Información que recopilamos</h2>
      <p>
        Podemos recopilar información como nombre, número de teléfono,
        correo electrónico y datos necesarios para procesar compras,
        brindar soporte y mejorar nuestros servicios.
      </p>

      <h2>Uso de la información</h2>
      <p>
        La información recopilada se utiliza únicamente para gestionar pedidos,
        ofrecer atención al cliente, coordinar entregas y enviar información
        relacionada con nuestros productos y servicios.
      </p>

      <h2>Protección de datos</h2>
      <p>
        Implementamos medidas razonables de seguridad para proteger la
        información personal de accesos no autorizados, alteraciones o pérdidas.
      </p>

      <h2>Compartición de información</h2>
      <p>
        No vendemos ni compartimos información personal con terceros,
        salvo cuando sea necesario para cumplir obligaciones legales o
        completar servicios solicitados por el cliente.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta relacionada con privacidad, puede escribir a:
        <br />
        <strong>juliocvz.jcv@gmail.com</strong>
      </p>
    </main>
  );
}

export default PrivacyPolicy;
