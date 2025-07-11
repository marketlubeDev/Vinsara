import React, { useEffect, useMemo, useState, Suspense, lazy } from "react";
import Carousel from "../../components/Carousel";
import ExclusiveSale from "./components/ExclusiveSale";
import ProductBanner from "../Homepage/components/ProductBanner";
import { useBanners } from "../../hooks/queries/banner";
import { useParams } from "react-router-dom";
import { useBrand } from "../../hooks/queries/brands";
import LoadingSpinner from "../../components/LoadingSpinner";

// Lazy load the ShopByCategory component
const ShopByCategory = lazy(() => import("./components/ShopByCategory"));

export default function BrandPage() {
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  
  const { 
    brand, 
    isLoading: brandLoading, 
    error: brandError 
  } = useBrand(id);

  // Memoize the brand data to prevent unnecessary re-renders
  const brandData = useMemo(() => [{
    image: isMobile ? brand?.brand?.mobileBannerImage : brand?.brand?.bannerImage
  }], [brand?.brand?.bannerImage, brand?.brand?.mobileBannerImage, isMobile]);

  useEffect(() => {
    // Debounced resize handler
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 150);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle loading state
  if (brandLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (brandError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h2>Error loading content</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div>
      <Carousel 
        data={brandData} 
        maxHeight={"30rem"} 
        isBrand={true} 
      />
      <Suspense fallback={
        <div style={{ 
          minHeight: '400px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <LoadingSpinner />
        </div>
      }>
        <ShopByCategory id={id} />
      </Suspense>
    </div>
  );
}
