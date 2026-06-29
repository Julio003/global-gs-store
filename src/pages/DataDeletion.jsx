import { useEffect } from "react";

function DataDeletion() {
  useEffect(() => {
    document.title = "Eliminación de Datos | Global-GS Store";
  }, []);

  return (
    <main className="legal-page">
      <h1>Eliminación de Datos de Usuario</h1>

      <p>
        Los usuarios pueden solicitar la eliminación de sus datos personales
        almacenados por Global-GS Store en cualquier momento.
      </p>

      <h2>¿Cómo solicitar la eliminación?</h2>

      <p>
        Envíe una solicitud al correo:
        <br />
        <strong>juliocvz.jcv@gmail.com</strong>
      </p>

      <p>
        La solicitud debe incluir información suficiente para identificar
        la cuenta o interacción correspondiente.
      </p>

      <h2>Tiempo de procesamiento</h2>

      <p>
        Las solicitudes serán procesadas en un plazo razonable conforme
        a la normativa aplicable y a nuestras políticas internas.
      </p>
    </main>
  );
}

export default DataDeletion;