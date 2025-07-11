import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCheckAuth } from "../../hooks/queries/auth";
import LoadingSpinner from "../LoadingSpinner";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const { data, isLoading, error } = useCheckAuth();

  useEffect(() => {
    if (!localStorage.getItem("user-auth-token")) {
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user-auth-token");
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
