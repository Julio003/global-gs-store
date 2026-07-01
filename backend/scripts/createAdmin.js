import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      console.log("El usuario admin ya existe");
      process.exit();
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || adminPassword.length < 12) {
      console.error("Define ADMIN_PASSWORD en .env con minimo 12 caracteres");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Usuario admin creado correctamente");
    console.log("Usuario: admin");
    console.log("Contraseña: definida en ADMIN_PASSWORD");

    process.exit();
  } catch (error) {
    console.error("Error creando admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
