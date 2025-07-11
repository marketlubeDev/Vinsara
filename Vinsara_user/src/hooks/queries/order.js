import { useMutation, useQuery } from "@tanstack/react-query";
import orderService from "../../api/services/orderServices";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (data) => orderService.placeOrder(data),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to place order");
      return false;
    },
  });
};

export const useGetOrderHistory = () => {
  return useQuery({
    queryKey: ["order-history"],
    queryFn: () => orderService.getOrderHistory(),
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to get order history"
      );
    },
  });
};
