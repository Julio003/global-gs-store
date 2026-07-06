import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

const STORE_URL =
  process.env.PUBLIC_STORE_URL || "https://www.globalgsstore.com";

const WHATSAPP_NUMBER = "18292215896";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("es-DO");
};

const normalizeText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const cleanSearchWords = (message) => {
  const stopWords = [
    "hola",
    "buenas",
    "saludos",
    "tienes",
    "tiene",
    "hay",
    "precio",
    "quiero",
    "comprar",
    "necesito",
    "busco",
    "de",
    "la",
    "el",
    "los",
    "las",
    "un",
    "una",
    "para",
    "por",
    "favor",
    "me",
    "puedes",
    "decir",
  ];

  return normalizeText(message)
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));
};

const getProductUrl = (product) => {
  return `${STORE_URL}/producto/${product._id}`;
};

const getWhatsAppUrl = (product) => {
  const message = product
    ? `Hola Global-GS, estoy interesado en este producto:%0A%0AProducto: ${product.name}%0APrecio: RD$${formatPrice(
        product.price
      )}%0A%0AVisto en Global-GS Store.`
    : "Hola Global-GS, necesito información sobre sus productos y servicios.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};

const buildWelcomeMessage = () => {
  return [
    "👋 Bienvenido a Global-GS Store.",
    "",
    "Puedo ayudarte a buscar productos, precios y disponibilidad.",
    "",
    "Puedes escribir, por ejemplo:",
    "• jumper de batería",
    "• bocinas",
    "• cámaras",
    "• accesorios iPhone",
    "• router",
    "• CCTV",
    "",
    "También puedes escribir:",
    "• métodos de pago",
    "• envío",
    "• servicios",
    "",
    "📲 WhatsApp: 829-221-5896",
  ].join("\n");
};

const buildPaymentMessage = () => {
  return [
    "💳 Métodos de pago disponibles:",
    "",
    "• Efectivo",
    "• Transferencia bancaria",
    "• Pago contra entrega, según la zona",
    "",
    "Para confirmar disponibilidad y forma de pago, escríbenos por WhatsApp:",
    "829-221-5896",
  ].join("\n");
};

const buildShippingMessage = () => {
  return [
    "🚚 Envíos y entregas:",
    "",
    "Realizamos entregas según disponibilidad y ubicación del cliente.",
    "",
    "Para coordinar entrega, envíanos tu ubicación por WhatsApp:",
    "829-221-5896",
  ].join("\n");
};

const buildServicesMessage = () => {
  return [
    "🛠️ Servicios Global-GS:",
    "",
    "• Instalación y mantenimiento CCTV",
    "• Sistemas eléctricos residenciales y comerciales",
    "• Redes y conectividad",
    "• Soporte técnico",
    "• Reparación e instalación de equipos electrónicos",
    "• Desarrollo web y soluciones digitales",
    "",
    "Para cotizar un servicio, escríbenos por WhatsApp:",
    "829-221-5896",
  ].join("\n");
};

const buildNoProductsMessage = () => {
  return [
    "No encontré un producto exacto con esa búsqueda.",
    "",
    "Puedes intentar con marca, modelo o categoría.",
    "",
    "Ejemplos:",
    "• jumper",
    "• bocina",
    "• cámara",
    "• iPhone",
    "• router",
    "",
    `También puedes ver el catálogo aquí: ${STORE_URL}/productos`,
    "",
    "📲 WhatsApp: 829-221-5896",
  ].join("\n");
};

const buildProductResponse = (products) => {
  const lines = products.map((product, index) => {
    const stock = Number(product.stock || 0);
    const status = stock > 0 ? `Disponible (${stock})` : "Agotado";

    return [
      `${index + 1}. ${product.name}`,
      `Precio: RD$${formatPrice(product.price)}`,
      `Categoría: ${product.category || "No especificada"}`,
      `Estado: ${status}`,
      `Ver producto: ${getProductUrl(product)}`,
      `Comprar por WhatsApp: ${getWhatsAppUrl(product)}`,
    ].join("\n");
  });

  return [
    "Encontré estos productos para ti:",
    "",
    lines.join("\n\n"),
    "",
    "Para comprar, abre el enlace de WhatsApp del producto que deseas.",
  ].join("\n");
};

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "El mensaje es obligatorio.",
      });
    }

    const text = String(message).trim();
    const normalizedText = normalizeText(text);

    if (
      ["hola", "buenas", "saludos", "info", "informacion"].some((word) =>
        normalizedText.includes(word)
      )
    ) {
      return res.json({
        success: true,
        answer: buildWelcomeMessage(),
        products: [],
      });
    }

    if (
      normalizedText.includes("pago") ||
      normalizedText.includes("metodo") ||
      normalizedText.includes("transferencia")
    ) {
      return res.json({
        success: true,
        answer: buildPaymentMessage(),
        products: [],
      });
    }

    if (
      normalizedText.includes("envio") ||
      normalizedText.includes("entrega") ||
      normalizedText.includes("delivery")
    ) {
      return res.json({
        success: true,
        answer: buildShippingMessage(),
        products: [],
      });
    }

    if (
      normalizedText.includes("servicio") ||
      normalizedText.includes("instalacion") ||
      normalizedText.includes("cctv") ||
      normalizedText.includes("redes") ||
      normalizedText.includes("electrico") ||
      normalizedText.includes("web")
    ) {
      return res.json({
        success: true,
        answer: buildServicesMessage(),
        products: [],
      });
    }

    const words = cleanSearchWords(text);

    const searchConditions = words.length
      ? words.flatMap((word) => [
          { name: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
        ])
      : [
          { name: { $regex: text, $options: "i" } },
          { description: { $regex: text, $options: "i" } },
          { category: { $regex: text, $options: "i" } },
        ];

    const products = await Product.find({
      $or: searchConditions,
    })
      .limit(6)
      .lean();

    if (products.length === 0) {
      return res.json({
        success: true,
        answer: buildNoProductsMessage(),
        products: [],
      });
    }

    return res.json({
      success: true,
      answer: buildProductResponse(products),
      products,
    });
  } catch (error) {
    console.error("Error en asistente básico Global-GS:", error);

    return res.status(500).json({
      success: false,
      message: "Error procesando el mensaje del asistente.",
      error: error.message,
    });
  }
});

export default router;