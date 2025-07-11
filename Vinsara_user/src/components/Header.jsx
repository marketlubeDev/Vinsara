import React, { useState, useRef, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiUser, FiSearch, FiX } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {
  MdOutlineLocationOn,
  MdOutlineLocalShipping,
  MdOutlineHeadphones,
} from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useProducts, useSearchProducts } from "../hooks/queries/products";
import { NavBar } from "./NavBar";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const [isBrandsListOpen, setIsBrandsListOpen] = useState(false);

  const { data: products } = useProducts();
  const { data: searchProducts, isLoading: searchProductsLoading } =
    useSearchProducts(searchQuery);

  useEffect(() => {
    setSearchResults(searchProducts?.data?.products);
  }, [searchProducts]);



  const toggleSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleUserMenu = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate("/login");
    }
  };

  const handleMenuItemClick = (item) => {
    setIsUserMenuOpen(false);
    if (item === "logout") {
      localStorage.removeItem("user-auth-token");
      dispatch(logout());
      navigate("/login");
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const categories = data?.envelop?.data || [];

  // const handleCategoryClick = (category) => {
  //   if (selectedCategory?._id === category._id) {
  //     setSelectedCategory(null);
  //   } else {
  //     setSelectedCategory(category);
  //   }

  //   navigate("/products", {
  //     state: {
  //       selectedCategory: {
  //         id: category._id,
  //         name: category.name,
  //       },
  //     },
  //   });
  // };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleMobileSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleBrandsList = () => {
    setIsBrandsListOpen(!isBrandsListOpen);
  };

  return (
    <>
      <header className="header">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="header-logo">
            <img
              src={"/logo/Logo.svg"}
              alt="logo"
              className="header-logo-img"
            />
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="header-search desktop-search">
          <div className="search-container">
            {/* <div className="category-dropdown">
              <IoIosArrowDown className="dropdown-icon" />
              <select>
                <option value="all">All Categories</option>
                {categories?.map((category) => (
                  <option
                    key={category._id}
                    value={category.name}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div> */}
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
              className="search-input"
            />
            <button className="search-button">
              <FiSearch className="search-icon" />
            </button>
          </div>
          {searchQuery && searchResults?.length > 0 && (
            <div className="search-results">
              {searchResults?.map((product) => (
                <div
                  key={product?._id}
                  className="search-result-item"
                  onClick={() => handleProductClick(product?._id)}
                >
                  <img
                    className="search-result-image"
                    src={product?.mainImage}
                    alt={product?.name}
                  />
                  <span>{product?.name}</span>
                  {/* <span>{product.category.name}</span> */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          {/* Mobile Search Icon */}
          <div className="header-actions-item mobile-search-icon">
            <FiSearch className="icon" onClick={toggleSearch} />
          </div>
          {/* <div className="header-actions-item">
            <FiHeart className="icon" />
          </div> */}
          <div
            className="header-actions-item user-menu-container"
            ref={userMenuRef}
          >
            {/* <FiUser className="icon" onClick={toggleUserMenu} /> */}

            {/* {isUserMenuOpen && isLoggedIn && (
              <div className={`user-menu ${isUserMenuOpen ? "active" : ""}`}>
                <Link
                  to="/profile?tab=personal-info"
                  className="user-menu-header"
                  onClick={() => handleMenuItemClick("profile")}
                >
                  <div className="user-avatar">
                    <img src="/images/user/profilepicture.jpg" alt="User" />
                  </div>
                  <div className="user-info">
                    <h4>{user?.username}</h4>
                    <p>{user?.email}</p>
                  </div>
                  <IoIosArrowForward className="arrow-icon" />
                </Link>

                <div className="user-menu-items">
                  <Link
                    to="/profile?tab=saved-address"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("saved-address")}
                  >
                    <MdOutlineLocationOn className="menu-icon" />
                    <span>Saved Address</span>
                  </Link>
                  <Link
                    to="/profile?tab=order-history"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("order-history")}
                  >
                    <MdOutlineLocalShipping className="menu-icon" />
                    <span>Order status</span>
                  </Link>
                  <Link
                    to="/profile?tab=help-support"
                    className="menu-item"
                    onClick={() => handleMenuItemClick("help-support")}
                  >
                    <MdOutlineHeadphones className="menu-icon" />
                    <span>Help & support</span>
                  </Link>
                  <Link
                    to="/login"
                    className="menu-item logout"
                    onClick={() => handleMenuItemClick("logout")}
                  >
                    <BiLogOut className="menu-icon" />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div
          className={`mobile-search-overlay ${isSearchOpen ? "active" : ""}`}
        >
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="mobile-search-input"
              value={searchQuery}
              onChange={handleMobileSearchInputChange}
            />
            <button className="mobile-search-close" onClick={toggleSearch}>
              <FiX className="icon" />
            </button>
          </div>
          {searchQuery && searchResults?.length > 0 && (
            <div className="mobile-search-results">
              {searchResults?.map((product) => (
                <div
                  key={product?._id}
                  className="search-result-item mobile-result-item"
                  onClick={() => handleProductClick(product?._id)}
                >
                  <img
                    className="search-result-image mobile-result-image"
                    src={product?.mainImage}
                    alt={product?.name}
                  />
                  <span>{product?.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div className="header-item" onClick={toggleBrandsList}>
          Brands
        </div> */}

        {/* <BrandsList
          isOpen={isBrandsListOpen || selectedCategory !== null}
          category={selectedCategory}
        /> */}  
      </header>
      <NavBar />
    </>
  );
}
