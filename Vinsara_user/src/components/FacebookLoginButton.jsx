import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useFacebookLogin } from "../hooks/queries/facebookAuth";

const FacebookLoginButton = ({
  className = "",
  children,
  onSuccess,
  onError,
}) => {
  const facebookLoginMutation = useFacebookLogin(onSuccess, onError);
  const isLoading = facebookLoginMutation.isPending;

  const handleFacebookResponse = (response) => {
    console.log(response, "response");

    if (response.accessToken) {
      // Extract user info from Facebook response
      const userInfo = {
        id: response.userID,
        name: response.name,
        email: response.email,
        picture: response.picture?.data?.url,
      };

      // Call our backend API
      facebookLoginMutation.mutate({
        accessToken: response.accessToken,
        userInfo,
      });
    } else {
      console.error("Facebook login failed:", response);
      if (onError) {
        onError(new Error("Facebook login failed"));
      }
    }
  };

  return (
    <FacebookLogin
      appId="545878321879765"
      fields="name,email,picture"
      scope="public_profile,email"
      callback={handleFacebookResponse}
      render={(renderProps) => (
        <button
          type="button"
          onClick={renderProps.onClick}
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
      )}
    />
  );
};

export default FacebookLoginButton;
