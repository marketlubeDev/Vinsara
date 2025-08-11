import React, { useEffect } from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useFacebookLogin } from "../hooks/queries/facebookAuth";

// Load Facebook SDK manually
function loadFacebookSDK() {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = function () {
      console.log("Facebook SDK initializing...");
      window.FB.init({
        appId: "545878321879765",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });

      window.FB.AppEvents.logPageView();
      console.log("Facebook SDK initialized successfully");
      resolve();
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        console.log("Facebook SDK script already exists");
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = function () {
        console.error("Failed to load Facebook SDK script");
      };
      fjs.parentNode.insertBefore(js, fjs);
      console.log("Facebook SDK script injected");
    })(document, "script", "facebook-jssdk");

    // Also set a timeout to check if SDK loaded
    setTimeout(() => {
      if (!window.FB) {
        console.error("Facebook SDK failed to initialize after 5 seconds");
      }
    }, 5000);
  });
}

// Initialize on load
if (typeof window !== "undefined") {
  loadFacebookSDK();
}

const FacebookLoginButton = ({
  className = "",
  children,
  onSuccess,
  onError,
}) => {
  const facebookLoginMutation = useFacebookLogin(onSuccess, onError);
  const isLoading = facebookLoginMutation.isPending;

  // Ensure Facebook SDK is loaded when component mounts
  useEffect(() => {
    loadFacebookSDK()
      .then(() => {
        console.log("Facebook SDK loaded in component");
      })
      .catch((error) => {
        console.error("Failed to load Facebook SDK:", error);
      });
  }, []);

  // This warning about overriding access token is expected when using
  // react-facebook-login with other Facebook SDKs on the page.
  // It's safe to ignore as we're passing the token directly to our API.

  const handleFacebookResponse = (response) => {
    // Handle different response statuses
    if (response.status === "unknown") {
      console.error("User cancelled login or did not fully authorize.");
      return;
    }

    if (response.status === "not_authorized") {
      console.error(
        "User is logged into Facebook but has not authorized the app."
      );
      return;
    }

    // Check different possible response formats
    const accessToken =
      response.accessToken || response.authResponse?.accessToken;
    const userID =
      response.userID || response.id || response.authResponse?.userID;

    if (accessToken) {
      // Extract user info from Facebook response
      const userInfo = {
        id: userID,
        name: response.name,
        email: response.email || `${userID}@facebook.com`, // Fallback email if not provided
        picture: response.picture, // Send the entire picture object
      };

      // Call our backend API
      facebookLoginMutation.mutate({
        accessToken: accessToken,
        userInfo,
      });
    } else {
      console.error("Facebook login failed:", response);
      if (onError) {
        onError(new Error("Facebook login failed - no access token"));
      }
    }
  };

  // Determine which permissions to request based on environment
  // Note: 'email' permission requires app review for production apps
  // During development, it works for app admins, developers, and testers only

  const scope = "public_profile,email";
  const fields = "name,email,picture";

  // Manual Facebook login function
  const handleManualFacebookLogin = async () => {
    if (!window.FB) {
      await loadFacebookSDK();
    }

    if (!window.FB) {
      console.error("Failed to load Facebook SDK!");
      return;
    }

    window.FB.getLoginStatus((response) => {
      if (response.status === "connected") {
        // Already logged in

        window.FB.api("/me", { fields: fields }, (userInfo) => {
          console.log("User info:", userInfo);
          handleFacebookResponse({
            ...response.authResponse,
            ...userInfo,
            status: response.status,
          });
        });
      } else {
        // Not logged in, show login dialog
        console.log("Not connected, showing login dialog...");
        window.FB.login(
          (loginResponse) => {
            console.log("Login response:", loginResponse);
            if (loginResponse.authResponse) {
              window.FB.api("/me", { fields: fields }, (userInfo) => {
                console.log("User info after login:", userInfo);
                handleFacebookResponse({
                  ...loginResponse.authResponse,
                  ...userInfo,
                  status: loginResponse.status,
                });
              });
            }
          },
          { scope: scope }
        );
      }
    });
  };

  // Temporary: Use manual login button for testing
  const useManualLogin = true;

  if (useManualLogin) {
    return (
      <>
        <div id="fb-root"></div>
        <button
          type="button"
          onClick={handleManualFacebookLogin}
          disabled={isLoading}
          className={`facebook-login-button ${className}`}
        >
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            children || (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                <span>Continue with Facebook</span>
              </>
            )
          )}
        </button>
      </>
    );
  }

  return (
    <FacebookLogin
      appId="545878321879765"
      fields={fields}
      scope={scope}
      callback={(response) => {
        console.log("Facebook callback triggered with response:", response);
        handleFacebookResponse(response);
      }}
      onFailure={(error) => {
        console.error("Facebook SDK error:", error);
        if (onError) onError(error);
      }}
      disableMobileRedirect={true}
      isMobile={false}
      version="v18.0"
      xfbml={false}
      cookie={false}
      autoLoad={false}
      returnScopes={true}
      render={(renderProps) => {
        console.log("Facebook render props:", renderProps);
        return (
          <button
            type="button"
            onClick={() => {
              console.log("Facebook button clicked!");
              console.log("RenderProps onClick:", renderProps.onClick);
              console.log("Is button disabled?", renderProps.isDisabled);

              // Check if Facebook SDK is loaded
              if (window.FB) {
                console.log("Facebook SDK is loaded");
                console.log("FB SDK version:", window.FB.version);
              } else {
                console.error("Facebook SDK is NOT loaded!");
              }

              try {
                console.log("Calling renderProps.onClick()...");
                renderProps.onClick();
                console.log("renderProps.onClick() called successfully");

                // Add a manual FB.login call as backup
                setTimeout(() => {
                  if (window.FB && !window.fbLoginInProgress) {
                    console.log("Attempting manual FB.login...");
                    window.fbLoginInProgress = true;
                    window.FB.login(
                      (response) => {
                        window.fbLoginInProgress = false;
                        console.log("Manual FB.login response:", response);
                        if (response.authResponse) {
                          console.log(
                            "Got authResponse, calling handleFacebookResponse"
                          );
                          handleFacebookResponse({
                            ...response.authResponse,
                            status: response.status,
                          });
                        }
                      },
                      { scope: "public_profile,email" }
                    );
                  }
                }, 100);
              } catch (error) {
                console.error("Error calling Facebook login:", error);
              }
            }}
            disabled={isLoading || renderProps.isDisabled}
            className={`facebook-login-button ${className}`}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              children || (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      fill="#1877F2"
                    />
                  </svg>
                  <span>Continue with Facebook</span>
                </>
              )
            )}
          </button>
        );
      }}
    />
  );
};

export default FacebookLoginButton;
