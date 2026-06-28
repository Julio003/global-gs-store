import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    priceAtMoment: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerPhone: {
      type: String,
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      default: "",
    },

    deliveryZone: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);