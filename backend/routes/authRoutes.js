import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Demasiados intentos de login. Intenta de nuevo en 15 minutos.",
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET no esta configurado",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login correcto",
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    });
    } catch (error) {
    console.error("Error real en login:", error);

    res.status(500).json({
      success: false,
      message: "Error en el login",
    });
  }
});

export default router;
