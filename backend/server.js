import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/whatsapp", whatsappRoutes);

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
