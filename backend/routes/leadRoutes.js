import express from "express";
import Lead from "../models/Lead.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const leads = await Lead.find({})
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

    res.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Error cargando leads:", error);
    res.status(500).json({
      success: false,
      message: "No se pudieron cargar los clientes interesados.",
    });
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = ["new", "interested", "ready_to_buy", "contacted", "closed"];
    const status = String(req.body.status || "").trim();

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Estado de lead no valido.",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "No encontre ese cliente interesado.",
      });
    }

    res.json({
      success: true,
      message: "Cliente actualizado correctamente.",
      lead,
    });
  } catch (error) {
    console.error("Error actualizando lead:", error);
    res.status(500).json({
      success: false,
      message: "No se pudo actualizar el cliente interesado.",
    });
  }
});

export default router;
