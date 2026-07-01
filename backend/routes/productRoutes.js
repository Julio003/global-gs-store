import express from "express";
import Product from "../models/Product.js";
import { searchProducts } from "../services/productSearchService.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  const limit = Number(req.query.limit || 5);

  if (!query) {
    return res.json([]);
  }

  const products = await searchProducts(query, limit);
  res.json(products);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(product);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ message: "Producto eliminado" });
});

export default router;
