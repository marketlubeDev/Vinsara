import apiClient from "../client";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cartService = {
  // Get cart items
  getCart: async () => {
    await delay(1000); // 1 second delay
    const response = await apiClient.get("/cart/get-cart");
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, variantId = null, quantity = 1) => {
    await delay(800); // 0.8 second delay
    const response = await apiClient.post("/cart/add-to-cart", {
      productId,
      variantId,
      quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateQuantity: async (productId, variantId, action) => {
    await delay(500); // 0.5 second delay
    const response = await apiClient.patch(`/cart/update-cart-quantity`, {
      productId,
      variantId,
      action,
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId, variantId) => {
    await delay(800); // 0.8 second delay
    const response = await apiClient.delete(`/cart/remove-from-cart`, {
      data: { productId, variantId },
    });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    await delay(1000); // 1 second delay
    const response = await apiClient.delete("/cart");
    return response.data;
  },
};

export default cartService;
