import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/User.png";
import "./ShoppingBasket.css";

const ShoppingBasket = ({ basket, basketIndex, basketId }) => {
  console.log(basketIndex, basketId);
  const navigate = useNavigate();
  const itemNames = basket.ShoppingBasketItems.map((item) => item.item_name);

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
            {itemNames.join(", ")}
          </p>
          <p>
            <strong>Basket Total:</strong> {basket.total_price} SAR
          </p>{" "}
          {/* تحديث المتغير للسعر الإجمالي */}
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
