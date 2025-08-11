import apiClient from "../client";

export const facebookAuthService = {
  /**
   * Authenticate user with Facebook access token and user info
   * @param {string} accessToken - Facebook access token
   * @param {Object} userInfo - Facebook user info
   * @returns {Promise<Object>} Authentication response
   */
  facebookLogin: async (accessToken, userInfo) => {
    const response = await apiClient.post("/user/facebook-login", {
      accessToken,
      userInfo,
    });
    return response.data;
  },
};
