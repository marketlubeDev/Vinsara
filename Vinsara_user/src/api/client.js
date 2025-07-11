import axios from "axios";
import { NetworkError } from "../utils/errors.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or server not responding
      throw new NetworkError(
        "Unable to connect to server. Please check your internet connection."
      );
    }
    if (error.response.status === 401) {
      localStorage.removeItem("user-auth-token");
      // window.location.href = "/login";
    }
    throw error;
  }
);

export default apiClient;
