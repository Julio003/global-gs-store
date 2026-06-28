import Cart from "../models/Cart.js";

export const addProductToCart = async (phone, product, quantity = 1) => {
  let cart = await Cart.findOne({ customerPhone: phone });

  if (!cart) {
    cart = await Cart.create({
      customerPhone: phone,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === product._id.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      priceAtMoment: product.price,
      image: product.image || "",
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getCart = async (phone) => {
  return await Cart.findOne({
    customerPhone: phone,
  });
};

export const removeProductFromCart = async (phone, productId) => {
  const cart = await Cart.findOne({
    customerPhone: phone,
  });

  if (!cart) {
    return null;
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  await cart.save();

  return cart;
};

export const clearCart = async (phone) => {
  return await Cart.findOneAndUpdate(
    { customerPhone: phone },
    { items: [] },
    { new: true }
  );
};

export const getCartSummary = async (phone) => {
  const cart = await getCart(phone);

  if (!cart || cart.items.length === 0) {
    return "🛒 Tu carrito está vacío.";
  }

  let total = 0;

  const lines = cart.items.map((item, index) => {
    const subtotal = item.priceAtMoment * item.quantity;

    total += subtotal;

    return `${index + 1}. ${item.name}
Cantidad: ${item.quantity}
Subtotal: RD$${subtotal.toLocaleString("es-DO")}`;
  });

  return [
    "🛒 *Tu carrito Global GS*",
    "",
    ...lines,
    "",
    `💰 Total: RD$${total.toLocaleString("es-DO")}`,
    "",
    "Escribe *confirmar compra* para finalizar el pedido.",
  ].join("\n");
};