import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

function Carousel({
  data,
  maxHeight,
  width,
  isBrand = false,
  showButton = true,
    isLoading = false,
  }) {

  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    cssEase: "linear",
    customPaging: (i) => <div className="custom-dot"></div>,
    dotsClass: "slick-dots custom-dots",
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="carousel-container" style={{ maxHeight: maxHeight }}>
      <Slider {...settings}>
        {data?.map((item, index) => (
          <div key={index}>
            <img
              src={item?.image}
              alt={item?.alt}
              className="carousel-image"
              onClick={() => navigate(`/products`)}
            />
            {/* {!isBrand && showButton && (
              <div className="carousel-content">
                <h1>{item?.heading || item?.title || ""}</h1>
                <p>
                  {item?.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </p>
                {showButton && (
                  <Link
                    style={{ textDecoration: "none" }}
                    className="carousel-button"
                    to={"/products"}
                  >
                    Shop Now
                  </Link>
                )}
              </div>
            )} */}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Carousel;
