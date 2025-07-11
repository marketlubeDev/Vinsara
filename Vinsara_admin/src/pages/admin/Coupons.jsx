import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import PageHeader from "../../components/Admin/PageHeader";
import { toast } from "react-toastify";
import {
  createCoupon,
  editCoupon,
  searchCoupon,
  removeCoupon,
  getAllCoupons,
} from "../../sevices/couponApi";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
// CouponForm Component
const CouponForm = ({ onSubmit, initialData, isSubmitting }) => {
  const [formData, setFormData] = useState(
    initialData ? {
      ...initialData,
      expiryDate: new Date(initialData.expiryDate).toISOString().split('T')[0]
    } : {
      code: "",
      discountType: "percentage",
      discountAmount: "",
      minPurchase: "",
      maxDiscount: "",
      expiryDate: "",
      description: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Function to handle discount type change
  const handleDiscountTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      discountType: newType,
      discountAmount: "", // Reset discount amount when type changes
    }));
  };

  // Function to handle discount amount change
  const handleDiscountAmountChange = (e) => {
    const value = e.target.value;
    if (formData.discountType === "percentage") {
      // For percentage, limit between 0 and 100
      if (value >= 0 && value <= 100) {
        setFormData((prev) => ({ ...prev, discountAmount: value }));
      }
    } else {
      // For fixed amount, any positive number
      if (value >= 0) {
        setFormData((prev) => ({ ...prev, discountAmount: value }));
      }
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coupon Code
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter coupon code"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount Type
          </label>
          <select
            value={formData.discountType}
            onChange={handleDiscountTypeChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.discountType === "percentage"
              ? "Percentage Discount"
              : "Fixed Amount Discount"}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              value={formData.discountAmount}
              onChange={handleDiscountAmountChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-8"
              placeholder={`Enter ${
                formData.discountType === "percentage" ? "percentage" : "amount"
              }`}
              required
              min="0"
              max={formData.discountType === "percentage" ? "100" : undefined}
              step={formData.discountType === "percentage" ? "0.01" : "1"}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {formData.discountType === "percentage" ? "%" : "₹"}
              </span>
            </div>
          </div>
          {formData.discountType === "percentage" && (
            <p className="mt-1 text-sm text-gray-500">
              Enter a value between 0 and 100
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Purchase
          </label>
          <input
            type="number"
            value={formData.minPurchase}
            onChange={(e) =>
              setFormData({ ...formData, minPurchase: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Enter minimum purchase amount"
            required
          />
        </div>

        {/* Maximum Discount field - only show for percentage type */}
        {formData.discountType === "percentage" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Discount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, maxDiscount: e.target.value })
                }
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-8"
                placeholder="Enter maximum discount amount"
                required
                min="0"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Maximum amount that can be discounted
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
            min={minDate}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows="3"
          placeholder="Enter coupon description"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onSubmit(null, true)} // Pass true to indicate cancel
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {initialData ? "Updating..." : "Adding..."}
            </>
          ) : initialData ? (
            "Update"
          ) : (
            "Add"
          )}
        </button>
      </div>
    </form>
  );
};

// CouponTable Component
const CouponTable = ({ coupons, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Purchase
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Discount
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900">
                    {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 font-medium">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountAmount}%`
                      : `₹${coupon.discountAmount}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900">₹{coupon.minPurchase}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.discountType === "percentage" ? (
                    <span className="text-gray-900">₹{coupon.maxDiscount}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 truncate">
                      {coupon.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      new Date(coupon.expiryDate) > new Date()
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {new Date(coupon.expiryDate) > new Date()
                      ? "Active"
                      : "Expired"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(coupon)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Edit Coupon"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(coupon._id, coupon.code)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Coupon"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add this new component for delete confirmation
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  couponCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Delete Coupon</h2>
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
            Are you sure you want to delete the coupon{" "}
            <span className="font-semibold">{couponCode}</span>? This action
            cannot be undone.
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

// Main Coupon Component
const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // Fetch all coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch coupons function
  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCoupons();
      setCoupons(response.coupons);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setIsLoading(true);
          const response = await searchCoupon(searchQuery);
          setCoupons(response.data.coupons);
        } catch (error) {
          toast.error(error.response?.data?.message || "Search failed");
        } finally {
          setIsLoading(false);
        }
      } else {
        fetchCoupons();
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSubmit = async (formData, isCancel = false) => {
    if (isCancel) {
      setShowModal(false);
      setEditingCoupon(null);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await editCoupon(editingCoupon._id, formData);
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(formData);
        toast.success("Coupon created successfully");
      }
      setShowModal(false);
      setEditingCoupon(null);
      fetchCoupons(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleDelete = async (couponId, couponCode) => {
    setCouponToDelete({ id: couponId, code: couponCode });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeCoupon(couponToDelete.id);
      toast.success("Coupon deleted successfully");
      fetchCoupons(); // Refresh the list
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <PageHeader content="Coupons" />
      <div className="flex justify-between items-center m-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          type="button"
        >
          Add New Coupon
        </button>
      </div>
      <div className="flex flex-col m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center justify-between flex-wrap md:flex-row p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? "Search Results" : "Active Coupons"}
              </h2>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <LoadingSpinner
                color="primary"
                text="Loading coupons..."
                size="sm"
              />
            ) : coupons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No coupons found
              </div>
            ) : (
              <CouponTable
                coupons={coupons}
                onEdit={handleEdit}
                onDelete={(id, code) => handleDelete(id, code)}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
            <CouponForm
              onSubmit={handleSubmit}
              initialData={editingCoupon}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Add the DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCouponToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        couponCode={couponToDelete?.code}
      />
    </div>
  );
};

export default Coupon;
