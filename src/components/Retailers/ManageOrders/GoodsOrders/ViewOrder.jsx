import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDOrders } from "../../../../api/orders";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    getDOrders().then((x) => {
      setOrders(x);
    });
  }, []);

  return (
    <div className="order-list">
      <h2 className="order-title">View Orders List</h2>
      {orders?.map((order) => (
        <div key={order?.shortId} className="order-item">
          <div className="order-header">Order ID: #{order?.shortId}</div>
          <div className="order-info">
            <p>
              <span className="info">Order Status: </span>
              <span
                className={`status-${order?.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
              </span>
            </p>

            <p>
              <span className="info">Price:</span> {order?.total_price} SAR
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
