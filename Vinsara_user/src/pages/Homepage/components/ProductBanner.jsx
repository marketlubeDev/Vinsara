import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FreeMode, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function ProductBanner({ banners }) {
  const navigate = useNavigate();
  return (
    <div className="product-banner-container">
      <Swiper
        modules={[FreeMode, Autoplay]}
        className="mySwiper"
        wrapperClass="swiper-wrapper"
        cssMode={false}
        loop={true}
        loopedSlides={banners?.length > 3 ? 3 : banners?.length}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={700}
        loopFillGroupWithBlank={true}
        loopAdditionalSlides={banners?.length > 3 ? 3 : banners?.length}
        centeredSlidesBounds={true}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        resistance={true}
        resistanceRatio={0.85}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        initialSlide={0}
        breakpoints={{
          768: {
            slidesPerView: 1.5,
            centeredSlides: true,
            spaceBetween: 20,
          }
        }}
      >
        {banners?.map((post, index) => (
          <SwiperSlide key={index}>
            <div
              className="product-card"
              onClick={() => {
                navigate(`/products`, {
                  state: {
                    selectedOffer: {
                      _id: post._id,
                      name: post.offerName,
                    },
                  },
                });
              }}
            >
              <div
                className="product-card__image"
                style={{
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={post.bannerImage}
                  alt="offer_banner"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductBanner;
