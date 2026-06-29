import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => value.length <= 7,
        message: "Un producto puede tener hasta 7 imágenes",
      },
    },
    video: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;