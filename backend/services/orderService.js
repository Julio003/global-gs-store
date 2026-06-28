import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrderFromCart = async (phone) => {
  const cart = await Cart.findOne({
    customerPhone: phone,
  });

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const total = cart.items.reduce((sum, item) => {
    return sum + item.priceAtMoment * item.quantity;
  }, 0);

  const order = await Order.create({
    customerPhone: phone,
    items: cart.items,
    total,
    status: "pending",
  });

  cart.items = [];
  await cart.save();

  return order;
};