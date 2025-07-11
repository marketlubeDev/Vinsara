import React, { useState } from "react";
import Logo from "../Logo";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../sevices/adminApis";
import { toast } from "react-toastify";
import { storeLogin } from "../../sevices/storeApis";
import { useDispatch } from "react-redux";
import { setStore } from "../../redux/features/storeSlice";

function LoginComponent({ role }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: "", password: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState(role); // default to admin login
  const navigate = useNavigate();

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onlogin = async () => {
    const { email, password, phone } = values;
    if (loginType === "admin" && (!email || !password)) {
      return toast.error("All fields are required");
    }
    if (loginType === "store" && (!phone || !password)) {
      return toast.error("All fields are required");
    }

    setIsLoading(true);
    try {
      if (loginType === "admin") {
        const res = await adminLogin(values);

        dispatch(setStore({}));
        toast.success(res?.data?.message);
        localStorage.setItem("adminToken", res?.data?.token);
        navigate("/admin");
      } else {
        // TODO: Implement store login
        const res = await storeLogin(values);
        toast.success(res?.message);
        localStorage.setItem("storeToken", res?.token);
        dispatch(setStore(res?.store));
        navigate("/store");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      onlogin();
    }
  };

  return (
    <div className="h-screen flex items-center w-full">
      <div className="w-1/2 bg-[#FFF2AE] h-full hidden md:flex  items-center justify-center">
        <img src="/images/logo.png" alt="logo image" className="w-[40rem]" />
      </div>
      <div className="w-full md:w-1/2 flex justify-center p-3 md:p-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome Back!
            </h1>
            <form className="space-y-4 md:space-y-6" onKeyDown={handleKeyPress}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {loginType === "admin" ? "Your email" : "Phone number"}
                </label>
                <input
                  required
                  type={loginType === "admin" ? "email" : "tel"}
                  name={loginType === "admin" ? "email" : "phone"}
                  id={loginType === "admin" ? "email" : "phone"}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={
                    loginType === "admin"
                      ? "name@company.com"
                      : "Enter phone number"
                  }
                  onChange={onChange}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={onChange}
                  disabled={isLoading}
                />
              </div>
              {/* <div className="flex items-center justify-center">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div> */}

              <button
                type="button"
                className={`text-white w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={onlogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
