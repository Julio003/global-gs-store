import express from "express";
import Lead from "../models/Lead.js";
import { searchProducts } from "../services/productSearchService.js";
import { notifyOwner, sendWhatsAppText } from "../services/whatsappService.js";

const router = express.Router();

const STORE_URL = process.env.PUBLIC_STORE_URL || "https://globalgsstore.com";

const greetingWords = ["hola", "buenas", "saludos", "info", "informacion"];
const buyingWords = [
  "comprar",
  "compra",
  "lo quiero",
  "me interesa",
  "quiero ese",
  "pagar",
  "precio final",
  "entrega",
  "disponible",
];

const normalizeText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("es-DO");
};

const getProductUrl = (product) => {
  return `${STORE_URL}/producto/${product._id}`;
};

const hasAnyWord = (message, words) => {
  const normalizedMessage = normalizeText(message);
  return words.some((word) => normalizedMessage.includes(normalizeText(word)));
};

const buildWelcomeMessage = () => {
  return [
    "Hola, soy el asistente de Global-GS Store.",
    "Puedo ayudarte a buscar productos, precios y disponibilidad.",
    "",
    "Escribe el nombre, modelo o categoría que buscas.",
    "Ejemplo: bocina Miccell, cámara Dahua, router TP-Link.",
  ].join("\n");
};

const buildProductResponse = (products) => {
  if (products.length === 0) {
    return [
      "No encontré un producto exacto con esa búsqueda.",
      "Puedes escribirme el modelo, marca o una categoría como audio, cámaras, redes o accesorios.",
      `${STORE_URL}/productos`,
    ].join("\n");
  }

  const productLines = products.map((product, index) => {
    const stock = Number(product.stock || 0);
    const status = stock > 0 ? `Disponible (${stock})` : "Agotado";

    return [
      `${index + 1}. ${product.name}`,
      `Precio: RD$${formatPrice(product.price)}`,
      `Estado: ${status}`,
      `Ver producto: ${getProductUrl(product)}`,
    ].join("\n");
  });

  return [
    "Encontré estos productos para ti:",
    "",
    productLines.join("\n\n"),
    "",
    "Si quieres comprar uno, responde: quiero comprar el producto 1, 2 o 3.",
  ].join("\n");
};

const getSelectedProduct = (message, products) => {
  const normalizedMessage = normalizeText(message);
  const selectedNumber = normalizedMessage.match(/\b([1-3])\b/)?.[1];

  if (selectedNumber) {
    return products[Number(selectedNumber) - 1] || products[0];
  }

  return products[0];
};

const saveLead = async ({ from, message, product, status }) => {
  const lead = await Lead.create({
    source: "whatsapp",
    customerPhone: from,
    message,
    status,
    product: product
      ? {
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
        }
      : undefined,
    conversation: [
      {
        direction: "incoming",
        text: message,
      },
    ],
  });

  return lead;
};

const notifyPurchaseIntent = async ({ from, message, product, lead }) => {
  const productBlock = product
    ? [
        `Producto: ${product.name}`,
        `Precio: RD$${formatPrice(product.price)}`,
        `Stock: ${product.stock ?? 0}`,
        `Enlace: ${getProductUrl(product)}`,
      ].join("\n")
    : "Producto: no identificado todavía";

  await notifyOwner(
    [
      "Cliente listo para comprar en Global-GS Store",
      "",
      `WhatsApp cliente: ${from}`,
      productBlock,
      `Mensaje: ${message}`,
      `Lead ID: ${lead._id}`,
    ].join("\n")
  );
};

const handleIncomingText = async ({ from, text }) => {
  const normalizedText = normalizeText(text);
  const isGreeting = hasAnyWord(text, greetingWords) && normalizedText.length < 25;
  const isBuying = hasAnyWord(text, buyingWords);

  if (isGreeting) {
    await sendWhatsAppText(from, buildWelcomeMessage());
    return;
  }

  const products = await searchProducts(text, 3);

  if (isBuying) {
    const product = getSelectedProduct(text, products);
    const lead = await saveLead({
      from,
      message: text,
      product,
      status: "ready_to_buy",
    });

    await notifyPurchaseIntent({ from, message: text, product, lead });

    await sendWhatsAppText(
      from,
      [
        "Perfecto, ya te tengo como cliente listo para comprar.",
        product
          ? `Producto: ${product.name} - RD$${formatPrice(product.price)}`
          : "Dime el producto exacto que quieres para confirmarlo.",
        "",
        "Un asesor de Global-GS recibirá tu solicitud. Para avanzar más rápido, envía tu nombre, zona de entrega y método de pago preferido.",
      ].join("\n")
    );

    return;
  }

  if (products.length > 0) {
    await saveLead({
      from,
      message: text,
      product: products[0],
      status: "interested",
    });
  }

  await sendWhatsAppText(from, buildProductResponse(products));
};

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
  try {
    const entries = req.body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const messages = change.value?.messages || [];

        for (const message of messages) {
          const from = message.from;
          const text = message.text?.body;

          if (from && text) {
            await handleIncomingText({ from, text });
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook de WhatsApp:", error);
    res.sendStatus(200);
  }
});

export default router;
