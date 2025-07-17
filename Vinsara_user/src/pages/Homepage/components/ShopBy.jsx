import React from "react";
import { useCategories } from "../../../hooks/queries/categories";
import { useNavigate } from "react-router-dom";

const CardSkeleton = () => (
  <div className="content-item skeleton">
    <div className="skeleton-image"></div>
    <div className="content-overlay">
      <div className="skeleton-text"></div>
    </div>
  </div>
);

const ImageWithFallback = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`image-container ${className}`}>
      {isLoading && (
        <div className="skeleton-image"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <div className="image-error">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
};

const ShopBy = () => {
  const navigate = useNavigate();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const categories = categoriesData?.envelop?.data;

  const handleCategoryClick = (category) => {
    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const renderSkeletons = (count) => {
    return Array(count).fill(0).map((_, index) => (
      <CardSkeleton key={index} />
    ));
  };

  return (
    <section className="shop-by">
      <h2>Shop By <span>Category</span></h2>
      {categoriesLoading ? (
        <div className="content">
          {renderSkeletons(6)}
        </div>
      ) : (
        <div className="content">
          {categories?.map((category, index) => (
            <div
              key={index}
              className="content-item"
              onClick={() => handleCategoryClick(category)}
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="content-image"
              />
              <div className="content-overlay">
                {/* <span className="content-name-background">{category.name}</span> */}
                <h3 className="content-name">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopBy;
