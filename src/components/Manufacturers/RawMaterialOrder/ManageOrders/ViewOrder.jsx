import { Link } from "react-router-dom";
import "./ViewOrder.css"; // Updated the CSS file import to match the new component name
import { useEffect, useState } from "react";
import { getOrders } from "../../../../api/orders";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    getOrders().then((x) => {
      setOrders(x);
    });
  }, []);

  return (
    <div className="order-list">
      <h2 className="order-title">View Orders List</h2>
      {orders?.map((order) => (
        <div key={order?.shortId} className="order-item">
          <div className="order-header">Order ID: {order?.shortId}</div>
          <div className="order-info">
            <p>
              <span>Order Status:</span> {order?.status}
            </p>
            <p>
              <span>Price:</span> {order?.total_price} SAR
            </p>
          </div>
          <Link
            to={"/ViewOrderList?id=" + order?.shortId}
            className="details-button"
          >
            Show more details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ViewOrder;
