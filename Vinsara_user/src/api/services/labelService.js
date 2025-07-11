import apiClient from "../client";

export const labelService = {
  getAllLabels: async () => {
    const response = await apiClient.get("/label/getlabels");
    return response.data;
  },
  getGroupLabels: async () => {
    const response = await apiClient.get("/label/group-labels");
    return response.data;
  },
};
