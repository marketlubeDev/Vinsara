import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/error/ErrorFallback";
import Userlayout from "../Layout/Userlayout";
import Homepage from "../pages/Homepage/Homepage";
import AllProducts from "../pages/productpage/Allproducts";
import ProductDetails from "../pages/productpage/ProductDetails";
import BrandPage from "../pages/BrandPage/BrandPage";
import { BrandListing } from "../pages/BrandPage/BrandListing";
import Login from "../pages/Loginpage/Login";
import { Verification } from "../pages/OTP/Verification";
import Cartpage from "../pages/cartPage/cartPage";
import PaymentSuccess from "../pages/payment/PaymentSuccess";

const error = new Error("Page Not Found", { cause: 404 });

// Create a wrapper component for ErrorBoundary
const WithErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.location.reload();
    }}
    onError={(error, info) => {
      console.error("Error caught by boundary:", error, info);
    }}
  >
    {children}
  </ErrorBoundary>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Userlayout />,
    errorElement: <ErrorFallback error={error} />,
    children: [
      {
        path: "/login",
        element: <WithErrorBoundary>
          <Login />
        </WithErrorBoundary>
      },
      {
        path: "/otp",
        element: (
          <WithErrorBoundary>
            <Verification />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/",
        element: (
          <WithErrorBoundary>
            <Homepage />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/products",
        element: (
          <WithErrorBoundary>
            <AllProducts />
          </WithErrorBoundary>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <WithErrorBoundary>
            <ProductDetails />
          </WithErrorBoundary>
        ),
      },

      {
        path: "/cart",
        element: (
          <WithErrorBoundary>
            <Cartpage />
          </WithErrorBoundary>
        )
      },
      {
        path: "/payment-success",
        element: (
          <WithErrorBoundary>
            <PaymentSuccess />
          </WithErrorBoundary>
        )
      }
    ],
  },
]);

export default router;
