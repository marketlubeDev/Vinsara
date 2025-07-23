import { useMutation } from "@tanstack/react-query";
import { googleAuthService } from "../../api/services/googleAuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setIsLoggedIn } from "../../redux/features/user/userSlice";
import { handleRedirectAfterLogin } from "../../utils/redirectUtils";

export const useGoogleLogin = (onSuccess, onError) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ accessToken, userInfo }) =>
      googleAuthService.googleLogin(accessToken, userInfo),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("user-auth-token", data.token);

      // Update Redux state
      dispatch(setUser(data.content?.user));
      dispatch(setIsLoggedIn(true));

      // Show success message
      toast.success("Google login successful");

      // Handle redirect
      handleRedirectAfterLogin(navigate);

      // Call custom onSuccess if provided
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Google login failed");

      // Call custom onError if provided
      if (onError) onError(error);
    },
  });
};
