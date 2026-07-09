import { useState } from "react";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://global-gs-backend.onrender.com";

const quickQuestions = [
  "Ver catalogo",
  "Metodos de pago",
  "Entrega",
  "Servicios",
  "Redes sociales",
];

const getLocalAnswer = (text) => {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("pago") || normalized.includes("transferencia")) {
    return "Aceptamos efectivo, transferencia bancaria y coordinacion por WhatsApp segun disponibilidad y zona. Escribenos al 829-221-5896 para confirmar.";
  }

  if (
    normalized.includes("entrega") ||
    normalized.includes("envio") ||
    normalized.includes("delivery")
  ) {
    return "Coordinamos entregas segun ubicacion y disponibilidad. Puedes escribirnos por WhatsApp al 829-221-5896 con tu nombre y el producto que deseas.";
  }

  if (
    normalized.includes("redes sociales") ||
    normalized.includes("social") ||
    normalized.includes("instagram") ||
    normalized.includes("facebook") ||
    normalized.includes("tiktok")
  ) {
    return "Puedes compartir la tienda desde https://www.globalgsstore.com, seguirnos en Instagram: https://www.instagram.com/global.gs_/ y TikTok: https://www.tiktok.com/@juliovasquezpolanco.";
  }

  if (
    normalized.includes("servicio") ||
    normalized.includes("cctv") ||
    normalized.includes("camara") ||
    (normalized.includes("redes") && !normalized.includes("redes sociales")) ||
    normalized.includes("web")
  ) {
    return "Ofrecemos CCTV, redes, soporte tecnico, instalaciones electricas, accesorios tecnologicos y desarrollo web. Para cotizar, escribenos al 829-221-5896.";
  }

  if (
    normalized.includes("openai") ||
    normalized.includes("chatgpt") ||
    normalized.includes("credito") ||
    /\bia\b/.test(normalized)
  ) {
    return "Este asistente funciona en modo basico, sin creditos de OpenAI. Busca productos del catalogo y responde preguntas frecuentes.";
  }

  return "Puedo ayudarte con catalogo, precios, disponibilidad, pagos, entregas y servicios. Tambien puedes escribirnos directo por WhatsApp al 829-221-5896.";
};

function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hola, soy el asistente de Global-GS Store. Puedes preguntarme por productos, precios, pagos, envíos o servicios.",
    },
  ]);

  const renderText = (text) => {
    const parts = String(text).split(/(https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("http")) {
        return (
          <a key={index} href={part} target="_blank" rel="noreferrer">
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const sendMessage = async (presetMessage = message) => {
    const cleanMessage = String(presetMessage).trim();

    if (!cleanMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text: cleanMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Respuesta no valida del asistente");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            data.answer ||
            getLocalAnswer(cleanMessage),
        },
      ]);
    } catch (error) {
      console.error("Error consultando asistente:", error);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: getLocalAnswer(cleanMessage),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    if (loading) return;
    sendMessage(question);
  };

  return (
    <>
      {open && (
        <div className="assistant-box">
          <div className="assistant-header">
            <div>
              <strong>Asistente Global-GS</strong>
              <span>Productos, precios y servicios</span>
            </div>

            <button type="button" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="assistant-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.from === "user"
                    ? "assistant-message user"
                    : "assistant-message bot"
                }
              >
                {renderText(item.text)}
              </div>
            ))}

            {loading && (
              <div className="assistant-message bot">Buscando información...</div>
            )}
          </div>

          <div className="assistant-quick-actions">
            {quickQuestions.map((question) => (
              <button
                type="button"
                key={question}
                onClick={() => handleQuickQuestion(question)}
                disabled={loading}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="assistant-input">
            <input
              type="text"
              placeholder="Escribe aquí..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button type="button" onClick={sendMessage} disabled={loading}>
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="assistant-floating-btn"
        onClick={() => setOpen(true)}
      >
        💬 Asistente
      </button>
    </>
  );
}

export default AssistantWidget;
