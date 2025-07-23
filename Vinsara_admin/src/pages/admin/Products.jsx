import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listProducts, searchProducts } from "../../sevices/ProductApis";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

import PageHeader from "../../components/Admin/PageHeader";
import ProductTable from "../../components/Admin/Product/components/Table/ProductTable";
import Pagination from "../../components/Admin/Product/components/Pagination/Pagination";
import { Modal } from "../../components/shared/Modal";
import { BulkOfferForm } from "../../components/Admin/Product/components/Forms/BulkOfferForm";
import { useSelector } from "react-redux";
import { adminUtilities } from "../../sevices/adminApis";

function Products({ role }) {
  // const stores = useSelector((state) => state.adminUtilities.stores);
  // const brands = useSelector((state) => state.adminUtilities.brands);
  // const categories = useSelector((state) => state.adminUtilities.categories);
  const store = useSelector((state) => state.store.store);
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [labels, setLabels] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pageRender, setPageRender] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStore, setSelectedStore] = useState(store?._id);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedActiveStatus, setSelectedActiveStatus] = useState("all");
  const [showSubcategory, setShowSubcategory] = useState([]);
  const navigate = useNavigate();

  const [showBulkOfferModal, setShowBulkOfferModal] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false);
  const selectedProductsCount = selectedProducts?.length;

  // handleIsProductSelected
  useEffect(() => {
    const handleIsProductSelected = () => {
      if (selectedProducts.length > 0) {
        setIsProductSelected(true);
      } else {
        setIsProductSelected(false);
      }
    };
    handleIsProductSelected();
  }, [selectedProducts]);

  useEffect(() => {
    setSelectedSubcategory("All Subcategories");
    if (selectedCategory) {
      setShowSubcategory(
        subcategories?.filter(
          (subcategory) => subcategory?.category === selectedCategory
        )
      );
    } else {
      setShowSubcategory([]);
    }
  }, [selectedCategory]);

  // Fetch products when page changes or on initial load
  useEffect(() => {
    const fetchAdminUtilities = async () => {
      try {
        const res = await adminUtilities();
        setStores(res?.data?.stores);
        setBrands(res?.data?.brands);
        setCategories(res?.data?.categories);
        setSubcategories(res?.data?.subcategories);
        setLabels(res?.data?.labels);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch admin utilities");
      }
    };
    fetchAdminUtilities();
  }, []);

  useEffect(() => {
    let filter = {};
    if (selectedStore) {
      filter.store = selectedStore;
    }
    if (selectedBrand && selectedBrand !== "All Brands") {
      filter.brandId = selectedBrand;
    }
    if (selectedCategory && selectedCategory !== "All Categories") {
      filter.categoryId = selectedCategory;
    }
    if (selectedActiveStatus) {
      filter.activeStatus = selectedActiveStatus;
    }
    if (selectedSubcategory && selectedSubcategory !== "All Subcategories") {
      filter.subcategoryId = selectedSubcategory;
    }
    if (selectedLabel && selectedLabel !== "All Labels") {
      filter.labelId = selectedLabel;
    }
    if (searchKeyword) {
      filter.search = searchKeyword;
    }
    fetchProducts(currentPage, filter);
  }, [
    currentPage,
    pageRender,
    pageSize,
    selectedStore,
    selectedBrand,
    selectedCategory,
    selectedActiveStatus,
    selectedSubcategory,
    selectedLabel,
    searchKeyword,
  ]);

  const fetchProducts = async (page, filter) => {
    try {
      setIsLoading(true);

      const res = await listProducts(page, pageSize, filter);
      setProducts(res?.data?.data?.products);
      setTotalPages(res?.data?.data?.totalPages);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  // const debouncedSearchProducts = useCallback(
  //   debounce(async (keyword) => {
  //     if (!keyword.trim()) {
  //       fetchProducts(currentPage);
  //       return;
  //     }

  //     try {
  //       setIsLoading(true);
  //       const res = await fetchProducts(currentPage, {
  //         search: keyword,
  //       });
  //     } catch (err) {
  //       toast.error("Failed to search products");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, 1000),
  //   [currentPage]
  // );

  // Handle search input changes
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setCurrentPage(1); // Reset to first page on new search
    // debouncedSearch(value);
  };

  // Perform search with pagination
  // const performSearch = async (keyword, page) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await searchProducts({
  //       keyword,
  //       page,
  //       limit: pageSize,
  //     });
  //     setProducts(res?.data?.data?.products);
  //     setTotalPages(res?.data?.data?.totalPages);
  //   } catch (err) {
  //     toast.error("Failed to search products");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle All products checkbox selection
  const handleSelectAll = (e, currentPage) => {
    if (e.target.checked) {
      // Select all products on the current page
      setSelectedProducts((prevSelected) => [
        ...prevSelected,
        ...products.map((product) => product._id),
      ]);
      setIsProductSelected(true);
    } else {
      // Deselect only the products from the current page
      setSelectedProducts((prevSelected) =>
        prevSelected.filter(
          (productId) => !products.some((product) => product._id === productId)
        )
      );
      setIsProductSelected(false);
    }
  };

  // Handle page size change
  // const handlePageSizeChange = (e) => {
  //   const newPageSize = parseInt(e.target.value);
  //   setPageSize(newPageSize);
  //   setCurrentPage(1); // Reset to first page when changing page size
  // };

  // Cleanup debounce on component unmount
  // useEffect(() => {
  //   return () => {
  //     debouncedSearchProducts.cancel();
  //   };
  // }, [debouncedSearchProducts]);

  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    setIsProductSelected(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      <PageHeader content="Products" marginBottom="mb-0" />
      <div className="bg-white p-4 shadow flex gap-2 flex-wrap">
        <div className="text-sm text-gray-600 space-y-1">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
          >
            <option value="All Categories">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <select
            value={selectedSubcategory}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
            disabled={
              !selectedCategory || selectedCategory === "All Categories"
            }
          >
            <option value="All Subcategories">All Subcategories</option>
            {showSubcategory?.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <select
            value={selectedLabel}
            onChange={(e) => {
              setSelectedLabel(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
          >
            <option value="All Labels">All Labels</option>
            {labels?.map((label) => (
              <option key={label._id} value={label._id}>
                {label?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 w-60"
            value={selectedActiveStatus}
            onChange={(e) => {
              setSelectedActiveStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Active/Inactive</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col  m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          {/* Header section with Add Product button and Search */}
          <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
            {/* search-bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchInput}
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search products..."
              />
            </div>
            {/* buttons */}
            <div className="flex gap-2">
              {/* {isProductSelected && (
                <button className="font-semibold text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors">
                  x Remove Offer
                </button>
              )} */}
              <button
                onClick={() => setShowBulkOfferModal(true)}
                className="border-2 border-green-500 text-green-500 p-2 rounded-md hover:bg-green-500 hover:text-white transition-colors"
              >
                + Add Bulk Offer
              </button>
              {!isProductSelected && (
                <button
                  onClick={() =>
                    navigate("addproduct", {
                      state: {
                        storeId: store?._id,
                      },
                    })
                  }
                  className="bg-green-500 p-2 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  + Add Product
                </button>
              )}
            </div>
          </div>

          {/* Bulk Offer Modal */}
          <Modal
            isOpen={showBulkOfferModal}
            onClose={() => setShowBulkOfferModal(false)}
          >
            <BulkOfferForm
              onClose={() => setShowBulkOfferModal(false)}
              isProductSelected={isProductSelected}
              selectedProducts={selectedProducts}
              setPageRender={setPageRender}
              clearSelectedProducts={clearSelectedProducts}
            />
          </Modal>

          {/* Table section with loading state */}
          <div className="overflow-y-auto flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <LoadingSpinner color="primary" text="Loading..." fullScreen />
              </div>
            )}
            {!isLoading && products?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No products found
              </div>
            ) : (
              <ProductTable
                products={products}
                onSelectAll={handleSelectAll}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                isProductSelected={isProductSelected}
                selectedProductsCount={selectedProductsCount}
                role={role}
                currentPage={currentPage}
                refetchProducts={fetchProducts}
              />
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="sticky bottom-0 flex items-center justify-end p-4 bg-white border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
