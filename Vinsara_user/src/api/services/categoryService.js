import apiClient from "../client";

export const categoryService = {
  getAllCategories: async (filters = {}) => {
    const response = await apiClient.get("/category/allcategories");
    return response.data;
  },
};
