import apiClient from "../client";

export const feedbackService = {
  submitFeedback: async (feedback) => {
    const response = await apiClient.post("/feedback/submit-feedback", feedback);
    return response.data;
  },
};
