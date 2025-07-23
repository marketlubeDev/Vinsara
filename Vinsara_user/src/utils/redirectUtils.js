// Utility functions for handling redirect paths

export const storeRedirectPath = (path) => {
  try {

    // Don't store login/signup paths
    if (path === "/login" || path === "/signup") {
      return false;
    }

    // Store the path
    localStorage.setItem("redirectAfterLogin", path);

    // Verify storage
    const stored = localStorage.getItem("redirectAfterLogin");

    return stored === path;
  } catch (error) {
    console.error("Error storing redirect path:", error);
    return false;
  }
};

export const getRedirectPath = () => {
  try {
    const path = localStorage.getItem("redirectAfterLogin");
    return path;
  } catch (error) {
    console.error("Error getting redirect path:", error);
    return null;
  }
};

export const clearRedirectPath = () => {
  try {
    const path = localStorage.getItem("redirectAfterLogin");
    localStorage.removeItem("redirectAfterLogin");
    return true;
  } catch (error) {
    console.error("Error clearing redirect path:", error);
    return false;
  }
};

export const handleRedirectAfterLogin = (navigate) => {
  const redirectPath = getRedirectPath();

  if (redirectPath && redirectPath !== "/login" && redirectPath !== "/signup") {
    clearRedirectPath();
    navigate(redirectPath);
    return true;
  } else {
    navigate("/");
    return false;
  }
};
