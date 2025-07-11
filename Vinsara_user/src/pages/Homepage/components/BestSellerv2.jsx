import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../hooks/queries/products';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
// Import required modules
import { Autoplay } from 'swiper/modules';

import {
    FiArrowRight as ViewAllIcon,
  } from "react-icons/fi";
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

function BestSellerv2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { data, isLoading, error } = useProducts({
    labelId: '67e10f6c5b3d36dda0b0c4cc',
  });

  if (isLoading) return <div><LoadingSpinner /></div>;
  if (error) return <div>Error loading products</div>;

  const products = data?.data?.products ?? [];

  const formatPrice = p =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const discount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

  const handleViewAll = () => {
    navigate("/products", {
      state: {
        selectedLabel:{ _id: '67e10f6c5b3d36dda0b0c4cc', name: 'Best Sellers' }
      },
    });
  };

  return (
    <section className="bestseller">
      <div className="bestseller_container">
        {/* ─── Header ────────────────────────────────────────────────────── */}
        <header className="bestseller_header">
          <h3>Best Sellers</h3> 
          <p className="view-all desktop-view-all" onClick={handleViewAll}>
          View All <ViewAllIcon />
        </p>
        </header>

        {/* ─── Card rail ────────────────────────────────────────────────── */}
        <div className="bestseller_cards-wrapper">
          <Swiper
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            speed={2000}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[Autoplay]}
            className="bestseller_cards"
            breakpoints={{
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20
              }
            }}
          >
            {products.map(p => (
              <SwiperSlide key={p._id}>
                <div className="bestseller_card">
                  <div className="bestseller_card-image">
                    <img src={p.mainImage} alt={p.name} loading="lazy" />
                  </div>

                  <div className="bestseller_card-content">
                    <h4 className="product-name">{p.name}</h4>

                    <div className="price-container">
                      <span className="current-price">{formatPrice(p.offerPrice)}</span>
                      <span className="original-price">{formatPrice(p.price)}</span>
                      <span className="discount-tag">{discount(p.offerPrice, p.price)}% off</span>
                    </div>

                    <button type="button" className="buy-now-btn" onClick={() => navigate(`/products/${p._id}`)}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-dots">
            {products.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
              <p className="mobile-view-all-bestseller" onClick={handleViewAll}>
                View All 
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSellerv2;
