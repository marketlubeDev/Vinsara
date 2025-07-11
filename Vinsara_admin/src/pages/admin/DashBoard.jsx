import React, { useEffect, useState } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import Cards from "../../components/Admin/dashboard/Cards";
import Logo from "../../components/Logo";
import TopProductCards from "../../components/Admin/dashboard/TopProductCards";
import { adminDashdoard } from "../../sevices/adminApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { useSelector } from "react-redux";

function DashBoard() {
  const store = useSelector((state) => state.store.store);
  const [cardsData, setCardsData] = useState([]);
  const [topProudcts, setTopProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await adminDashdoard();
      setCardsData(res?.data?.summary);
      setTopProducts(res?.data?.topProducts);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        color="primary"
        text="Loading dashboard data..."
      />
    );
  }

  return (
    <div className="space-y-5 px-1 md:px-5 md:space-y-10">
      <PageHeader content="Dashboard" />

      {/* quick analysis */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly  py-3 bg-white md:p-4">
        <div>
          <img
            src="/images/logo.png"
            alt="logo image"
            className="w-[20rem] md:w-[22rem] md:p-4"
          />
        </div>
        <div>
          <div className="flex-col flex lg:flex-row items-center  justify-center gap-9 w-full mt-3">
            {cardsData &&
              cardsData.map((card, index) => (
                <Cards
                  key={index}
                  data={card.data}
                  color={card.color}
                  count={card.count}
                />
              ))}
          </div>
        </div>
      </div>

      {/* top products */}
      <div>
        <p className="text-lg font-bold mb-2 ">Your top 4 products</p>
        <div className="flex flex-col lg:flex-row gap-2">
          {topProudcts &&
            topProudcts.map((product, index) => (
              <div key={index} className="w-1/4">
                <TopProductCards item={product} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
