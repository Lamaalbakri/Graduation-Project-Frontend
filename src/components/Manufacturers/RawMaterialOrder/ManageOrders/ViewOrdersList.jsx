import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import "./ViewOrderList.css";
import moment from "moment";
import { getSingleOrder } from "../../../../api/orders";


const ViewOrdersList = () => {

  const location = useLocation();
  const [order, setOrder] = useState(null);

  // Extract the 'id' from the query string
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');


  useEffect(() => {
    if (id) {
      getSingleOrder(id).then(x => {
        setOrder(x)
      })
    }
  }, [id]);

  // احسب إجمالي عدد العناصر مضروبا في الكمية لكل عنصر
  const totalItemsCount = order?.supplyingRawMaterials?.reduce((total, item) => {
    return total + (item.quantity || 0);
  }, 0);

  return (
    <div>
      <div>
        <p style={{ fontSize: "1.5rem", marginTop: "2rem", color: "black", padding: "20px" }}>
          <Link style={{ color: "black" }} to="/ViewOrders">
            View Orders List
          </Link>
          {">"} Order {order?.shortId}
        </p>
      </div>
      <div className="view_order_list_wrapper">
        {order?.supplyingRawMaterials?.length > 0 && <div className="view_order_list_left">
          {/*  map products */}
          {order?.supplyingRawMaterials?.map((item, index) => (
            <div key={item._id} className="view_order_list_card">
              <div className="view_order_list_card_image_wrapper">
                <img src={item?.image} alt={item?.rawMaterial_name} />
              </div>
              <div className="view_order_list_card_items">
                <div className="view_order_list_card_items_heading">
                  <h2>{item.rawMaterial_name}</h2>
                  <p style={{ fontSize: "1rem" }}>{item?.unit_price}$</p>
                </div>
                <div className="view_order_list_card_items_type">
                  {item?.options?.map((option, idx) => (
                    <p key={idx}>
                      <span style={{ color: "red" }}>*</span>
                      <b> {option.optionType}:  </b>{option.values}
                    </p>
                  ))}
                </div>
                <div className="view_order_list_card_items_quantity">
                  <p>
                    <span style={{ color: "red" }}>*</span>
                    <b>Quantity:</b> {item?.quantity}
                  </p>
                </div>
                <div className="view_order_list_total_price">
                  <p>Total: {item?.subtotal}$</p>
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
                  Subtotal{" "}
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
                  Shipping Costs
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
                  padding: "10px 0px",
                }}
              >
                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                  Total Payment
                </span>
                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                  {order?.total_price} SAR
                </span>
              </li>
              {order?.status === 'rejected' &&
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
                    Amount Refunded <span style={{ fontSize: "1rem", color: "gray", fontWeight: "700" }}>(Order Cancelled)</span>
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    {order?.total_price} SAR
                  </span>
                </li>}

            </ul>
          </div>
        </div>}
        {/* Order Number Date Status */}
        <div className="view_order_list_right">
          <div
            style={{
              background: "#fff",
              padding: "20px",
            }}
          >
            <ul className="order_list_details_list">
              <li>
                <span className="name">Order Number:</span>
                <span className="value">{order?.shortId}</span>
              </li>
              <li>
                <span className="name">Date:</span>
                <span className="value">
                  {order?.createdAt ? moment(order.createdAt).format('DD MMM YYYY') : 'Undefined'}
                </span>
              </li>
              <li>
                <span className="name">Order Status:</span>
                <span className="value">{order?.status}</span>
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
              <li>{order?.arrivalAddress?.neighborhood}, {order?.arrivalAddress?.postal_code}</li>
              <li> {order?.arrivalAddress?.country}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrdersList;
