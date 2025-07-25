import React, { useState, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllCategories } from "../../sevices/categoryApis";
import {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  searchSubCategory,
} from "../../sevices/subcategoryApis";
import { toast } from "react-toastify";

function Subcategories() {
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const subcategoryList = categories.flatMap((category) =>
      (category.subcategories || []).map((subcat) => ({
        ...subcat,
        parentCategoryName: category.name,
        parentCategoryId: category._id,
      }))
    );
    setSubcategories(subcategoryList);
  }, [categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.envelop.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setEditingSubcategory(null);
    setFormData({
      name: "",
      category: "",
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubcategory(null);
    setFormData({
      name: "",
      category: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setLoading(true);
          const response = await searchSubCategory(searchQuery);
          setSubcategories(response.data || response);
        } catch (error) {
          toast.error("Failed to search subcategories");
        } finally {
          setLoading(false);
        }
      } else {
        // If search is empty, fetch all subcategories
        fetchCategories();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        const response = await updateSubCategory(
          editingSubcategory._id,
          formData
        );
        toast.success("Subcategory updated successfully");
        handleCloseModal();
        fetchCategories();
      } else {
        const response = await createSubCategory(formData);
        toast.success("Subcategory added successfully");
        handleCloseModal();
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subcategory");
    }
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      category: subcategory.category,
    });
    setShowModal(true);
  };

  const handleDelete = async (subcategoryId) => {
    try {
      await deleteSubCategory(subcategoryId);
      toast.success("Subcategory deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  // Flatten subcategories for table display

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <PageHeader content="Subcategories" />

      <div className="flex flex-col flex-1 m-4">
        <div className="flex flex-col h-full bg-white shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between px-3 py-4 border-b">
            <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
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
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search categories or subcategories..."
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      fetchCategories();
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={handleOpenModal}
                className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
              >
                Add New Subcategory
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Subcategory
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <tr
                      key={subcategory._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {subcategory.name}
                      </td>
                      <td className="px-6 py-4">
                        {subcategory.parentCategoryName ||
                          subcategory.category.name}
                      </td>
                      <td className="px-6 py-4">
                        {subcategory.createdAt
                          ? new Date(subcategory.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <button
                          className="font-medium text-blue-600 hover:underline"
                          onClick={() => handleEdit(subcategory)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="font-medium text-red-600 hover:underline"
                          onClick={() => handleDelete(subcategory._id)}
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No subcategories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-auto">
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">
                        {subcategories.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {subcategories.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                        1
                      </button>
                      <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span className="sr-only">Next</span>
                        <FaChevronRight
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingSubcategory
                  ? "Edit Subcategory"
                  : "Add New Subcategory"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {editingSubcategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subcategories;
