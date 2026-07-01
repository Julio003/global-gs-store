import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 7,
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
      return callback(new Error("Tipo de archivo no permitido"));
    }

    callback(null, true);
  },
});

const uploadBufferToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "global-gs-store",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

const uploadVideoToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "global-gs-store/videos",
        resource_type: "video",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

router.use(requireAuth, requireAdmin);

router.post("/", upload.array("image", 7), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ninguna imagen",
      });
    }

    const results = await Promise.all(req.files.map(uploadBufferToCloudinary));
    const imageUrls = results.map((result) => result.secure_url);

    res.json({
      success: true,
      imageUrl: imageUrls[0],
      imageUrls,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);

    res.status(500).json({
      success: false,
      message: "Error subiendo imagen",
    });
  }
});

router.post("/video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ningún video",
      });
    }

    const result = await uploadVideoToCloudinary(req.file);

    res.json({
      success: true,
      videoUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error subiendo video:", error);

    res.status(500).json({
      success: false,
      message: "Error subiendo video",
    });
  }
});

export default router;
