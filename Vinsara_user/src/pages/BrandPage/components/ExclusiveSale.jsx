import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../../../components/Card";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";
function ExclusiveSale({ id }) {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const { data: response, isLoading, error } = useProducts({ brandId: id });
  const productslists = response?.data?.products
    ? response?.data?.products
    : [];


  useEffect(() => {
    setProducts(productslists);
  }, [productslists]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 768;

      // Calculate card width including gap
      const cardWidth = isMobile
        ? container.offsetWidth
        : (container.offsetWidth - 2 * 24) / 3; // 3 cards with 1.5rem (24px) gap

      // Calculate scroll position
      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - cardWidth - 24 // subtract gap
          : currentScroll + cardWidth + 24; // add gap

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="exclusive-sale-container" data-aos="fade-up">
      <div className="exclusive-sale-header">
        <div className="exclusive-sale-content">
          <h2 className="exclusive-sale-content_h2">
            Exclusive <span className="exclusive-sale-content_span">sale</span>
          </h2>
          {/* <p className="exclusive-sale-content_p">
            Get amazing deals on our top-rated products
          </p> */}
        </div>
        <Link to="/products" className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="exclusive-sale-products-wrapper">
          <button
            className="scroll-button scroll-left"
            onClick={() => scroll("left")}
          >
            <FiArrowLeft />
          </button>
          <div className="exclusive-sale-products" ref={scrollContainerRef}>
            {products?.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
          <button
            className="scroll-button scroll-right"
            onClick={() => scroll("right")}
          >
            <FiArrowRight />
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          No products found
        </div>
      )}
      <Link to="/products" className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </Link>
    </div>
  );
}

export default ExclusiveSale;
