// export default AddressModal;
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUser } from "../../hooks/queries/user";
import { usePlaceOrder } from "../../hooks/queries/order";
import ButtonLoading from "../ButtonLoadingSpinners";
import { toast } from "sonner";
import userService from "../../api/services/userService";
import { setUser } from "../../redux/features/user/userSlice";
import apiClient from "../../api/client";
import RenderRazorpay from "../Razorpay/RenderRazorpay";
import { useNavigate } from "react-router-dom";
const AddressModal = ({ isOpen, onClose, mode = "cart" }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    building: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
  });

  const [orderDetails, setOrderDetails] = useState({});
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [isSelectingPayment, setIsSelectingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [onOrderPending, setOnOrderPending] = useState(false);
  useEffect(() => {
    updatedUser();
  }, []);

  // Initialize fullName when modal opens
  useEffect(() => {
    if (isOpen && user?.username && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: user.username
      }));
    }
  }, [isOpen, user?.username]);

  const updatedUser = async () => {
    const response = await userService.getAuthUser();
    dispatch(setUser(response?.user));
  };

  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { mutate: placeOrder, isPending: isOrderPending } = usePlaceOrder();
  const savedAddresses = user?.address || [];

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

  useEffect(() => {
    return () => {
      setSelectedAddress("");
      setPaymentMethod("");
      setOnOrderPending(false);
    };
  }, []);

  const resetForm = () => {
    setFormData({
      fullName: user?.username || "",
      phoneNumber: "",
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure fullName is populated before validation
    const currentFullName = formData.fullName || user?.username || "";
    
    if (
      currentFullName === "" ||
      formData.phoneNumber === "" ||
      formData.building === "" ||
      formData.street === "" ||
      formData.city === "" ||
      formData.state === "" ||
      formData.pincode === ""
    ) {
      toast.warning("Please fill all the fields");
      return;
    }

    // Only save if in profile mode or if saveAddress is checked in cart mode
    if (mode === "profile" || (mode === "cart" && formData.saveAddress)) {
      // Ensure fullName is included in the address data
      const addressData = {
        ...formData,
        fullName: currentFullName,
      };

      console.log("Address data being saved:", addressData);

      // Check for duplicate addresses
      const existingAddresses = user?.address || [];
      const isDuplicate = existingAddresses.some(addr => 
        addr.fullName === addressData.fullName &&
        addr.phoneNumber === addressData.phoneNumber &&
        addr.building === addressData.building &&
        addr.street === addressData.street &&
        addr.city === addressData.city &&
        addr.state === addressData.state &&
        addr.pincode === addressData.pincode
      );

      if (isDuplicate) {
        toast.warning("This address already exists");
        return;
      }

      const updatedUser = {
        ...user,
        address: [ addressData],
      };
      
      updateUser(updatedUser);
      toast.success("Address saved successfully");
    }
    
    // Reset form
    setFormData({
      fullName: user?.username || "",
      phoneNumber: "",
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

  const handlePlaceOrder = async () => {
    setOnOrderPending(true);
    if (paymentMethod == "") {
      toast.warning("Please select a payment method", {
        position: "top-right",
      });
      setOnOrderPending(false);
      return;
    }

    try {
      const { fullName, phoneNumber, building, street, city, state, pincode } = formData;

      if (
        Object.keys(selectedAddress).length > 0 ||
        (fullName && phoneNumber && building && street && city && state && pincode)
      ) {
        if (paymentMethod == "online") {
          const response = await apiClient.post(`/order/paymentIntent`);

          if (response && response.data.order_id) {
            setOrderDetails({
              orderId: response.data.order_id,
              currency: response.data.currency,
              amount: response.data.amount,
            });
            setDisplayRazorpay(true);
          }
        } else {
          try {
            const response = await apiClient.post(`/order/placeOrder`, {
              address:
                Object.keys(selectedAddress).length > 0
                  ? selectedAddress
                  : formData,
              paymentMethod,
              amount: orderDetails.amount,
            });

            if (response && response.data.success) {
              navigate("/payment-success");
              onClose();
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Something went wrong",
              {
                position: "top-right",
              }
            );
            console.log(error);
          }
        }
      } else {
        toast.warning(
          "Please select an address or fill in all required fields.",
          {
            position: "top-right",
          }
        );
        setIsSelectingPayment(false);
        setOnOrderPending(false);
      }
    } catch (error) {
      console.log(error);
      setOnOrderPending(false);
    } finally {
      setOnOrderPending(false);
      setIsSelectingPayment(false);
    }
  };

  const handleAddressSelection = () => {
    const { fullName, phoneNumber, building, street, city, state, pincode } = formData;

    if (
      Object.keys(selectedAddress).length > 0 ||
      (fullName && phoneNumber && building && street && city && state && pincode)
    ) {
      setIsSelectingPayment(true);
    } else {
      toast.warning(
        "Please select an address or fill in all required fields.",
        {
          position: "top-right",
        }
      );
    }
  };
  return (
    <div className={`address-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isSelectingPayment ? "Payment" : "Address"}</h2>
          <button
            className="modal-close-btn"
            onClick={() => {
              onClose();
              setIsSelectingPayment(false);
              setSelectedAddress({});
            }}
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {isSelectingPayment && mode === "cart" ? (
            <>
              <h3>Choose Payment Method</h3>
              <p className="subtitle">
                Select how you'd like to pay for your order:
              </p>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash On Delivery
                <span>(Cash, UPI and cards are accepted on delivery)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
                <span>
                  (UPI, Net banking, Debit Card/Credit Card can be used)
                </span>
              </label>
            </>
          ) : (
            <>
              {mode === "cart" && (
                <>
                  <h3>Where Should We Deliver?</h3>
                  <p className="subtitle">
                    Enter your address or select a saved one to ensure a smooth
                    and timely delivery.
                  </p>

                  {savedAddresses?.map((addr) => (
                    <label key={addr?._id} className="address-option">
                      <input
                        type="checkbox"
                        name="address"
                        value={addr?._id}
                        checked={selectedAddress === addr?._id}
                        onChange={() => {
                          if (selectedAddress === addr?._id) {
                            setSelectedAddress("");
                          } else {
                            setSelectedAddress(addr?._id);
                          }
                          resetForm();
                        }}
                      />
                      <div className="address-details">
                        <strong>{addr?.fullName}</strong>
                        <p>{addr?.phoneNumber}</p>
                        <p>{addr?.building || addr?.houseApartmentName}</p>
                        <p>{addr?.street}</p>
                        <p>{addr?.landmark}</p>
                        <p>{addr?.city}</p>
                        <p>{addr?.state}</p>
                        <p>{addr?.pincode}</p>
                      </div>
                    </label>
                  ))}

                  <div className="divider">or</div>
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
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="building"
                  placeholder="House/Apartment Name"
                  value={formData.building}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
                <div className="form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={Object.keys(selectedAddress).length > 0}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={Object.keys(selectedAddress).length > 0}
                  />
                </div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  disabled={Object.keys(selectedAddress).length > 0}
                />
              </form>
            </>
          )}
        </div>

        <div className="modal-footer">
          {mode === "cart" && !isSelectingPayment && (
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
          )}
          {!isSelectingPayment && mode === "cart" ? (
            <button className="proceed-btn" onClick={handleAddressSelection}>
              Continue
            </button>
          ) : (
            mode === "profile" && (
              <>
                <button
                  className="proceed-btn"
                  onClick={handleSubmit}
                  disabled={onOrderPending}
                >
                  {isUpdatePending ? <ButtonLoading /> : "Save Address"}
                </button>
              </>
            )
          )}
          {isSelectingPayment && (
            <button
              className="proceed-btn"
              onClick={handlePlaceOrder}
              disabled={onOrderPending}
            >
              {onOrderPending ? <ButtonLoading /> : "Confirm Payment"}
            </button>
          )}
        </div>
      </div>

      {displayRazorpay && (
        <RenderRazorpay
          orderId={orderDetails.orderId}
          keyId={import.meta.env.VITE_RAZORPAY_KEY_ID}
          keySecret={import.meta.env.VITE_RAZORPAY_KEY_SECRET}
          currency={orderDetails.currency}
          amount={orderDetails.amount}
          address={
            Object.keys(selectedAddress).length > 0 ? selectedAddress : formData
          }
          setDisplayRazorpay={setDisplayRazorpay}
          onCancel={() => {
            setDisplayRazorpay(false);
            setIsSelectingPayment(false);
            setOnOrderPending(false);
          }}
        />
      )}
    </div>
  );
};

export default AddressModal;
