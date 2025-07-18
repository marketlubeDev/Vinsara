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

  console.log(offerBanner, "Offer Banner>>");
  console.log(groupLabels, "Group Labels>>");

  return (
    <div>
      <Carousel data={heroBanners} isLoading={isLoading} />
      <ShopBy />
      {/* <div className="divider-home" /> */}
      {activeOffers?.length > 0 && (
        <>
          {" "}
          <CarouselBanner data={activeOffers} isLoading={activeOffersLoading} />
        </>
      )}

      {/* <Bestseller /> */}
      <BestSellerv2 />

      {/* Start pattern with offer banner, then 2 labels + 1 banner */}
      {offerBanner?.length > 0 && groupLabels?.data?.length > 0 && (
        <>
          {(() => {
            const labels = groupLabels.data;
            const banners = offerBanner;
            const result = [];
            let labelIndex = 0;
            let bannerIndex = 0;

            while (labelIndex < labels.length || bannerIndex < banners.length) {
              // Add 1 banner first (if this is the first iteration and banner is available)
              if (bannerIndex < banners.length) {
                result.push(
                  <React.Fragment key={`banner-${bannerIndex}`}>
                    <Offer
                      banners={banners[bannerIndex].banners}
                      isLoading={offerBannerLoading}
                      error={null}
                    />
                  </React.Fragment>
                );
                bannerIndex++;
              }

              // Add up to 2 labels
              for (let i = 0; i < 2 && labelIndex < labels.length; i++) {
                result.push(
                  <React.Fragment key={`label-${labelIndex}`}>
                    <Sections label={labels[labelIndex]} />
                  </React.Fragment>
                );
                labelIndex++;
              }
            }

            return result;
          })()}
        </>
      )}

      {/* If no labels but banners exist, show all banners */}
      {(!groupLabels?.data || groupLabels.data.length === 0) &&
        offerBanner?.length > 0 &&
        offerBanner.map((section, index) => (
          <React.Fragment key={`banner-only-${index}`}>
            <Offer
              banners={section.banners}
              isLoading={offerBannerLoading}
              error={null}
            />
          </React.Fragment>
        ))}
    </div>
  );
}

export default Homepage;
