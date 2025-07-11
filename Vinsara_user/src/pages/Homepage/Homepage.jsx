import React, { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import Bestseller from "./components/Bestseller";
import Offer from "./components/Offer";
import ShopBy from "./components/ShopBy";
import { useBanners } from "../../hooks/queries/banner";
import { useActiveOffers } from "../../hooks/queries/activeOffer";
import CarouselBanner from "../../components/CarouselBanner";
import { useGroupLabels } from "../../hooks/queries/labels";

import Sections from "./components/Sections";
import { useOfferBanner } from "../../hooks/queries/offerBanner";
import BestSellerv2 from "./components/BestSellerv2";

function Homepage() {
  const { allBanners, isLoading } = useBanners();
  const { offerBanner, isLoading: offerBannerLoading } = useOfferBanner();

  const { activeOffers, isLoading: activeOffersLoading } = useActiveOffers();
  const { data: groupLabels } = useGroupLabels();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const heroBanners = allBanners
    ?.filter((banner) => banner?.bannerFor === "hero")
    .map((banner) => ({
      ...banner,
      image:
        isMobile && banner?.mobileImage ? banner?.mobileImage : banner?.image,
    }));

  return (
    <div>
      <Carousel data={heroBanners} isLoading={isLoading} />
      <ShopBy />
      <div className="divider-home" />
      {activeOffers?.length > 0 && (
        <>
          {" "}
          <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
         
        </>
      )}

      {/* <Bestseller /> */}
      <BestSellerv2 />

      {offerBanner?.length > 0 &&
        groupLabels?.data?.length > 0 &&
        groupLabels?.data?.map((label, index) => (
          <React.Fragment key={label?.label}>
            <div className="divider-home" />
            <Sections label={label} />

            {(index + 1) % 2 === 0 && index !== groupLabels.data.length - 1 && (
              <>
                {offerBanner?.[Math.floor(index / 2) + 1] && (
                  <>
                    <div className="divider-home" />
                    <Offer
                      banners={offerBanner[Math.floor(index / 2) + 1].banners}
                      isLoading={offerBannerLoading}
                      error={null}
                    />
                  </>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      {/* Show remaining offer banner sections if any */}
      <div className="divider-home" />
      {offerBanner
        ?.slice(Math.ceil(groupLabels?.data?.length / 2))
        .map((section) => (
          <React.Fragment key={section.section}>
            <Offer
              banners={section.banners}
              isLoading={offerBannerLoading}
              error={null}
            />
            <div className="divider-home" />
          </React.Fragment>
        ))}
    </div>
  );
}

export default Homepage;
