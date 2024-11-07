import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Breadcrumb from "./Breadcrumb";
import "./ShoppingBasket.css";
import mada from "../../../images/mada-logo.png";
import ConfirmationDialog from "../../../Dialog/ConfirmationDialog";
import Address from "../../../Dialog/Address";
import { useAddress } from "../../../../contexts/AddressContext";

function CompleteOrder() {
  const { basketIndex, basketId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [stepType, setStepType] = useState("");
  const { address, loading } = useAddress();// استخدام context للحصول على العنوان
  // const sellerId = sessionStorage.getItem("sellerId") || location.state?.sellerId;
  // const basketIndex = sessionStorage.getItem("basketIndex") || location.state?.basketIndex;
  // const buyerId = sessionStorage.getItem("buyerId") || location.state?.buyerId;
  const total_price = sessionStorage.getItem("total_price") || location.state?.total_price;
  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
    address: false,
  });

  useEffect(() => {

    // if (sellerId !== sessionStorage.getItem("sellerId")) {
    //   sessionStorage.setItem("sellerId", sellerId);
    // }
    // if (basketIndex !== sessionStorage.getItem("basketIndex")) {
    //   sessionStorage.setItem("basketIndex", basketIndex);
    // }
    // if (buyerId !== sessionStorage.getItem("buyerId")) {
    //   sessionStorage.setItem("buyerId", buyerId);
    // }
    if (total_price !== sessionStorage.getItem("total_price")) {
      sessionStorage.setItem("total_price", total_price);
    }
  }, [total_price]);


  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
    // if (requestId) setSelectedRequestId(requestId);
    // if (status) setSelectedStatus(status);
  };

  // Handle confirmation for conferm Payment or View order
  const handleConfirmAction = () => {

    if (stepType == "confirmPay") {
      console.log("Put the send order BE logic");
      toggleDialog("confirmationDialog", false);
      setStepType("viewOrder");
      toggleDialog("confirmationDialog", true);

    } else if (stepType == "viewOrder") {

      console.log("open view order page");
      // <Link to={`/viewOrder`} />;
      // <Link to={`/ViewOrders`} />

      // set state of dialog to false "close"
      toggleDialog("confirmationDialog", false);
      navigate(`/ViewOrders/`);
    }
  };

  const handelCheckout = () => {
    setStepType("confirmPay");
    toggleDialog("confirmationDialog", true);
  };

  const handleDialogClose = () => {
    toggleDialog("address", false);
  };

  const handleEditAddress = () => {
    toggleDialog("address", true);
  };

  return (
    <div className="shoppingBasket">
      <Breadcrumb
        crumbs={[
          // <Link to={`/shoppingBaskets/${buyerId}/${basketIndex}/complete`}>
          { name: "Shopping Baskets", path: `/shoppingBaskets` },
          { name: `Shopping Basket ${basketIndex}`, path: `/shoppingBaskets/${basketId}/${basketIndex}` },
          {
            name: "Payment Confirmation",
            path: `/shoppingBaskets/${basketId}/${basketIndex}/complete`,
          },
        ]}
      />
      <div className="complate-page-container">
        <div className="order-summary">
          <div className="order-total">
            <div className="total-title">Order Total:</div>
            <div className="total-price">{location.state?.total_price || total_price} SAR</div>
          </div>
        </div>
        <div className="user-info">
          <div className="user-info-step">
            <div className="step-num">
              <p>1</p>
            </div>
            <div className="step-content">
              <div className="step-title">Receiving Address</div>
              <div className="adress-detail">
                {loading ? (
                  <p>Loading address...</p>
                ) : address ? (
                  <div className="address">{`${address.country}, ${address.city}, ${address.neighborhood}, ${address.street}.`}</div>
                ) : (
                  <div className="no-address">
                    <p>No address found, Click 'Edit' to add.</p>
                  </div>
                )}
                <div className="edit-address">
                  <button onClick={handleEditAddress}>
                    Edit <EditOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="user-info-step">
            <div className="step-num">
              <p>2</p>
            </div>
            <div className="step-content">
              <div className="step-title">Payment</div>
              <div className="step-detail">
                <div className="pay-method">
                  <input type="radio" checked onChange={() => { }} />
                  <img src={mada}></img>
                </div>
                <div className="card-form">
                  <label className="card-num">
                    Card Number
                    <input type="text" placeholder="Card Number" required />
                  </label>
                  <label className="card-date">
                    Expiration Date
                    <input type="date" placeholder="Expiration Date" required />
                  </label>
                  <label className="card-code">
                    CVV Code
                    <input type="text" placeholder="CVV" required />
                  </label>
                </div>
                <div className="pay-button-container">
                  <button className="Checkout-button" onClick={handelCheckout}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`${stepType === "confirmPay"
            ? "Are you ready to confirm your payment?"
            : "Your Order Has Been Created"
            }`}
          message={` ${stepType === "confirmPay"
            ? "Once confirmed, you won't be able to cancel your order."
            : "Would you like to view the Request? "
            }`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
          stepType={stepType} // Pass stepType as a prop to control icon and buttons
        />
      )}
      {dialogState.address && (
        <Address
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
        />
      )}
    </div>
  );
}

export default CompleteOrder;