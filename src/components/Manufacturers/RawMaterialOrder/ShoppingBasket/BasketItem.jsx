import React from "react";
import "./ShoppingBasket.css";
import {
  CloseCircleOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";

const BasketItem = ({ item, quantity, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="Basket-item">
      <img
        src={item.image || "placeholder-image-url"}
        alt={item.item_name}
        className="Basket-item-image"
      />
      <div className="Basket-item-details">
        <h3 className="Basket-item-name">
          {item.item_name} ({item.unit}){" "}
        </h3>
        <p className="Basket-item-price">{item.unit_price} SAR</p>
        <div className="Basket-item-type">
          {item.options.map((option) => (
            <div key={option._id} className="option-group">
              <label>
                <span className="required">*</span>
                {option.optionType}:
              </label>
              <span> {option.values}</span>
            </div>
          ))}
        </div>
        <div className="Basket-item-quantity">
          <label>
            <span className="required">*</span>Quantity:
          </label>
          <div className="quantity-button-container">
            <button className="quantity-button" onClick={onDecrement}>
              <MinusOutlined />
            </button>
            <span className="quantity-value">{item.quantity}</span>
            <button className="quantity-button" onClick={onIncrement}>
              <PlusOutlined />
            </button>
          </div>
        </div>
        <div className="Basket-item-total">
          Total: {item.unit_price * quantity} SAR
        </div>
      </div>
      <button className="remove-button" onClick={onRemove}>
        <CloseCircleOutlined />
      </button>
    </div>
  );
};

export default BasketItem;
