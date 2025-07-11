import React, { useState, useEffect, useRef } from "react";
import { useCategories } from "../hooks/queries/categories";
import { useNavigate } from "react-router-dom";
import { useBrands } from "../hooks/queries/brands";

export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [limit, setLimit] = useState(12);
  const [dropdownContent, setDropdownContent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [currentDropDownParent, setCurrentDropDownParent] = useState({
    id: null,
    name: null,
  });
  const dropdownRef = useRef(null);
  const navBarRef = useRef(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);



  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories({ limit: limit });

  const { data: brandsData } = useBrands({ limit: limit });

  const categories = categoriesData?.envelop?.data || [];
  const brands = brandsData?.data?.brands || [];

  useEffect(() => {
    const updateLimitBasedOnScreenSize = () => {
      if (window.innerWidth < 768) {
        setLimit(8);
      } else {
        setLimit(12);
      }
    };

    // Set initial limit based on current screen size
    updateLimitBasedOnScreenSize();

    // Add event listener to update limit on window resize
    window.addEventListener("resize", updateLimitBasedOnScreenSize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateLimitBasedOnScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        navBarRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !navBarRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setOpenCategoryId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryHover = (content, parent, categoryId) => {
    if (window.innerWidth >= 768) {
      setDropdownContent({ content, parent });
      setDropdownOpen(true);
      setOpenCategoryId(categoryId);
    }
  };
  const handleCategoryClickOnMobile = (content, parent, categoryId) => {
    if (window.innerWidth < 768) {
      setDropdownContent({ content, parent });
      setDropdownOpen((prev) => !prev);
      setOpenCategoryId((prev) => (prev === categoryId ? null : categoryId));
    }
  };



  const handleDropdownLeave = () => {
    if (window.innerWidth >= 768) {
      setDropdownOpen(false);
      setOpenCategoryId(null);
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory?._id === category._id) {
      setSelectedCategory(null);
      setOpenCategoryId(null);
    } else {
      setSelectedCategory(category);
      setOpenCategoryId(category._id);
    }

    setDropdownOpen(false);

    navigate("/products", {
      state: {
        selectedCategory: {
          id: category._id,
          name: category.name,
        },
      },
    });
  };

  const handleClickSubCategory = (subCategory) => {


    const category = categories.find(category => category._id === subCategory.category);
    
    setDropdownOpen(false);

    if (dropdownContent?.parent === "subcategories") {
      navigate("/products", {
        state: {
          selectedSubCategory: subCategory,
          selectedCategory: category,
        },
      });
    } else {
      const brandId = subCategory._id;
      navigate(`/brands/${brandId}`);
    }
  };

  const handleNavigateToParent = () => {
    setDropdownOpen(false);

    if (dropdownContent?.parent === "brands") {
      navigate("/brands");
    } else if (dropdownContent?.parent === "subcategories") {
      navigate("/products", {
        state: {
          selectedCategory: {
            id: currentDropDownParent.id,
            name: currentDropDownParent.name,
          },
        },
      });
    }
  };

  return (
    <div
      className="nav-bar-container"
      onMouseLeave={handleDropdownLeave}
      ref={navBarRef}
    >
      {categories && (
        <ul className="nav-bar-list">
          <li onClick={() => handleCategoryClick({ id: null, name: "All" })}>
            ALL
          </li>
          <li
            onMouseEnter={() => handleCategoryHover(brands, "brands", "brands")}
            onClick={() =>
              window.innerWidth >= 768
                ? navigate("/brands")
                : handleCategoryClickOnMobile(brands, "brands", "brands")
            }
          >
            BRANDS
            <span
              className="arrow-icon"
              style={{
                transform: openCategoryId === "brands" ? "rotate(225deg)" : "rotate(45deg)",
                transition: "transform 0.3s ease",
              }}
            ></span>
          </li>
          {categories.map((category) => (
            <li
              key={category._id}
              onMouseEnter={() => {
                handleCategoryHover(category.subcategories, "subcategories", category._id);
                setCurrentDropDownParent({
                  id: category._id,
                  name: category.name,
                });
              }}
              onClick={() =>
                window.innerWidth >= 768
                  ? handleCategoryClick(category)
                  : handleCategoryClickOnMobile(
                      category.subcategories,
                      "subcategories",
                      category._id
                    )
              }
            >
              {category.name}
              <span
                className="arrow-icon"
                style={{
                  transform: openCategoryId === category._id ? "rotate(225deg)" : "rotate(45deg)",
                  transition: "transform 0.3s ease",
                }}
              ></span>
            </li>
          ))}
        </ul>
      )}
      {dropdownOpen && (
        <div
          className="dropdown-content"
          onMouseLeave={handleDropdownLeave}
          ref={dropdownRef}
        >
          {dropdownContent?.content?.length > 0 && (
            <ul className="dropdown-content-list">
              {dropdownContent?.content?.map((item) => (
                <div
                  key={item.id || item._id}
                  className="dropdown-content-list-item"
                  onClick={() => handleClickSubCategory(item)}
                >
                  <li>{item.name}</li>
                  <p>{item.description}</p>
                </div>
              ))}
            </ul>
          )}
          <div className="view-all-container">
            <button
              className="view-all-container-button"
              onClick={() => handleNavigateToParent()}
            >
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
