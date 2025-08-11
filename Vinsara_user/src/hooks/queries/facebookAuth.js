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
    mutationFn: ({ accessToken, userInfo }) =>
      facebookAuthService.facebookLogin(accessToken, userInfo),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("user-auth-token", data.token);

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
      toast.error(error.response?.data?.message || "Facebook login failed");

      // Call custom onError if provided
      if (onError) onError(error);
    },
  });
};
