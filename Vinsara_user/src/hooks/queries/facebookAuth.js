import { useMutation } from "@tanstack/react-query";
import { facebookAuthService } from "../../api/services/facebookAuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setIsLoggedIn } from "../../redux/features/user/userSlice";
import { handleRedirectAfterLogin } from "../../utils/redirectUtils";

export const useFacebookLogin = (onSuccess, onError) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ accessToken, userInfo }) => {
      console.log("Calling Facebook auth service with:", {
        accessToken,
        userInfo,
      });
      return facebookAuthService.facebookLogin(accessToken, userInfo);
    },
    onSuccess: (data) => {
      console.log("Facebook login successful, received data:", data);
      // Store token
      localStorage.setItem("user-auth-token", data.token);
      console.log(data, "data");

      // Update Redux state
      dispatch(setUser(data.content?.user));
      dispatch(setIsLoggedIn(true));

      // Show success message
      toast.success("Facebook login successful");

      // Handle redirect
      handleRedirectAfterLogin(navigate);

      // Call custom onSuccess if provided
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error("Facebook login error:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Facebook login failed");

      // Call custom onError if provided
      if (onError) onError(error);
    },
  });
};
