import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import { FiChevronLeft, FiChevronRight, FiShare2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import { useProductById, useProducts } from "../../hooks/queries/products";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/error/ErrorFallback";
import ButtonLoadingSpinner from "../../components/ButtonLoadingSpinners";
import { usePlaceOrder } from "../../hooks/queries/order";

const CalculateDiscount = (price, offerPrice) => {
  const discount = ((price - offerPrice) / price) * 100;
  return Number.isInteger(discount) ? discount : discount.toFixed(2);
};

function ProductDetailsContent() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { id } = useParams();
  //api calls
  const { data: product, isLoading, error, refetch } = useProductById(id);
  const {
    data: response,
    isLoading: isLoadingProduct,
    error: errorProducts,
  } = useProducts();


  const { mutate: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [outOfStock, setOutOfStock] = useState(false);
  useEffect(() => {
    setSelectedVariant(product?.variants?.[0]);
    setSelectedImage(product?.variants?.[0]?.images?.[0]);
    setQuantity(1);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [product, id]);

  useEffect(() => {
    if (
      (selectedVariant && selectedVariant?.stockStatus == "outofstock") ||
      (selectedVariant && selectedVariant?.stock === 0) 
    ) {
      setOutOfStock(true);
    } else {
      setOutOfStock(false);
    }
  }, [selectedVariant, product]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleConnectToWhatsapp = async () => {
    try {
      const productToAdd = {
        productId: product._id,
        variantId: selectedVariant?._id || null,
        quantity: quantity,
        from: location.pathname,
      };

      placeOrder(productToAdd, {
        onSuccess: (data) => {
          setQuantity(1);
          const orderDetails = data?.data?.order;
          const message =
            `*ORDER DETAILS*\n\n` +
            `*Order ID:* ${orderDetails?.orderId}\n\n` +
            `*Product Details*\n` +
            `• Name: ${orderDetails?.productName}\n` +
            `• SKU: ${orderDetails?.sku}\n` +
            `• Brand: ${orderDetails?.brandName}\n` +
            `${
              orderDetails?.variantName
                ? `• Variant: ${orderDetails?.variantName}\n`
                : ""
            }` +
            `• Quantity: ${orderDetails?.quantity}\n` +
            `• Price: ₹${orderDetails?.pricePerUnit}\n` +
            `• Total: ₹${orderDetails?.totalAmount}\n\n` +
            `*Store Details*\n` +
            `• ${orderDetails?.storeName}\n` +
            `• Contact: ${orderDetails?.storeNumber}\n\n` +
            `*Product Image*\n` +
            `${orderDetails?.productImage}\n\n`;

          const whatsappUrl = `https://wa.me/+91${orderDetails?.storeNumber}?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        },
        onError: (error) => {},
      });
    } catch (error) {}
  };

  const truncateDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= 100) return text;
    return showFullDescription ? text : words?.slice(0, 100).join(" ") + "...";
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    const message = `Check out this product: ${product?.name}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="product-details">
      <div className="breadcrumb">
        <span onClick={() => navigate("/products")}>All products</span>
        <span>/</span>
        <span className="category-name"> {product?.category?.name} </span>
      </div>

      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={
                selectedImage ||
                (selectedVariant && selectedVariant.images[0]) 
              }
              alt={product?.name}
            />
          </div>
          <div className="thumbnail-images">
            { selectedVariant?.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product?.name} ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className={selectedImage === image ? "selected" : ""}
                    style={{ cursor: "pointer" }}
                  />
                ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-info-header">
            <div className="brand">
              <img
                src={product?.brand?.image}
                alt={product?.brand?.name}
                className="brand-logo"
              />
              <span>{product?.brand?.name}</span>
            </div>
            <div className="actions">
              {/* <span className="product-id"># {product?._id}</span> */}
              <button className="share-btn" onClick={handleShare}>
                <FiShare2 />
              </button>
            </div>
          </div>

          <h1 className="product-title">
            {/* {selectedVariant
              ? selectedVariant?.attributes?.title
              : product?.name} */}
            {selectedVariant
              && `${product?.name} (${selectedVariant?.attributes?.title})`
            }
          </h1>

          {(selectedVariant
            && selectedVariant?.stock < 5 && selectedVariant?.stock > 0
           ) && (
            <span className="product-stock-left">
              ( only {selectedVariant ? selectedVariant?.stock : product?.stock}{" "}
              left)
            </span>
          )}
          <div className="section description">
            <p>
              {truncateDescription(
                selectedVariant
                  && selectedVariant?.attributes?.description
              )}
              {(selectedVariant?.attributes?.description?.split(" ").length >
                100 ) && (
                <button
                  className="read-more"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </p>
          </div>
          {product?.variants.length > 0 && (
            <div className="section variants">
              <h3>Variants</h3>
              <div className="type-buttons">
                {product?.variants.map((variant) => (
                  <button
                    key={variant._id}
                    className={`type-btn ${
                      selectedVariant?._id === variant._id ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedImage(variant.images[0]);
                    }}
                  >
                    <div className="variant-image">
                      <img src={variant?.images[0]} alt={variant?.name} />
                    </div>
                    <div className="light-info">
                      <span>
                        {variant?.attributes?.title?.slice(0, 10)}
                        {variant?.attributes?.title?.length > 10 && "..."}
                      </span>
                      <span className="temp">₹{variant?.offerPrice}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="section price">
            <div className="price-info">
              <span className="current">
                ₹
                {selectedVariant
                  && selectedVariant?.offerPrice}
              </span>
              <span className="original">
                ₹{selectedVariant && selectedVariant?.price}
              </span>
              <span className="discount">
                {CalculateDiscount(
                  selectedVariant && selectedVariant?.price,
                  selectedVariant && selectedVariant?.offerPrice
                )}
                % off
              </span>
            </div>

            <div className="buy-buttons">
              {
                <button
                  className="buy-now"
                  onClick={() => handleConnectToWhatsapp()}
                  disabled={isPlacingOrder || outOfStock}
                  style={{ opacity: outOfStock ? 0.5 : 1 }}
                >
                  {isPlacingOrder ? (
                    <ButtonLoadingSpinner />
                  ) : (
                    // if outof stock then disable the button and fade the button style
                    <div className="buy-now-button">
                      <FaWhatsapp
                        style={{ color: "white", fontSize: "1.5rem" }}
                      />
                      Buy Now
                    </div>
                  )}
                </button>
              }
              {!outOfStock && (
                <div className="quantity-container">
                  <span>Qty:</span>
                  <input
                    type="text"
                    className="quantity-input"
                    value={quantity.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setQuantity("");
                      } else {
                        const parsed = parseInt(value);
                        if (!isNaN(parsed) && parsed >= 0) {
                          setQuantity(parsed);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (quantity === "" || quantity < 1) {
                        setQuantity(1);
                      }
                    }}
                  />
                  <div className="quantity-buttons">
                    <IoIosArrowUp
                      size={30}
                      onClick={() => setQuantity((prev) => prev + 1)}
                    />
                    <IoIosArrowDown
                      size={30}
                      onClick={() =>
                        quantity > 1 && setQuantity((prev) => prev - 1)
                      }
                    />
                  </div>
                </div>
              )}
              {outOfStock && (
                <span className="product-out-of-stock">
                Sold Out  
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Picks Section */}
      <div className="top-picks-section">
        <div className="section-header">
          <h2>
            Top Picks <span>For You</span>
          </h2>
          <div className="view-controls">
            <span className="view-all" onClick={() => navigate("/products")}>
              View all
            </span>
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={() => scroll("left")}>
                <FiChevronLeft />
              </button>
              <button className="nav-btn next" onClick={() => scroll("right")}>
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="products-slider" ref={sliderRef}>
          {response?.data?.products?.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="mobile-fixed-buttons">
        <div
          className="buy-buttons"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          {
            <div className="quantity-container" style={{ flex: 1 }}>
              <span>Qty:</span>
              <input
                type="text"
                className="quantity-input"
                value={quantity.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setQuantity("");
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed) && parsed >= 0) {
                      setQuantity(parsed);
                    }
                  }
                }}
                onBlur={() => {
                  if (quantity === "" || quantity < 1) {
                    setQuantity(1);
                  }
                }}
              />
              <div className="quantity-buttons">
                <IoIosArrowUp
                  size={30}
                  onClick={() => setQuantity((prev) => prev + 1)}
                />
                <IoIosArrowDown
                  size={30}
                  onClick={() =>
                    quantity > 1 && setQuantity((prev) => prev - 1)
                  }
                />
              </div>
            </div>
          }
          <button className="buy-now" onClick={() => handleConnectToWhatsapp()}>
            <div className="buy-now-button">
              <FaWhatsapp style={{ color: "white", fontSize: "1.5rem" }} />
              Buy Now
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
      onError={(error, info) => {
        // Log the error
        console.error("Error caught by boundary:", error, info);
      }}
    >
      <ProductDetailsContent />
    </ErrorBoundary>
  );
}

export default ProductDetails;
