import { axiosInstance } from "../axios/axiosInstance";

export const getAllReviews = async () => {
  const response = await axiosInstance.get("/review/get-all-reviews");
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(
    `/review/delete-review/${reviewId}`
  );
  return response.data;
};
