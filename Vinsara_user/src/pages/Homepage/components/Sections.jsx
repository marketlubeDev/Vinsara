import React, { useRef } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import Card from "../../../components/Card";
import { useNavigate } from "react-router-dom";

export default function Sections({ label }) {
  const navigate = useNavigate();
  
  const scrollContainerRef = useRef(null);
  if(label?.products?.length === 0) return null

  // if(label?.label === "Best Sellers") return null
  // if(label?.label === "clearence") return null
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 768;

      // Get the actual card width from the first product card
      const cardElement = container.querySelector('.product-card');
      const cardWidth = cardElement ? cardElement.offsetWidth : 0;
      const gap = 24; // 1.5rem gap

      // Calculate scroll amount based on actual card width
      const scrollAmount = cardWidth + gap;

      // Calculate scroll position
      const currentScroll = container.scrollLeft;
      const targetScroll = direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            currentScroll + scrollAmount
          );

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };


  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel:{ _id: label?.label?.id, name: label?.label?.name }
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
            {label?.label?.name?.split(' ').map((word, index, array) => (
              <span key={index} style={{color: index === array.length - 1 && index !== 0 ? '#2eb5af' : 'black'}}>
                {word.charAt(0).toUpperCase() + word.slice(1)}{' '}
              </span>
            ))}
          </h2>
        </div>
        <p className="view-all desktop-view-all" onClick={handleViewAll}>
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
          {label?.products?.map((product) => (
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
        <p className="view-all mobile-view-all" onClick={handleViewAll}>View All</p>
      </div>
    </section>
  );
}
