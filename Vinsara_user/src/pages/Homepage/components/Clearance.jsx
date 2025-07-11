import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../../../components/Card";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowRight as ViewAllIcon,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/queries/products";
import LoadingSpinner from "../../../components/LoadingSpinner";
function Clearance() {
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useProducts({
    labelId: "67e3bee5734dabfc5c7e4c59",
  });

  const productslists = response?.data?.products || [];



  useEffect(() => {
    if (response?.data?.products) {
      setProducts(response.data.products);
    }
  }, [response]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (!products || products.length === 0) return <div>No products found</div>;

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
        selectedLabel: { _id: "67e3bee5734dabfc5c7e4c59", name: "Clearance" },
      },
    });
  };

  return (
    <div className="clearance-container" >
      <div className="clearance-header">
        <div className="clearance-content">
          <h2 className="clearance-content_h2">
            Clearance <span className="clearance-content_span">sale</span>
          </h2>
          {/* <p className="clearance-content_p">
            Get amazing deals on our top-rated products
          </p> */}
        </div>
        <p onClick={handleViewAll} className="view-all desktop-view-all">
          View All <ViewAllIcon />
        </p>
      </div>
      <div className="clearance-products-wrapper">
        <button
          className="scroll-button scroll-left"
          onClick={() => scroll("left")}
        >
          <FiArrowLeft />
        </button>
        <div className="clearance-products" ref={scrollContainerRef}>
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
          <div style={{ display:"flex" , justifyContent:"center"}}>
          <p onClick={handleViewAll} className="view-all mobile-view-all">
        View All <ViewAllIcon />
      </p>
          </div>
    </div>
  );
}

export default Clearance;