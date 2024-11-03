import { Link } from "react-router-dom";
import "./ViewOrder.css"; // Updated the CSS file import to match the new component name
import { useEffect, useState } from "react";
import { getOrders } from "../../../../api/orders";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  console.log("CALLED")
  useEffect(() => {
    console.log("ID: ",localStorage.getItem('userId'))
    getOrders(localStorage.getItem('userId')).then(x => {
      setOrders(x)
    })
  }, []);

  return (
    <div className="order-list">
      <h2 className="order-title">View Orders List</h2>
      {orders?.map((order) => (
        <div key={order?.shortId} className="order-item">
          <div className="order-header">ID No: {order?.shortId}</div>
          <div className="order-info">
            <p>set of info about the order</p>
            <p>Price: ${order?.total_price}</p>
          </div>
          <Link to={"/ViewOrderList?id=" + order?.shortId} className="details-button">
            Show more details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ViewOrder;
