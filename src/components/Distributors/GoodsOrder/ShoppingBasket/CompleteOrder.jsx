import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Breadcrumb from "./Breadcrumb";
import { config } from "./../../../../../config";
import ConfirmationDialog from "../../../Dialog/ConfirmationDialog";
import { Modal } from "antd";
import Address from "../../../Dialog/Address";
import { useAddress } from "../../../../contexts/AddressContext";
import {
  fetchShoppingBasketDetails,
  deleteBasket,
} from "../../../../api/shoppingBasket";
import { createNewManufacturerGoodsRequest } from "../../../../api/manufacturerGoodsRequestsAPI";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function CompleteOrder() {
  const { basketIndex, basketId } = useParams();
  const navigate = useNavigate();
  const [basket, setBasket] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [stepType, setStepType] = useState("");
  const { address, loading } = useAddress();
  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
    address: false,
  });
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const clientId = config.clientId;
  const fetchBasket = async () => {
    try {
      const data = await fetchShoppingBasketDetails({ basketId });
      if (data) {
        setBasket(data.basket);
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
    if (stepType === "viewOrder") {
      toggleDialog("confirmationDialog", false);
      navigate(`/ViewOrders/`);
    }
  };

  const handelCancel = () => {
    if (stepType === "viewOrder") {
      toggleDialog("confirmationDialog", false);
      navigate("/shoppingBaskets");
    }
  };

  const handleDialogClose = () => {
    toggleDialog("address", false);
  };

  const handleEditAddress = () => {
    toggleDialog("address", true);
  };
  const showPaymentModal = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePaymentClose = () => {
    setIsPaymentModalVisible(false);
  };

  const handlePaymentSuccess = async (data, details) => {
    const itemsForRequest = basket?.ShoppingBasketItems.map((item) => ({
      goods_id: item.item_id,
      goods_name: item.item_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      image: item.image,
      subtotal: item.quantity * item.unit_price,
      unit: item.unit,
      options: item.options.map((option) => ({
        optionType: option.optionType,
        values: option.values,
      })),
    }));

    const requestData = {
      manufacturerId: basket.sellerId,
      manufacturerName: basket.sellerName,
      distributorName: basket.buyerName,
      goodsForDistributors: itemsForRequest,
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
        content:
          "The address is required. Refresh the page to display it or add a new address.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    } else {
      try {
        // Call createNewManufacturerGoodsRequest with the requestData
        const response = await createNewManufacturerGoodsRequest(requestData);
        if (response.data) {
          const deleteBasketResult = await deleteBasket({ basketId });
          console.log("Order created successfully");
          handlePaymentClose();
          setStepType("viewOrder");
          toggleDialog("confirmationDialog", true);
        } else if (response.error) {
          if (
            response.insufficientItems &&
            response.insufficientItems.length > 0
          ) {
            Modal.error({
              title: "Unavailable items:",
              content: (
                <div>
                  {response.insufficientItems.map((item) => (
                    <div key={item.goodsId}>
                      <p>
                        <b>Item Name:</b> {item.goodsName}
                      </p>
                      <p>
                        <b>Requested Quantity:</b> {item.requestedQuantity}
                      </p>
                      <p>
                        <b>Available Quantity:</b> {item.availableQuantity}
                      </p>
                      <br />
                    </div>
                  ))}
                </div>
              ),
              okButtonProps: {
                className: "confirm-buttonn",
              },
            });
          } else {
            Modal.error({
              title: "Error",
              content: "There is a problem, the order was not sent",
              okButtonProps: {
                className: "confirm-buttonn",
              },
            });
          }
        }
      } catch (error) {
        Modal.error({
          title: "Error",
          content: "There is a problem, the order was not sent",
          okButtonProps: {
            className: "confirm-buttonn",
          },
        });
      }
    }
  };

  const formatPrice = (price) => {
    if (price && price > 0) {
      return price.toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className="shoppingBasket">
      <Breadcrumb
        crumbs={[
          { name: "Shopping Baskets", path: `/shoppingBaskets` },
          {
            name: `Shopping Basket ${basketIndex}`,
            path: `/shoppingBaskets/${basketId}/${basketIndex}`,
          },
          {
            name: "Payment Confirmation",
            path: `/shoppingBaskets/${basketId}/${basketIndex}/complete`,
          },
        ]}
      />
      <div className="complate-page-container">
        <div className="order-summary">
          <div className="order-total">
            <div className="complate-total-title">Order Total:</div>
            <div className="total-price">
              {basket ? `${basket.total_price} SAR` : "Loading..."}
            </div>
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
                <div className="pay-button-container">
                  <button
                    className="Checkout-button"
                    onClick={showPaymentModal}
                  >
                    Select Payment Method
                  </button>
                  <Modal
                    title="Payment Methods"
                    open={isPaymentModalVisible}
                    onCancel={handlePaymentClose}
                    footer={null}
                    style={{ width: "800px", height: "600px", top: "200px" }}
                    styles={{
                      body: {
                        paddingTop: "20px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      },
                      mask: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                    }}
                  >
                    <PayPalScriptProvider options={{ "client-id": clientId }}>
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                        }}
                        fundingSource="paypal"
                        disableFunding="credit,card"
                        createOrder={(data, actions) => {
                          const formattedPrice = basket
                            ? formatPrice(basket.total_price)
                            : null;
                          if (
                            formattedPrice === null ||
                            parseFloat(formattedPrice) <= 0
                          ) {
                            console.error("Invalid price value");
                            return;
                          }

                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: formattedPrice,
                                  currency_code: "USD",
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          return actions.order
                            .capture()
                            .then(async (details) => {
                              await handlePaymentSuccess(data, details);
                            });
                        }}
                        onError={(err) => {
                          console.error("PayPal Checkout Error:", err);
                        }}
                      />
                    </PayPalScriptProvider>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`${
            stepType === "confirmPay"
              ? "Are you ready to confirm your payment?"
              : "Your Order Has Been Created"
          }`}
          message={` ${
            stepType === "confirmPay"
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
