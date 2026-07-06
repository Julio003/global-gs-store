import { useState } from "react";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://global-gs-backend.onrender.com";

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

  const sendMessage = async () => {
    const cleanMessage = message.trim();

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

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            data.answer ||
            "Ahora mismo no pude responder. Escríbenos por WhatsApp al 829-221-5896.",
        },
      ]);
    } catch (error) {
      console.error("Error consultando asistente:", error);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Hubo un problema conectando con el asistente. Escríbenos por WhatsApp al 829-221-5896.",
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