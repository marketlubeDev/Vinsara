import apiClient from "../client";

const orderService = {
  placeOrder: async (data) => {
    const response = await apiClient.post("/order/placeorder", data);
    return response.data;
  },
  getOrderHistory: async () => {
    const response = await apiClient.get("/order/get-user-orders");
    return response.data;
  },
};

export default orderService;
