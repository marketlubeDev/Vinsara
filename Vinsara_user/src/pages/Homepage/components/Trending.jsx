import React, { useRef } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import Card from "../../../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";

function Trending() {
  const scrollContainerRef = useRef(null);
  const {
    data: response,
    isLoading,
    error,
  } = useProducts({
    labelId: "67e6441c1befacf37ff60151",
  });
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const trendingProducts = response?.data?.products || [];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 768;

      const cardWidth = isMobile
        ? container.offsetWidth
        : (container.offsetWidth - 2 * 24) / 3;

      const currentScroll = container.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - cardWidth - 24
          : currentScroll + cardWidth + 24;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel: { _id: "67e6441c1befacf37ff60151", name: "Trending" },
      },
    });
  };

  return (
    <section
      className="trending-container"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="trending-header">
        <div className="trending-content">
          <h2>
            Trending <span>This Week</span>
          </h2>
        </div>
        <p onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </p>
      </div>

      <div className="trending-products-wrapper">
        <button
          className="scroll-button scroll-left"
          onClick={() => scroll("left")}
        >
          <FiArrowLeft />
        </button>
        <div className="trending-products" ref={scrollContainerRef}>
          {trendingProducts.map((product) => (
            <Card key={product?._id} product={product} />
          ))}
        </div>
        <button
          className="scroll-button scroll-right"
          onClick={() => scroll("right")}
        >
          <FiArrowRight />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <p onClick={handleViewAll} className="view-all mobile-view-all">
          View All <ViewAllIcon />
        </p>
      </div>
    </section>
  );
}

export default Trending;
