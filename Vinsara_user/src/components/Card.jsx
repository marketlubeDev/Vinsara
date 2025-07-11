import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ImageWithShimmer = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="card-image-container">
      {isLoading && (
        <div className="shimmer-wrapper">
          <div className="shimmer"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`card-image ${isLoading ? 'hidden' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {error && (
        <div className="image-error">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
};

function Card({ product }) {
  if (!product) return null;

  const {
    mainImage,
    category,
    name,
    offerPrice,
    price,
    averageRating,
    discount,
    width,
    height,
    _id,
    stockStatus,
  } = product;

  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate(`/products/${_id}`)}>
      <div className="product-card_image">
        {discount && <span className="discount-tag">{discount}</span>}
        {/* if stockStatus is outofstock then fade the image*/}
        {stockStatus === "outofstock" ? (
          <img
            src={mainImage}
            alt={name}
            className="product-card_image_outofstock"
          />
        ) : (
          <ImageWithShimmer src={mainImage} alt={name} />
        )}
        <div className="wishlist-btn-wrapper">
          {/* <button className="wishlist-btn">
            <FiHeart />
          </button> */}
          {/* <button className="wishlist-btn">qqqqq</button> */}
        </div>
      </div>

      <div className="product-card_content" >
        {/* <span className="category">{category.name}</span> */}
        <h3 className="title">
          { name}
        </h3>
        <div className="price">
          <span className="current-price">₹{offerPrice}</span>
          <span className="original-price">₹{price}</span>
          {stockStatus === "outofstock" && (
            <span className="out-of-stock">Sold Out</span>
          )}
        </div>
        {/* <div className="rating">
          {"★".repeat(Math.floor(averageRating))}
          {"☆".repeat(5 - Math.floor(averageRating))}
          <span className="rating-number">{averageRating}</span>
        </div> */}
        {/* <div className="add-to-cart-wrapper">
          <button
            // onClick={() => handleAddToCart("buy")}
            className="add-to-cart"
            // disabled={loadingAction !== null}
          >
            Add To Cart
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Card;
