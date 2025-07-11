import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../api/services/categoryService";
import apiClient from "../../api/client";

export const useCategories = (filters = {}) => {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategories(filters),
  });
};

async function getCategories(filters) {
  const params = new URLSearchParams();
  if (filters.brandId) params.append("brandId", filters.brandId);
  const response = await apiClient.get("/category/allcategories", { params });
  return response.data;
}
