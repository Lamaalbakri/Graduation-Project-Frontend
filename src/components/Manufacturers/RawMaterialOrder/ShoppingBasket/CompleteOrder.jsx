import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Breadcrumb from "./Breadcrumb";
import "./ShoppingBasket.css";
import mada from "../../../images/mada-logo.png";
import ConfirmationDialog from "../../../Dialog/ConfirmationDialog";
import { notification, Modal } from "antd";
import Address from "../../../Dialog/Address";
import { useAddress } from "../../../../contexts/AddressContext";
import { fetchShoppingBasketDetails, deleteBasket } from '../../../../api/shoppingBasket';
import { createNewRawMaterialRequest } from '../../../../api/rawMaterialRequestAPI';

function CompleteOrder() {
  const { basketIndex, basketId } = useParams();
  const navigate = useNavigate();
  const [basket, setBasket] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [stepType, setStepType] = useState("");
  const { address, loading } = useAddress();// استخدام context للحصول على العنوان
  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
    address: false,
  });

  const fetchBasket = async () => {
    try {
      const data = await fetchShoppingBasketDetails({ basketId });
      if (data) {
        setBasket(data.basket); // تحديث فقط البيانات التي تأتي من API
      } else {
        setError("Error fetching shopping baskets");
      }
    } catch (err) {
      setError("Error fetching shopping Baskets");
    }
  };

  useEffect(() => {
    fetchBasket();

  }, []);

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
  };

  // Handle confirmation for conferm Payment or View order
  const handleConfirmAction = async () => {
    toggleDialog("confirmationDialog", false);

    if (stepType == "confirmPay") {
      console.log("Put the send order BE logic");

      const itemsForRequest = basket?.ShoppingBasketItems.map(item => ({
        rawMaterial_id: item.item_id,  // هنا نستخدم _id بدل من item_id
        rawMaterial_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        image: item.image,
        subtotal: item.quantity * item.unit_price, // حساب المجموع الفرعي
        unit: item.unit,
        options: item.options.map(option => ({
          optionType: option.optionType,
          values: option.values,
        }))
      }));

      const requestData = {
        supplierId: basket.sellerId,
        supplierName: basket.sellerName,
        manufacturerName: basket.buyerId,
        supplyingRawMaterials: itemsForRequest,
        subtotal_items: basket.subtotal_items,
        shipping_cost: basket.shipping_cost,
        total_price: basket.total_price,
        payment_method: paymentMethod,
        status: "pending",
        arrivalAddress: address,
      };

      if (!requestData.arrivalAddress) {
        Modal.error({
          title: "Error",
          content: 'The address is required. Refresh the page to display it or add a new address.',
          okButtonProps: {
            className: "confirm-buttonn",
          },
        });
      } else {
        try {
          // Call createNewRawMaterialRequest with the requestData
          const response = await createNewRawMaterialRequest(requestData);
          console.log(response)
          if (response.data) {
            const deleteBasketResult = await deleteBasket({ basketId });
            console.log("Order created successfully");
            setStepType("viewOrder");
            toggleDialog("confirmationDialog", true);
          } else {
            Modal.error({
              title: "Error",
              content: 'There is a problem, the order was not sent',
              okButtonProps: {
                className: "confirm-buttonn",
              },
            });
          }
        } catch (error) {
          Modal.error({
            title: "Error",
            content: 'There is a problem, the order was not sent',
            okButtonProps: {
              className: "confirm-buttonn",
            },
          });
        }
        // // Close the dialog after creating the order
        // toggleDialog("confirmationDialog", false);
      }
    } else if (stepType === "viewOrder") {
      toggleDialog("confirmationDialog", false);
      navigate(`/ViewOrders/`);
    }
  };

  const handelCancel = () => {
    if (stepType == "confirmPay") {
      toggleDialog("confirmationDialog", false);
    } else if (stepType === "viewOrder") {
      toggleDialog("confirmationDialog", false);
      navigate("/shoppingBaskets");
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

  const handlePaymentMethodChange = (method) => {
    console.log("Setting payment method:", method);
    setPaymentMethod(method);
  };

  return (
    <div className="shoppingBasket">
      <Breadcrumb
        crumbs={[
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
            <div className="total-price">{basket ? `${basket.total_price} SAR` : "Loading..."}</div>
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
                  <input type="radio"
                    checked={paymentMethod === "Credit Card"}
                    onChange={() => handlePaymentMethodChange("Credit Card")} />
                  <img src={mada} alt="Mada" ></img>
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
          onCancel={handelCancel}
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