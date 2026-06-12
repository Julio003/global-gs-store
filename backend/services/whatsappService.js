const GRAPH_API_VERSION = "v20.0";

export const sendWhatsAppText = async (to, body) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.log("WhatsApp no configurado. Mensaje omitido:", { to, body });
    return null;
  }

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          preview_url: true,
          body,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Error enviando WhatsApp:", data);
    throw new Error("No se pudo enviar mensaje por WhatsApp");
  }

  return data;
};

export const notifyOwner = async (body) => {
  const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER;

  if (!ownerPhone) {
    console.log("OWNER_WHATSAPP_NUMBER no configurado. Aviso omitido:", body);
    return null;
  }

  return sendWhatsAppText(ownerPhone, body);
};
