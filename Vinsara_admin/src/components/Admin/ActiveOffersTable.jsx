// ActiveOffersTable.jsx
import React, { useState } from "react";
// import { FaTrash } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/axiosInstance";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "../spinner/LoadingSpinner";

export const ActiveOffersTable = ({ offers, fetchData, loading }) => {
  const [selectedOffer, setSelectedOffer] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);


  const handleDeleteOffer = async () => {
    try {
     await axiosInstance.delete(`/offer/${selectedOffer}`);
      toast.success("Offers deleted successfully");
      fetchData();
      setDeleteConfirmation(false);
    } catch (error) {
      toast.error("Error deleting offers");
    }
  };

  const confirmDelete = (offerId) => {
    setSelectedOffer(offerId);

    setDeleteConfirmation(true);
  };

  return (
    <div className="overflow-x-auto py-12 px-5">
      <table className="min-w-full bg-white rounded-xl drop-shadow-lg shadow-xl">
        <thead className="bg-green-100 text-gray-600 *:text-sm *:font-normal">
          <tr>
            <th className="py-2 px-4">Offer Name</th>
            <th className="py-2 px-4">Banner</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Details</th>
            <th className="py-2 px-4">Offer Value</th>
            <th className="py-2 px-4">Start Date</th>
            <th className="py-2 px-4">End Date</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 *:text-sm">
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                <LoadingSpinner />
              </td>
            </tr>
          ) : (
            <>
              {!loading && offers.length === 0 ? (
                <div className="text-center py-4 text-gray-500 font-medium w-full">
                  No Offers found
                </div>
              ) : (
                offers.map((offer, index) => (
                  <tr key={index} className="text-center border-b">
                    <td className="py-2 px-4 font-medium text-gray-800">
                      {offer.offerName}
                    </td>
                    <td className="py-2 px-4">
                      <img
                        src={offer.bannerImage}
                        alt={offer.offerName}
                        className="h-10 mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4">{offer.offerType}</td>
                    <td className="py-2 px-4">
                      {offer.offerType === "brand" && offer.brand.name}
                      {offer.offerType === "category" && offer.category.name}
                      {offer.offerType ==="brandCategory" && offer.brand.name + "/" + offer.category.name}
                    </td>
                    <td className="py-2 px-4 text-green-500 font-medium">
                      {offer.offerValue}{" "}
                      {offer.offerMetric === "percentage" ? "%" : "₹"}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(offer.startDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(offer.endDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="text-red-500 font-extrabold"
                        onClick={() => confirmDelete(offer._id)}
                      >
                        <GoTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </>
          )}
        </tbody>
      </table>

      {deleteConfirmation && (
        <ConfirmationModal
          isOpen={deleteConfirmation}
          message="Are you sure you want to delete these offers?"
          onConfirm={handleDeleteOffer}
          onClose={() => setDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};
