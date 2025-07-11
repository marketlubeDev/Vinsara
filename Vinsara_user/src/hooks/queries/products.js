import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/services/productService";
import apiClient from "../../api/client";

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    retry: 1,
    retryDelay: 1000,
  });
}

async function getProducts(filters) {
  const params = new URLSearchParams();

  // Add pagination params
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);

  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.subcategoryId)
    params.append("subcategoryId", filters.subcategoryId);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.labelId) params.append("labelId", filters.labelId);
  if (filters.brandId) params.append("brandId", filters.brandId);
  if (filters.offerId) params.append("offerId", filters.offerId);

  if (filters.sort) {
    switch (filters.sort) {
      case "newest":
        params.append("sort", "createdAt");
        break;
      case "price-low":
        params.append("sort", "price-low");
        break;
      case "price-high":
        params.append("sort", "price-high");
        break;
      default:
        params.append("sort", "createdAt");
    }
  }

  try {
    const url = `/product/get-products?${params.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    if (error.response?.status === 500) {
      throw new Error(
        "Server error while fetching products. Please try again later."
      );
    }
    throw error;
  }
}

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
  });
};

export const useSearchProducts = (keyword) => {
  return useQuery({
    queryKey: ["searchProducts", keyword],
    queryFn: () => productService.searchProducts(keyword),
  });
};
