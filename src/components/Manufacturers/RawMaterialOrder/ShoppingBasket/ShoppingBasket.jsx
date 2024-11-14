import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/User.png";
import "./ShoppingBasket.css";

const ShoppingBasket = ({ basket, basketIndex, basketId }) => {
  console.log(basketIndex, basketId);
  const navigate = useNavigate();
  //const itemNames = basket.ShoppingBasketItems.map((item) => item.item_name);
  const itemCount = basket.ShoppingBasketItems.length; // Get the number of items

  const handleViewDetails = () => {
    navigate(`/shoppingBaskets/${basketId}/${basketIndex}`);
  };
  return (
    <div className="Basket-container">
      <div className="Basket-title">
        <p>Shopping Basket {basketIndex}</p>
      </div>
      <div className="Basket-content">
        <div className="img-container">
          <img className="supplier-img" src={logo} />
          <p>Supplier Name: {basket.sellerName}</p>
        </div>
        <div className="Basket-contnt-info">
          <p>
            <strong>Items in the Shopping Basket:</strong>{" "}
            {/*{itemNames.join(", ")}*/}
            {itemCount} items
          </p>
          <p>
            <strong>Basket Total: </strong>
            <span
              style={{
                color: "#f4d53f",
                fontWeight: "bold",
                fontSize: "16.5px",
              }}
            >
              {basket.total_price} SAR
            </span>
          </p>{" "}
        </div>
      </div>
      <div className="button-view-container">
        <div className="button-view-details">
          <button onClick={handleViewDetails}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingBasket;
