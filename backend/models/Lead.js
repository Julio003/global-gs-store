import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["whatsapp", "instagram", "facebook", "web"],
      default: "whatsapp",
    },
    customerPhone: { type: String, required: true },
    customerName: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "interested", "ready_to_buy", "contacted", "closed"],
      default: "new",
    },
    product: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, default: "" },
      price: { type: Number, default: 0 },
      category: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    conversation: [
      {
        direction: {
          type: String,
          enum: ["incoming", "outgoing"],
          required: true,
        },
        text: { type: String, required: true },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
