  import apiClient from "../client";

  export const brandService = {
    getAllBrands: async () => {
      const response = await apiClient.get("/brand");
      return response.data;
    },
  };
