import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

function CarouselBanner({
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
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    cssEase: "linear",
    customPaging: (i) => <div className="custom-dot"></div>,
    dotsClass: "slick-dots custom-dots",
    draggable: true,
  };

  if (isLoading) return <LoadingSpinner />;


  return (
    <div className="carousel-container-banner" style={{ maxHeight: maxHeight }}>
      <Slider {...settings}>
        {data?.map((item, index) => (
          <div key={index}>
            <img
              src={item?.bannerImage}
              alt={item?.bannerImage}
              className="carousel-image"
              onClick={() =>
                navigate(`/products`, {
                  state: {
                    selectedOffer: {
                      _id: item._id,
                      name: item.offerName,
                    },
                  },
                })
              }
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CarouselBanner;
