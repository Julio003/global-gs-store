import assistantRoutes from "./routes/assistantRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
dotenv.config();


const app = express();

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "https://globalgsstore.com,https://www.globalgsstore.com,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
  })
);
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buffer) => {
      req.rawBody = buffer;
    },
  })
);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/leads", leadRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado correctamente");
  })
  .catch((error) => {
    console.error("Error conectando MongoDB:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Global-GS Backend funcionando correctamente",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
