import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/client";

export const useBanners = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["banners"],
    queryFn: () => apiClient.get("/banner"),
  });
  const allBanners = data?.data?.data;
  return { allBanners, isLoading, error };
};
