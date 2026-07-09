import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { searchProducts } from "../services/productSearchService.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const sanitizeProductPayload = (body) => {
  const image = String(body.image || "").trim();
  const rawImages = Array.isArray(body.images) ? body.images : [];
  const images = [image, ...rawImages]
    .map((url) => String(url || "").trim())
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
    .slice(0, 7);

  const payload = {
    name: String(body.name || "").trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price),
    category: String(body.category || "").trim(),
    image,
    images,
    video: String(body.video || "").trim(),
    stock: Number(body.stock),
  };

  if (!payload.name) {
    return { error: "El nombre del producto es obligatorio." };
  }

  if (!payload.description) {
    return { error: "La descripcion del producto es obligatoria." };
  }

  if (!payload.category) {
    return { error: "La categoria del producto es obligatoria." };
  }

  if (!payload.image) {
    return { error: "La imagen principal del producto es obligatoria." };
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return { error: "El precio debe ser un numero valido." };
  }

  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    return { error: "El stock debe ser un numero valido." };
  }

  return { payload };
};

const sendProductError = (res, error, fallbackMessage) => {
  console.error(fallbackMessage, error);

  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)?.[0]?.message || fallbackMessage;
    return res.status(400).json({ success: false, message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "El ID del producto no es valido.",
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    sendProductError(res, error, "Error cargando productos.");
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const limit = Number(req.query.limit || 5);

    if (!query) {
      return res.json([]);
    }

    const products = await searchProducts(query, limit);
    res.json(products);
  } catch (error) {
    sendProductError(res, error, "Error buscando productos.");
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { payload, error } = sanitizeProductPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const product = await Product.create(payload);

    res.status(201).json({
      success: true,
      message: "Producto guardado correctamente.",
      product,
    });
  } catch (error) {
    sendProductError(res, error, "No se pudo guardar el producto.");
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El ID del producto no es valido.",
      });
    }

    const { payload, error } = sanitizeProductPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No encontre ese producto para actualizar.",
      });
    }

    res.json({
      success: true,
      message: "Producto actualizado correctamente.",
      product,
    });
  } catch (error) {
    sendProductError(res, error, "No se pudo actualizar el producto.");
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El ID del producto no es valido.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No encontre ese producto para eliminar.",
      });
    }

    res.json({ success: true, message: "Producto eliminado correctamente." });
  } catch (error) {
    sendProductError(res, error, "No se pudo eliminar el producto.");
  }
});

export default router;
