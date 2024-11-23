import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import moment from "moment";
import { getSingleMOrder } from "../../../../api/orders";
import { CheckCircleOutlined } from "@ant-design/icons";
import FeedbackPopup from "./FeedbackPopup";
import { getBuyerFeedback } from "../../../../api/feedbackApi";

const ViewOrdersList = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [done, setDone] = useState(false);

  // Extract the 'id' from the query string
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      getSingleMOrder(id).then((x) => {
        setOrder(x);
      });
    }
  }, [id]);

  const totalItemsCount = order?.goodsForDistributors?.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);

  useEffect(() => {
    getBuyerFeedback().then((x) => {
      const found = x.find((d) => d.order_id === id);
      if (found) {
        setDone(true);
      }
    });
  }, [id]);
  return (
    <div>
      <div>
        <p
          style={{
            fontSize: "20px",
            marginTop: "2rem",
            color: "#1c2229",
            padding: "20px",
          }}
        >
          <Link className="custom-link" to="/ViewOrders">
            View Orders List
          </Link>
          {" >"} Order #{order?.shortId}
        </p>
      </div>
      <div className="view_order_list_wrapper">
        {order?.goodsForDistributors?.length > 0 && (
          <div className="view_order_list_left">
            {/*  map products */}
            {order?.goodsForDistributors?.map((item, index) => (
              <div key={item._id} className="view_order_list_card">
                <div className="view_order_list_card_image_wrapper">
                  <img src={item?.image} alt={item?.goods_name} />
                </div>
                <div className="view_order_list_card_items">
                  <div className="view_order_list_card_items_heading">
                    <p>{item.goods_name}</p>
                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: "bold",
                        color: "#f4d53f",
                        marginBottom: "15px",
                      }}
                    >
                      {item?.unit_price} SAR
                    </p>
                  </div>
                  <div className="view_order_list_card_items_type">
                    {item?.options?.map((option, idx) => (
                      <p key={idx}>
                        {option.optionType}: {option.values}
                      </p>
                    ))}
                  </div>
                  <div className="view_order_list_card_items_quantity">
                    <p>Quantity: {item?.quantity}</p>
                  </div>
                  <div className="view_order_list_total_price">
                    <p>Total: {item?.subtotal} SAR</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Payment Summary */}
            <div className="view_order_payment_summary">
              <p className="heading">Payment Summary</p>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                {/* Subtotal */}
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="view_order-total-price">
                    Subtotal:{" "}
                    <span
                      style={{
                        color: "#555",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      ({totalItemsCount} Items)
                    </span>
                  </span>
                  <span className="view_order-total-price">
                    {order?.subtotal_items} SAR
                  </span>
                </li>
                {/* Shipping Cost */}
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span className="view_order-total-price">
                    Shipping Cost:{" "}
                    <span
                      style={{
                        color: "#555",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      (10% of subtotal)
                    </span>
                  </span>
                  <span className="view_order-total-price">
                    {order?.shipping_cost} SAR
                  </span>
                </li>
                <hr className="divider" />
                {/* Total Cost */}
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 0px",
                  }}
                >
                  <span className="view_order-total-price">Order Total:</span>
                  <span className="view_order-total-price">
                    {order?.total_price} SAR
                  </span>
                </li>
                {order?.status === "rejected" && (
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="view_order-total-price">
                      Amount Refunded:{" "}
                      <span
                        style={{
                          color: "red",
                          fontSize: "16px",
                          fontWeight: "normal",
                        }}
                      >
                        (Order Cancelled)
                      </span>
                    </span>
                    <span className="view_order-total-price">
                      {order?.total_price} SAR
                    </span>
                  </li>
                )}
              </ul>
            </div>
            {order?.status === "delivered" && (
              <div className="Feedback-card">
                <div
                  className="flex"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h5 style={{ fontSize: "17px", color: "#1c2229" }}>
                      <CheckCircleOutlined
                        style={{
                          color: "green",
                          fontSize: "28px",
                          marginRight: "10px",
                        }}
                      />
                      Your Order is Complete
                    </h5>
                    <p style={{ color: "#1c2229" }}>
                      Evaluating the order helps us improve our services and
                      deliver them better.
                    </p>
                  </div>
                  <FeedbackPopup
                    orderId={order?.shortId}
                    distributorId={order?.distributorId}
                    retailerId={order?.retailerId}
                    done={done}
                    setDone={setDone}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {/* Order Number Date Status */}
        <div className="view_order_list_right">
          <div
            style={{
              background: "#fff",
              padding: "20px",
              border: "1px solid #ddd",
            }}
          >
            <ul className="order_list_details_list">
              <li>
                <span className="name">Order ID:</span>
                <span className="value">#{order?.shortId}</span>
              </li>
              <li>
                <span className="name">Creation Date:</span>
                <span className="value">
                  {order?.createdAt
                    ? moment(order.createdAt).format("DD MMM YYYY")
                    : "Undefined"}
                </span>
              </li>
              <li>
                <span className="name">Order Status:</span>
                <span
                  className={`value-${order?.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {order?.status.charAt(0).toUpperCase() +
                    order?.status.slice(1)}
                </span>
              </li>
              <li>
                {(order?.status === "inProgress" ||
                  order?.status === "delivered") && (
                    <>
                      <span className="name">Order Contract:</span>
                    </>
                  )}
              </li>
              {(order?.status === "inProgress" ||
                order?.status === "delivered") && (
                  <div className="contract-button">
                    <a
                      href={`/SmartContract/${order.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button>View</button>
                    </a>
                  </div>
                )}
            </ul>
            {/* Import Order Timeline */}
            <div style={{ margin: "2.5rem 2.3rem" }}>
              <OrderTimeline orderStatus={order?.status} />
            </div>
          </div>
          {/* Arrival Address */}
          <div className="arrival_address">
            <h4 className="heading">Arrival Address</h4>
            <ul className="arrival_address_list">
              <li>{order?.arrivalAddress?.city}</li>
              <li> {order?.arrivalAddress?.street}</li>
              <li>
                {order?.arrivalAddress?.neighborhood},{" "}
                {order?.arrivalAddress?.postal_code}
              </li>
              <li> {order?.arrivalAddress?.country}</li>
            </ul>
          </div>
          {/* Transporter information */}
          {order?.status === "pending" || order?.status === "accepted" ? (
            <div className="transporter-information">
              <h4 className="heading">Transportation Details</h4>
              <p
                style={{ color: "#555", textAlign: "center", fontSize: "15px" }}
              >
                No transport company has been assigned yet
              </p>
            </div>
          ) : order?.status === "rejected" ? null : (
            <div className="transporter-information">
              <h4 className="heading">Transportation Details</h4>
              <ul className="transporter-information_list">
                <li>
                  {order?.transporterName && (
                    <div>
                      <span className="transporter-information_list-name">
                        Company:{" "}
                      </span>
                      <span className="transporter-information_list-value">
                        {order?.transporterName}
                      </span>
                    </div>
                  )}
                </li>
                <li>
                  {order?.transportRequest_id && (
                    <div>
                      <span className="transporter-information_list-name">
                        Transport Request ID:{" "}
                      </span>
                      <span className="transporter-information_list-value">
                        #{order?.transportRequest_id}
                      </span>
                    </div>
                  )}
                </li>
                <li>
                  {order?.estimated_delivery_date &&
                    order?.estimated_delivery_date.length > 0 && (
                      <div>
                        <span className="transporter-information_list-name">
                          Estimated Delivery Dates:
                        </span>
                        <br />
                        {order?.estimated_delivery_date.length === 1 ? (
                          <span className="value-estimated-delivery-date">
                            {moment(order.estimated_delivery_date[0]).format(
                              "DD MMM YYYY"
                            )}
                          </span>
                        ) : (
                          <span className="value-estimated-delivery-date">
                            {moment(order.estimated_delivery_date[0]).format(
                              "DD MMM YYYY"
                            )}{" "}
                            to{" "}
                            {moment(
                              order.estimated_delivery_date[
                              order.estimated_delivery_date.length - 1
                              ]
                            ).format("DD MMM YYYY")}
                          </span>
                        )}
                      </div>
                    )}
                </li>
                <li>
                  {order?.actual_delivery_date && (
                    <div>
                      <span className="transporter-information_list-name">
                        Actual Delivery Date:{" "}
                      </span>
                      <span className="transporter-information_list-value">
                        {moment(order?.actual_delivery_date).format(
                          "DD MMM YYYY"
                        )}
                      </span>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersList;
