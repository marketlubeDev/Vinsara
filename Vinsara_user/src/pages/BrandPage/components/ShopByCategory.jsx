import React, { useEffect, useState } from "react";
import { useProducts } from "../../../hooks/queries/products";
import Card from "../../../components/Card";
import Pagination from "../../../components/Pagination";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ShopByCategory = ({ id }) => {
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const { data, isLoading, error } = useProducts({
    brandId: id,
    page: currentPage,
    limit: 12,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [data]);

  useEffect(() => {
    setIsPageLoading(true);
    if (data) {
      setTotalPages(data?.data?.totalPages || 1);
      setProducts(data?.data?.products || []);
      setIsPageLoading(false);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setIsPageLoading(true);
    setCurrentPage(page);
  };

  // const categories = ["sholder bags", "t-shirts", "shoes", "bags", "sneakers"];

  if (isLoading && !isPageLoading) return <LoadingSpinner />;

  return (
    <section className="shop-by-category">
      {/* <h2>
        Shop By <span className="shop-by-category-span">Category</span>
      </h2>
      <div className="tabs">
        {allCategories.map((category, index) => (
          <button
            key={index}
            className={`tab-btn ${activeTab === category._id ? "active" : ""}`}
            onClick={() => setActiveTab(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div> */}
      {isPageLoading ? (
        <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      ) : products?.length > 0 ? (
        <div className="content">
          {products?.map((product, index) => (
            <Card product={product} key={index} />
          ))}
        </div>
      ) : (
        <div>No products found</div>
      )}

      {data?.data?.products?.length > 0 && (
        <div className="pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* </div> */}
      {/* <div className="shop-all">
        <p>Discover More from The Collection.</p>
        <a href="#">shop all →</a>
      </div> */}
    </section>
  );
};

export default ShopByCategory;
