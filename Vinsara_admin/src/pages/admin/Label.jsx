import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import {
  getAllLabels,
  searchLabel,
  addLabel,
  editLabel,
  deleteLabel,
} from "../../sevices/labelApis";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import LoadingSpinner from "../../components/spinner/LoadingSpinner";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmationModal from "../../components/Admin/ConfirmationModal";

function Label() {
  const [labels, setLabels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      const response = await getAllLabels();
      setLabels(response.envelop.data);
    } catch (error) {
      toast.error("Failed to fetch labels");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        fetchLabels();
        return;
      }

      try {
        setLoading(true);
        const response = await searchLabel(query);
        setLabels(response.label);
      } catch (error) {
        toast.error("Failed to search labels");
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingLabel) {
        await editLabel(editingLabel._id, formData);
        toast.success("Label updated successfully");
      } else {
        await addLabel(formData);
        toast.success("Label added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchLabels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      description: label.description,
    });
    setShowModal(true);
  };

  const handleDelete = (labelId) => {
    const label = labels.find(l => l._id === labelId);
    setLabelToDelete(label);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setLabelToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteLabel(labelToDelete._id);
      toast.success("Label deleted successfully");
      fetchLabels();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingLabel(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <PageHeader content="Labels" />

      <div className="flex flex-col m-4">
        <div className="relative overflow-hidden shadow-md sm:rounded-lg flex flex-col flex-1 bg-white">
          <div className="flex items-center justify-between px-3">
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
                  onChange={handleSearch}
                  className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name"
                />
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowModal(true)}
                className="block text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                type="button"
              >
                Add New Label
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Label ID
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Label Name
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      <LoadingSpinner
                        color="primary"
                        text="Loading labels..."
                        size="sm"
                      />
                    </td>
                  </tr>
                ) : labels.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No labels found
                    </td>
                  </tr>
                ) : (
                  labels.map((label) => (
                    <tr
                      key={label._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {label._id}
                      </td>
                      <td className="px-6 py-4">{label.name}</td>
                      <td className="px-6 py-4 gap-2 flex">
                        <button
                          onClick={() => handleEdit(label)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          <FaEdit size={20} />
                        </button>

                        <button
                          onClick={() => handleDelete(label._id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          <FaTrash size={20} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingLabel ? "Edit Label" : "Add New Label"}
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
                  Label Name
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
                      {editingLabel ? "Updating..." : "Adding..."}
                    </>
                  ) : editingLabel ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete the label "${labelToDelete?.name}"?`}
        isLoading={isDeleting}
        confirmButtonText="Delete"
        confirmButtonColor="red"
      />
    </div>
  );
}

export default Label;
