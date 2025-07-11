import React, { useState, useRef, useEffect } from "react";
import PageHeader from "../../components/Admin/PageHeader";
import { FaTrash, FaEdit, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  addBanner,
  deleteBanner,
  editBanner,
  getBanners,
} from "../../sevices/bannerApis";
function Banner() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    bannerFor: "",
    image: null,
    mobileImage: null,
  });
  const fileInputRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const mobileFileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await getBanners();
      setBanners(response.data);
    } catch (error) {
      toast.error("Failed to fetch banners");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("bannerFor", formData.bannerFor);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.mobileImage) {
        formDataToSend.append("mobileImage", formData.mobileImage);
      }

      if (editingBanner) {
        await editBanner(editingBanner._id, formDataToSend);
        toast.success("Banner updated successfully");
      } else {
        await addBanner(formDataToSend);
        toast.success("Banner added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
      setIsSubmitting(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = async (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      bannerFor: banner.bannerFor,
      image: null,
      mobileImage: null,
    });
    setImagePreview(banner.image);
    setMobileImagePreview(banner.mobileImage);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      bannerFor: "",
      image: null,
      mobileImage: null,
    });
    setImagePreview(null);
    setMobileImagePreview(null);
    setEditingBanner(null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    resetForm();
  };

  const handleDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const handleMobileImageClick = () => {
    mobileFileInputRef.current.click();
  };

  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mobileImage: file,
      }));
      setMobileImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <PageHeader content="Banner" />
      <div>
        <button
          className="block text-white bg-green-500 hover:bg-green-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center ms-auto mb-2"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Add New Banner
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-16 py-3">
                <span className="sr-only">Image</span>
              </th>
              <th scope="col" className="px-6 py-3">
                Banner Title
              </th>
              <th scope="col" className="px-6 py-3">
                Banner For
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {banners?.map((banner) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={banner._id}
              >
                <td className="p-4">
                  <img
                    src={banner.image}
                    className="w-16 md:w-32 max-w-full max-h-full"
                    alt="Apple Watch"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {banner.title}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {banner.bannerFor}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white flex gap-2 ">
                  <FaTrash
                    className="text-red-500 text-lg"
                    onClick={() => handleDeleteBanner(banner._id)}
                  />
                  <FaEdit
                    className="text-blue-500 text-lg"
                    onClick={() => handleEditBanner(banner)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full h-[600px] overflow-y-auto max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
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
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <div
                  onClick={handleImageClick}
                  className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <FaCamera className="text-white text-3xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-500">Click to upload image</p>
                      <p className="text-gray-500" style={{ fontSize: "12px" }}>
                        ( 3:1 aspect ratio recommended )
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Banner Image
                </label>
                <div
                  onClick={handleMobileImageClick}
                  className="relative w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {mobileImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={mobileImagePreview}
                        alt="Mobile banner preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <FaCamera className="text-white text-3xl" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-500">
                        Click to upload mobile image
                      </p>
                      <p className="text-gray-500" style={{ fontSize: "12px" }}>
                        ( 2:1 aspect ratio recommended )
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={mobileFileInputRef}
                  onChange={handleMobileImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner For
                </label>
                <select
                  name="bannerFor"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleInputChange}
                  value={formData.bannerFor}
                >
                  <option value="" disabled>
                    Select Banner For
                  </option>
                  <option value="hero">Hero</option>
                  <option value="category">Category</option>
                  <option value="product">Product</option>
                </select>
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
                      {editingBanner ? "Updating..." : "Adding..."}
                    </>
                  ) : editingBanner ? (
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
    </>
  );
}

export default Banner;
