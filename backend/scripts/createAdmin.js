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

    const hashedPassword = await bcrypt.hash("Admin12345", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Usuario admin creado correctamente");
    console.log("Usuario: admin");
    console.log("Contraseña: Admin12345");

    process.exit();
  } catch (error) {
    console.error("Error creando admin:", error.message);
    process.exit(1);
  }
};

createAdmin();