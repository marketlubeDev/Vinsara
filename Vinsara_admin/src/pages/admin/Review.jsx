import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import PageHeader from "../../components/Admin/PageHeader";
import { getAllReviews, deleteReview } from "../../sevices/reviewApis";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";

// Add DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Delete Reviews</h2>
          <button
            onClick={onClose}
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
        <div className="mb-6">
          <p className="text-gray-700">
            Are you sure you want to delete {count} selected review
            {count > 1 ? "s" : ""}? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewList = () => {
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Function to fetch reviews
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getAllReviews();
      setReviews(response.reviews);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if text is truncated
  const isTextTruncated = (element) => {
    return element.scrollHeight > element.clientHeight;
  };

  // Function to toggle review expansion
  const toggleReview = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Update the filter function to only search by product name
  const filteredReviews = reviews.filter((review) =>
    review.productId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredReviews.map((review) => review._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (reviewId) => {
    setSelected((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      await Promise.all(selected.map((id) => deleteReview(id)));
      toast.success("Selected reviews deleted successfully");
      setSelected([]);
      setShowDeleteModal(false);
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete reviews");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <PageHeader content="Reviews" />
      <div className="flex flex-col m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingSpinner
                color="primary"
                text="Loading reviews..."
                size="sm"
              />
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No reviews found for this product"
                  : "No reviews found"}
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selected.length === filteredReviews.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Review
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviews.map((review, index) => (
                    <tr
                      key={review._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="w-4 p-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selected.includes(review._id)}
                          onChange={() => handleSelectOne(review._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.userId?.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {review.userId?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm text-gray-600 ${
                              expandedReviews[index] ? "" : "line-clamp-2"
                            }`}
                            ref={(el) => {
                              if (el && !expandedReviews[index]) {
                                const truncated = isTextTruncated(el);
                                if (truncated && !expandedReviews[index]) {
                                  el.dataset.truncated = "true";
                                }
                              }
                            }}
                          >
                            {review.review}
                          </p>
                          {document.querySelector(
                            `[data-truncated="true"]`
                          ) && (
                            <button
                              onClick={() => toggleReview(index)}
                              className="p-1 border rounded bg-gray-100 hover:bg-gray-200 ml-2 flex-shrink-0"
                            >
                              {expandedReviews[index] ? "▲" : "▼"}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.productId?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">
                          {new Date(review?.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  DELETE ({selected.length})
                </button>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "border hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        count={selected.length}
      />
    </div>
  );
};

export default ReviewList;
