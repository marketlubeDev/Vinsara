import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponService } from "../../api/services/couponService";
import { toast } from "sonner";

export const useGetCoupons = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponService.getCoupons,
  });
  return { data, isLoading, error };
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (couponId) => couponService.applyCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Coupon applied successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    },
  });
  return { mutate, isLoading };
};

// Remove coupon mutation
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: couponService.removeCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Coupon removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove coupon");
    },
  });
  return { mutate, isLoading };
};
