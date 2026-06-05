import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
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

export default router;
