import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/client";

export const useActiveOffers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["activeOffers"],
    queryFn: () => apiClient.get("/offer"),
  });
  const activeOffers = data?.data?.data;
  return { activeOffers, isLoading, error };
};
