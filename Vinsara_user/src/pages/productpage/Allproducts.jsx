import React, { useEffect, useState, useCallback } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
} from "react-icons/fi";
import Card from "../../components/Card";
import Carousel from "../../components/Carousel";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useProducts } from "../../hooks/queries/products";
import { useCategories } from "../../hooks/queries/categories";
import debounce from "lodash/debounce";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../components/error/ErrorFallback";
import { useLabels } from "../../hooks/queries/labels";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { useBanners } from "../../hooks/queries/banner";

// Separate the content into a new component
function AllProductsContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    categories: true,
    highlights: false,
    shopBy: false,
    priceRange: false,
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: Infinity,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categoryId: null,
    subcategoryId: null,
    priceRange: {
      min: 0,
      max: Infinity,
    },
    labelId: null,
    sort: "newest",
    offerId: null,
  });
  const [selectedNames, setSelectedNames] = useState({
    categoryName: "",
    subcategoryName: "",
    labelName: "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const MAX_PRICE_VALUE = 999999999;

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const {
    data: response,
    isLoading,
    error,
  } = useProducts({
    categoryId: selectedFilters.categoryId,
    subcategoryId: selectedFilters.subcategoryId,
    minPrice: selectedFilters.priceRange.min,
    maxPrice:
      selectedFilters.priceRange.max === Infinity
        ? MAX_PRICE_VALUE
        : selectedFilters.priceRange.max,
    labelId: selectedFilters.labelId,
    sort: selectedFilters.sort,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    offerId: selectedFilters.offerId,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const {
    data: labelsData,
    isLoading: labelsLoading,
    error: labelsError,
  } = useLabels();

  const {
    allBanners,
    isLoading: bannersLoading,
    error: bannersError,
  } = useBanners();

  const debouncedUpdateFilters = useCallback(
    debounce((newRange) => {
      setSelectedFilters((prev) => ({
        ...prev,
        priceRange: newRange,
      }));
    }, 500),
    []
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [selectedFilters]);

  useEffect(() => {
    return () => {
      debouncedUpdateFilters.cancel();
    };
  }, [debouncedUpdateFilters]);

  useEffect(() => {
    const categoryFromHeader = location.state?.selectedCategory;
    const subCategoryFromHeader = location.state?.selectedSubCategory;
    const labelFromHomePage = location.state?.selectedLabel;
    const offerFromHomePage = location.state?.selectedOffer;

    if (categoryFromHeader) {
      setSelectedFilters((prev) => ({
        ...prev,
        categoryId: categoryFromHeader.id,
      }));
      setSelectedNames((prev) => ({
        ...prev,
        categoryName: categoryFromHeader.name,
      }));


      if(!subCategoryFromHeader){
        setSelectedFilters((prev) => ({
          ...prev,
          subcategoryId: null,
        }));
        setSelectedNames((prev) => ({
          ...prev,
          subcategoryName: "",
        }));
      }
    }
    if (subCategoryFromHeader) {
      setSelectedFilters((prev) => ({
        ...prev,
        subcategoryId: subCategoryFromHeader?._id,
        categoryId: subCategoryFromHeader?.category,
      }));
      setSelectedNames((prev) => ({
        ...prev,
        subcategoryName: subCategoryFromHeader?.name,
      }));
      // setSelectedNames((prev) => ({
      //   ...prev,
      //   categoryName: categoryFromHeader.name,
      // }));
    }
    if (labelFromHomePage) {
      setSelectedFilters((prev) => ({
        ...prev,
        labelId: labelFromHomePage._id,
      }));
      setSelectedNames((prev) => ({
        ...prev,
        labelName: labelFromHomePage.name,
      }));
    }
    if (offerFromHomePage) {
      setSelectedFilters((prev) => ({
        ...prev,
        offerId: offerFromHomePage._id,
      }));
      setSelectedNames((prev) => ({
        ...prev,
        offerName: offerFromHomePage.name,
      }));
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading || categoriesLoading || labelsLoading)
    return <LoadingSpinner />;
  if (error || categoriesError) {
    throw error || categoriesError;
  }

  const products = response?.data?.products || [];
  const categories = categoriesData?.envelop?.data || [];
  const labels = labelsData?.envelop?.data || [];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    document.body.style.overflow = !isFilterOpen ? "hidden" : "auto";
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Format price with commas
  const formatPrice = (price) => {
    if (price === Infinity) return "Any";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Modified handleCategorySelect
  const handleCategorySelect = (
    categoryId,
    subcategoryId = null,
    categoryName = "",
    subcategoryName = ""
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
    }));

    setSelectedNames((prev) => ({
      ...prev,
      categoryName: categoryName,
      subcategoryName: subcategoryName,
    }));

    if (isFilterOpen) {
      toggleFilter();
    }
  };

  // 2. Update handlePriceInputChange function
  const handlePriceInputChange = (e, type) => {
    let value = e.target.value.replace(/,/g, ""); // Remove commas

    // Handle "Any" input for max price
    if (type === "max" && (value === "Any" || value === "")) {
      setPriceRange((prev) => ({
        ...prev,
        max: Infinity,
      }));
      // Use MAX_PRICE_VALUE instead of Infinity for the API call
      debouncedUpdateFilters({
        ...priceRange,
        max: MAX_PRICE_VALUE,
      });
      return;
    }

    value = value.replace(/\D/g, ""); // Remove non-digits

    if (value === "") {
      value = type === "min" ? "0" : MAX_PRICE_VALUE.toString();
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    setPriceRange((prev) => {
      const newRange = {
        ...prev,
        [type]: numValue,
      };
      debouncedUpdateFilters(newRange);
      return newRange;
    });
  };

  // 3. Update handleRangeChange function
  const handleRangeChange = (e, type) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => {
      const newRange = {
        ...prev,
        [type]:
          type === "min"
            ? Math.min(
                value,
                prev.max === Infinity ? MAX_PRICE_VALUE : prev.max
              )
            : value === MAX_PRICE_VALUE
            ? Infinity
            : Math.max(value, Math.max(prev.min, 2000)),
      };

      // Use MAX_PRICE_VALUE instead of Infinity for the API call
      const apiRange = {
        ...newRange,
        max: newRange.max === Infinity ? MAX_PRICE_VALUE : newRange.max,
      };
      debouncedUpdateFilters(apiRange);
      return newRange;
    });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sortValue = e.target.value;

    setSelectedFilters((prev) => ({
      ...prev,
      sort: sortValue,
    }));
  };

  // Modified renderActiveFilters to show all active filters
  const renderActiveFilters = () => {
    const active = [];

    // Add category filter
    if (selectedFilters.categoryId && selectedNames.categoryName) {
      active.push(
        <div key="category" className="active-filter">
          <span className="filter-type">Category:</span>
          {selectedNames.categoryName}
          <button onClick={() => handleCategorySelect(null, null, "", "")}>
            ×
          </button>
        </div>
      );
    }

    // Add subcategory filter
    if (selectedFilters.subcategoryId && selectedNames.subcategoryName) {
      active.push(
        <div key="subcategory" className="active-filter">
          <span className="filter-type">Subcategory:</span>
          {selectedNames.subcategoryName}
          <button
            onClick={() =>
              handleCategorySelect(
                selectedFilters.categoryId,
                null,
                selectedNames.categoryName,
                ""
              )
            }
          >
            ×
          </button>
        </div>
      );
    }

    // Add label filter
    if (selectedFilters.labelId && selectedNames.labelName) {
      active.push(
        <div key="label" className="active-filter">
          <span className="filter-type">Highlight:</span>
          {selectedNames.labelName}
          <button
            onClick={() => {
              handleLabelSelect(
                selectedFilters.labelId,
                selectedNames.labelName
              );
            }}
          >
            ×
          </button>
        </div>
      );
    }

    if (selectedFilters.offerId && selectedNames.offerName) {
      active.push(
        <div key="offer" className="active-filter">
          <span className="filter-type">Offer:</span>
          {selectedNames.offerName}
          <button
            onClick={() => {
              setSelectedFilters((prev) => ({
                ...prev,
                offerId: null,
              }));
            }}
          >
            ×
          </button>
        </div>
      );
    }
    // Add price range filter
    if (priceRange.min > 0 || priceRange.max !== Infinity) {
      const priceText =
        priceRange.max === Infinity
          ? `Above ₹${formatPrice(priceRange.min)}`
          : `₹${formatPrice(priceRange.min)} - ₹${formatPrice(priceRange.max)}`;

      active.push(
        <div key="price-range" className="active-filter">
          <span className="filter-type">Price:</span>
          {priceText}
          <button
            onClick={() => {
              setPriceRange({ min: 0, max: Infinity });
              setSelectedFilters((prev) => ({
                ...prev,
                priceRange: { min: 0, max: Infinity },
              }));
            }}
          >
            ×
          </button>
        </div>
      );
    }

    return active;
  };

  const SLIDER_MAX = 50000;

  // Update the getTrackStyle function
  const getTrackStyle = () => {
    const sliderMax = SLIDER_MAX;
    const percent1 = (Math.min(priceRange.min, sliderMax) / sliderMax) * 100;
    const percent2 =
      priceRange.max === Infinity
        ? 100
        : (Math.min(priceRange.max, sliderMax) / sliderMax) * 100;

    return {
      background: `linear-gradient(to right,
        #eee ${percent1}%,
        #FF5C00 ${percent1}%,
        #FF5C00 ${percent2}%,
        #eee ${percent2}%)`,
    };
  };

  // 3. Add handler for label selection
  const handleLabelSelect = (labelId, labelName) => {
    setSelectedFilters((prev) => ({
      ...prev,
      labelId: prev.labelId === labelId ? null : labelId,
    }));

    setSelectedNames((prev) => ({
      ...prev,
      labelName: prev.labelName === labelName ? "" : labelName,
    }));

    if (isFilterOpen) {
      toggleFilter();
    }
  };

  // Add pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const productBanners = allBanners
    ?.filter((banner) => banner?.bannerFor === "product")
    .map((banner) => ({
      ...banner,
      image:
        isMobile && banner?.mobileImage ? banner?.mobileImage : banner?.image,
    }));

  return (
    <div className="product-page">
      <Carousel data={productBanners} maxHeight="32rem" showButton={false} />
      <div className="product-section">
        <div className="breadcrumb">
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span> / <span>All Products</span>
        </div>

        <div className="product-header">
          <div className="header-left">
            <h1>
              Products <span>({response?.data?.totalProducts})</span>
            </h1>
          </div>
          <div className="header-right">
            <div className="sort-section">
              {/* <span>Sort:</span> */}
              <select value={selectedFilters.sort} onChange={handleSortChange}>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <button
              className={`filter-btn ${isFilterOpen ? "active" : ""}`}
              onClick={toggleFilter}
            >
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        {renderActiveFilters().length > 0 && (
          <div className="active-filters">
            {renderActiveFilters()}
            <button
              className="clear-all"
              onClick={() => {
                setSelectedFilters({
                  categoryId: null,
                  subcategoryId: null,
                  priceRange: { min: 0, max: Infinity },
                  labelId: null,
                  sort: "newest",
                });
                setSelectedNames({
                  categoryName: "",
                  subcategoryName: "",
                  labelName: "",
                });
                setPriceRange({ min: 0, max: Infinity });
              }}
            >
              Clear All
            </button>
          </div>
        )}

        <div className="product-content">
          {/* Filter Sidebar */}
          <div className={`filter-sidebar ${isFilterOpen ? "open" : ""}`}>
            <div className="filter-header">
              <button className="back-btn" onClick={toggleFilter}>
                <FiArrowLeft />
                Back
              </button>
            </div>

            <div className="filter-sections">
              <div className="filter-section">
                <div
                  className="section-header"
                  onClick={() => toggleSection("categories")}
                >
                  <h3>Categories</h3>
                  {openSections.categories ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </div>
                {openSections.categories && (
                  <ul className="categories-list">
                    {categories.map((category) => (
                      <li
                        key={category._id}
                        className={
                          selectedFilters.categoryId === category._id
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          handleCategorySelect(
                            category._id,
                            null,
                            category.name,
                            ""
                          )
                        }
                      >
                        <div className="category-header">
                          <div className="category-name">
                            <span>{category.name}</span>
                            {category.subcategories?.length > 0 && (
                              <span className="count">
                                ({category.subcategories?.length})
                              </span>
                            )}
                          </div>
                          <div className="category-indicators">
                            {selectedFilters.categoryId === category._id && (
                              <span className="checkmark">✓</span>
                            )}
                            {category.subcategories?.length > 0 && (
                              <FiChevronDown
                                className={`subcategory-arrow ${
                                  expandedCategories[category._id]
                                    ? "rotated"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategory(category._id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        {category.subcategories?.length > 0 &&
                          expandedCategories[category._id] && (
                            <ul className="subcategories-list">
                              {category.subcategories.map((sub) => (
                                <li
                                  key={sub._id}
                                  className={
                                    selectedFilters.subcategoryId === sub._id
                                      ? "active"
                                      : ""
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategorySelect(
                                      category._id,
                                      sub._id,
                                      category.name,
                                      sub.name
                                    );
                                  }}
                                >
                                  <div className="subcategory-item">
                                    <span>{sub.name}</span>
                                    {selectedFilters.subcategoryId ===
                                      sub._id && (
                                      <span className="checkmark">✓</span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="filter-section">
                <div
                  className="section-header"
                  onClick={() => toggleSection("highlights")}
                >
                  <h3>Highlights</h3>
                  {openSections.highlights ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </div>
                {openSections.highlights && (
                  <ul className="highlights-list">
                    {labels.map((label) => (
                      <li
                        key={label._id}
                        className={
                          selectedFilters.labelId === label._id ? "active" : ""
                        }
                        onClick={() => handleLabelSelect(label._id, label.name)}
                      >
                        <div className="highlight-item">
                          <span>{label.name}</span>
                          {selectedFilters.labelId === label._id && (
                            <span className="checkmark">✓</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="filter-section">
                <div
                  className="section-header"
                  onClick={() => toggleSection("shopBy")}
                >
                  <h3>Shop By</h3>
                  {openSections.shopBy ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {openSections.shopBy && (
                  <div className="price-range">
                    <div
                      className="section-header"
                      onClick={() => toggleSection("priceRange")}
                    >
                      <h4>Price Range</h4>
                      {openSections.priceRange ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </div>
                    {openSections.priceRange && (
                      <>
                        <div className="range-slider">
                          <div
                            className="slider-track"
                            style={getTrackStyle()}
                          ></div>
                          <input
                            type="range"
                            min="0"
                            max={SLIDER_MAX}
                            value={Math.min(priceRange.min, SLIDER_MAX)}
                            className="slider-thumb left"
                            onChange={(e) => handleRangeChange(e, "min")}
                          />
                          <input
                            type="range"
                            min="0"
                            max={SLIDER_MAX}
                            value={
                              priceRange.max === Infinity
                                ? SLIDER_MAX
                                : Math.min(priceRange.max, SLIDER_MAX)
                            }
                            className="slider-thumb right"
                            onChange={(e) => handleRangeChange(e, "max")}
                          />
                        </div>
                        <div className="price-inputs">
                          <div className="price-input">
                            <span>₹</span>
                            <input
                              type="text"
                              value={formatPrice(priceRange.min)}
                              onChange={(e) => handlePriceInputChange(e, "min")}
                              onBlur={() => {
                                if (
                                  priceRange.min > priceRange.max &&
                                  priceRange.max !== Infinity
                                ) {
                                  setPriceRange((prev) => ({
                                    ...prev,
                                    min: prev.max,
                                  }));
                                }
                              }}
                            />
                          </div>
                          <div className="price-input">
                            <span>₹</span>
                            <input
                              type="text"
                              value={formatPrice(priceRange.max)}
                              onChange={(e) => handlePriceInputChange(e, "max")}
                              placeholder="Any"
                              onBlur={() => {
                                if (priceRange.max < priceRange.min) {
                                  setPriceRange((prev) => ({
                                    ...prev,
                                    max: prev.min,
                                  }));
                                }
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div
            className={`filter-overlay ${isFilterOpen ? "open" : ""}`}
            onClick={toggleFilter}
          ></div>

          {/* Product Grid */}
          <div className="products-container">
            <div className="product-grid">
              {products.map((product) => (
                <Card key={product._id} product={product} />
              ))}
            </div>

            {/* Add Pagination */}
            {response?.data?.totalProducts > ITEMS_PER_PAGE && (
              <div className="pagination-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    response?.data?.totalProducts / ITEMS_PER_PAGE
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with ErrorBoundary
function AllProducts() {
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
      <AllProductsContent />
    </ErrorBoundary>
  );
}

export default AllProducts;
