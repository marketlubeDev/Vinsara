import apiClient from "../client";

export const googleAuthService = {
  /**
   * Authenticate user with Google access token and user info
   * @param {string} accessToken - Google access token
   * @param {Object} userInfo - Google user info
   * @returns {Promise<Object>} Authentication response
   */
  googleLogin: async (accessToken, userInfo) => {
    const response = await apiClient.post("/user/google-login", {
      accessToken,
      userInfo,
    });
    return response.data;
  },
};
