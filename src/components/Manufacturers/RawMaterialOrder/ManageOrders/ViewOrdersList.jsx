import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import moment from "moment";
import "./ViewOrderList.css";
import { getSingleOrder } from "../../../../api/orders";
import { CheckCircleOutlined } from "@ant-design/icons";
import FeedbackPopup from "./FeedbackPopup";

const ViewOrdersList = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  // Extract the 'id' from the query string
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      getSingleOrder(id).then((x) => {
        setOrder(x);
      });
    }
  }, [id]);

  // Calculate the total number of items multiplied by the quantity of each item
  const totalItemsCount = order?.supplyingRawMaterials?.reduce(
    (total, item) => {
      return total + (item.quantity || 0);
    },
    0
  );

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
        {order?.supplyingRawMaterials?.length > 0 && (
          <div className="view_order_list_left">
            {/*  map products */}
            {order?.supplyingRawMaterials?.map((item, index) => (
              <div key={item._id} className="view_order_list_card">
                <div className="view_order_list_card_image_wrapper">
                  <img src={item?.image} alt={item?.rawMaterial_name} />
                </div>
                <div className="view_order_list_card_items">
                  <div className="view_order_list_card_items_heading">
                    <p>{item.rawMaterial_name}</p>
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
                        <span style={{ color: "red" }}>* </span>
                        {option.optionType}: {option.values}
                      </p>
                    ))}
                  </div>
                  <div className="view_order_list_card_items_quantity">
                    <p>
                      <span style={{ color: "red" }}>* </span>
                      Quantity: {item?.quantity}
                    </p>
                  </div>
                  <div className="view_order_list_total_price">
                    <p>Total: {item?.subtotal} SAR</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Payment Summary */}
            <div className="view_order_payment_summary">
              <h4 className="heading">Payment Summary</h4>
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
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    Subtotal:{" "}
                    <span style={{ color: "gray", fontWeight: "700" }}>
                      ({totalItemsCount} Items)
                    </span>
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
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
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    Shipping Cost:{" "}
                    <span style={{ color: "gray", fontWeight: "700" }}>
                      (10% of subtotal)
                    </span>
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    {order?.shipping_cost} SAR
                  </span>
                </li>
                {/* Total Cost */}
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid lightgray",
                    padding: "15px 0px",
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    Order Total:
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    {order?.total_price} SAR
                  </span>
                </li>
                {order?.status === "rejected" && (
                  <li
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid lightgray",
                      padding: "10px 0px",
                    }}
                  >
                    <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                      Amount Refunded{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "gray",
                          fontWeight: "700",
                        }}
                      >
                        (Order Cancelled)
                      </span>
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                      {order?.total_price} SAR
                    </span>
                  </li>
                )}
              </ul>
            </div>
            {order?.status === "delivered" && (
              <div className="view_order_payment_summary">
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
                  <FeedbackPopup />
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
                <span className="name">Date:</span>
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
                  {order?.status}
                </span>
              </li>
            </ul>
            {/* Import Order Timeline */}
            <div style={{ margin: "2.5rem 2.5rem" }}>
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
            {order?.transporterName && (
              <div className="transporter_info">
                <p></p>
                <h4 className="heading">Transporter Name</h4>
                <li>{order?.transporterName}</li>
              </div>
            )}
            {order?.transportRequest_id && (
              <div className="transport_request_id">
                <p></p>
                <h4 className="heading">Transport Request ID</h4>
                <li>{order?.transportRequest_id}</li>
              </div>
            )}
            {order?.estimated_delivery_date &&
              order?.estimated_delivery_date.length > 0 && (
                <div>
                  <p></p>
                  <h4 className="heading">Estimated Delivery Dates</h4>
                  <ul className="arrival_address_list">
                    {order?.estimated_delivery_date.map((date, index) => (
                      <li key={index}>{moment(date).format("YYYY-MM-DD")}</li>
                    ))}
                  </ul>
                </div>
              )}
            {order?.actual_delivery_date && (
              <div>
                <p></p>
                <h4 className="heading">Actual Delivery Date</h4>
                <li>
                  {moment(order?.actual_delivery_date).format("YYYY-MM-DD")}
                </li>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersList;
