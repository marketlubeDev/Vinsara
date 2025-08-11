import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/queries/auth";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { storeRedirectPath } from "../../utils/redirectUtils";
import FacebookLoginButton from "../../components/FacebookLoginButton";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();

  const { mutate: loginMutation, isPending: isLoading } = useLogin();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Store redirect path if it comes from state or if no redirect path is already stored
    const storedRedirectPath = localStorage.getItem("redirectAfterLogin");

    if (location.state?.from && !storedRedirectPath) {
      storeRedirectPath(location.state.from);
    } else if (document.referrer && !storedRedirectPath) {
      // If user came from another page within the same domain, store that as redirect path
      const referrerUrl = new URL(document.referrer);
      const currentUrl = new URL(window.location.href);

      if (
        referrerUrl.origin === currentUrl.origin &&
        referrerUrl.pathname !== "/login"
      ) {
        storeRedirectPath(referrerUrl.pathname + referrerUrl.search);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <p className="login-subtitle">
          Log in to manage your account and orders.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Continue"}
          </button>

          <div className="terms-text">
            By continuing, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> &{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <GoogleLoginButton className="google-login-btn" />
        <FacebookLoginButton className="facebook-login-btn" />
      </div>
    </div>
  );
};

export default Login;
