import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";
import "./ViewOrderList.css";
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


  const products = [
    {
      id: 1,
      name: "Milk 1 Liter",
      price: 150,
      type: "Cow's Milk",
      quantity: 2,
      totalPrice: 300,
      imageKeyword: "milk",
      imgSrc:
        "https://imgs.search.brave.com/J6efkzMh3j8vjbmYo3MlUJTgngNGXVsq1P38L9Zx4jo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ib3R0bGUtY293/LW1pbGstZ2xhc3Mt/bWlsay1ib3R0bGUt/bWlsa18xMDE1Mzg0/LTE4ODQxNC5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw",
    },
    {
      id: 2,
      name: "Bread 1 Loaf",
      price: 50,
      type: "Whole Wheat",
      quantity: 1,
      totalPrice: 50,
      imageKeyword: "bread",
      imgSrc:
        "https://imgs.search.brave.com/J6efkzMh3j8vjbmYo3MlUJTgngNGXVsq1P38L9Zx4jo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ib3R0bGUtY293/LW1pbGstZ2xhc3Mt/bWlsay1ib3R0bGUt/bWlsa18xMDE1Mzg0/LTE4ODQxNC5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw",
    },
    {
      id: 3,
      name: "Apples 1kg",
      price: 100,
      type: "Fresh Apples",
      quantity: 3,
      totalPrice: 300,
      imageKeyword: "apples",
      imgSrc:
        "https://imgs.search.brave.com/J6efkzMh3j8vjbmYo3MlUJTgngNGXVsq1P38L9Zx4jo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9ib3R0bGUtY293/LW1pbGstZ2xhc3Mt/bWlsay1ib3R0bGUt/bWlsa18xMDE1Mzg0/LTE4ODQxNC5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw",
    },
  ];
  return (
    <div>
      <div>
        <p style={{ fontSize: "1.5rem", marginTop: "2rem", color: "black",padding:"20px"}}>
          <Link style={{ color: "black" }} to="/ViewOrders">
            View Orders List
          </Link>
          {">"} Order # 9578495
        </p>
      </div>
      <div className="view_order_list_wrapper">
        {order?.supplyingRawMaterials?.length > 0 && <div className="view_order_list_left">
          {/*  map products */}
          {order?.supplyingRawMaterials?.map((item, index) => (
            <div key={item._id} className="view_order_list_card">
              <div className="view_order_list_card_image_wrapper">
                <img src={item?.rawMaterial_name} alt={item} />
              </div>
              <div className="view_order_list_card_items">
                <div className="view_order_list_card_items_heading">
                  <h2>{item.rawMaterial_name}</h2>
                  <p style={{ fontSize: "1rem" }}>{item?.unit_price}$</p>
                </div>
                <div className="view_order_list_card_items_type">
                  <p>
                    <span style={{ color: "red" }}>*</span>
                    Type : <b></b>
                  </p>
                </div>
                <div className="view_order_list_card_items_quantity">
                  <p>
                    <span style={{ color: "red" }}>*</span>
                    Quantity: <b>{item?.quantity}</b>
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
                  <span style={{ color: "gray" }}>
                    ({order?.products?.length} Items)
                  </span>
                </span>
                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                  {order?.total_price}$
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
                </span>
                <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                  0$
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
                  {order?.total_price}$
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
                    Amount Refunded <span style={{ fontSize: "1rem", fontWeight: "300" }}>(Order Cancelled)</span>
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "700" }}>
                    {order?.total_price}$
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
                <span className="value">{order?.createdAt}</span>
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
