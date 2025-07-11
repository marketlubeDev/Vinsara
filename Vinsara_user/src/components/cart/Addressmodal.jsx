import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUser } from "../../hooks/queries/user";
import { usePlaceOrder } from "../../hooks/queries/order";
import ButtonLoading from "../ButtonLoadingSpinners";
import { toast } from "sonner";
import { setUser } from "../../redux/features/user/userSlice";
import userService from "../../api/services/userService";

const AddressModal = ({ isOpen, onClose, mode = "cart" }) => {
  const user = useSelector((state) => state.user.user);
  const [selectedAddress, setSelectedAddress] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: user?.username,
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutate: placeOrder, isPending: isOrderPending } = usePlaceOrder();
  const savedAddresses = user?.address;

  useEffect(() => {
    updatedUser();
  }, []);

  const updatedUser = async () => {
    const response = await userService.getAuthUser();
    dispatch(setUser(response.user));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saveAddress" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "cart") {
      if (
        !selectedAddress &&
        (!formData.building ||
          !formData.street ||
          !formData.city ||
          !formData.state ||
          !formData.pincode)
      ) {
        toast.warning("Please select an address or fill all required fields");
        return;
      }
      handlePlaceOrder();
    } else {
      // For address mode, check if all required fields are filled
      if (
        !formData.building ||
        !formData.street ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        toast.warning("Please fill all required fields");
        return;
      }
      const updatedUser = {
        ...user,
        address: formData,
      };
      updateUser(updatedUser);
    }

    // Reset form and close modal
    setFormData({
      fullName: user?.username,
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
    onClose();
  };

  const handlePlaceOrder = () => {
    const { fullName, building, street, city, state, pincode } = formData;

    if (
      selectedAddress ||
      (fullName && building && street && city && state && pincode)
    ) {
      const address = selectedAddress ? selectedAddress : formData;
      placeOrder(address, {
        onSuccess: (data) => {
          handleWhatsAppRedirect(data.order);
          onClose();
        },
      });
    } else {
      toast.warning(
        "Please select an address or fill in all required fields.",
        {
          position: "top-right",
        }
      );
    }
  };

  const handleWhatsAppRedirect = (data) => {
   

    const message = `
    *Hello! I would like to place a new order*
    ------------------

    *My Contact Details:*
    Email: ${data.user.email}

    *Please deliver to:*
    ${data.deliveryAddress.fullName}
    ${data.deliveryAddress.street}
    ${
      data.deliveryAddress.landmark ? data.deliveryAddress.landmark + "\n" : ""
    }${data.deliveryAddress.city}
    ${data.deliveryAddress.state} - ${data.deliveryAddress.pincode}

    *I would like to order:*
    ${data.products
      .map(
        (item, index) => `
    ${index + 1}. ${item.productId.name}
      ${
        item.variantId?.attributes?.title
          ? `Variant: ${item.variantId.attributes.title}`
          : ""
      }
      Quantity: ${item.quantity}
      Price: ₹${item.price}

    Product Image:
    ${
      item.variantId?.images?.length
        ? item.variantId.images[0]
        : item.productId.images[0]
    }
    `
      )
      .join("\n")}

    *Order Details:*
    ------------------
    Total Amount: ₹${data.totalAmount}
    Payment Method: ${data.paymentMethod}
    ${data.couponApplied ? `Coupon Code: ${data.couponApplied}` : ""}

    Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "918714441727";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className={`address-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Address</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {mode === "cart" ? (
            <>
              <h3>Where Should We Deliver?</h3>
              <p className="subtitle">
                Enter your address or select a saved one to ensure a smooth and
                timely delivery.
              </p>

              {savedAddresses?.map((addr) => (
                <label key={addr?._id} className="address-option">
                  <input
                    type="radio"
                    name="address"
                    value={addr?._id}
                    checked={selectedAddress === addr?._id}
                    onChange={() => setSelectedAddress(addr?._id)}
                  />
                  <div className="address-details">
                    <strong>{addr?.fullName}</strong>
                    <p>{addr?.street}</p>
                    <p>{addr?.city}</p>
                    <p>{addr?.state}</p>
                    <p>{addr?.landmark}</p>
                    <p>{addr?.pincode}</p>
                  </div>
                </label>
              ))}

              <div className="divider">or</div>
            </>
          ) : (
            <>
              <h3>Add a New Delivery Address</h3>
              <p className="subtitle">
                Enter your address details to ensure accurate delivery and
                seamless service
              </p>
            </>
          )}

          <h3 className="manual-entry-title">Enter address</h3>

          <form className="address-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="building"
              placeholder="House/Apartment Name"
              value={formData.building}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={formData.landmark}
              onChange={handleInputChange}
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {mode === "cart" ? (
          <div className="modal-footer">
            <label className="save-address">
              <input
                type="checkbox"
                name="saveAddress"
                checked={formData.saveAddress}
                onChange={handleInputChange}
                disabled={user?.address?.length >= 3}
              />
              {user?.address?.length >= 3
                ? "You can only save 3 addresses go to profile to delete some"
                : "Save this address for future purchases"}
            </label>
            <button
              className="proceed-btn"
              disabled={isOrderPending}
              onClick={handlePlaceOrder}
            >
              {isOrderPending ? <ButtonLoading /> : <span>Place Order</span>}
            </button>
          </div>
        ) : (
          <div className="modal-footer">
            <button
              className="save-btn"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? <ButtonLoading /> : <span>Save Address</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;
