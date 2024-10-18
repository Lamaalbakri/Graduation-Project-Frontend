import React from 'react';
import './ShoppingCart.css';
import { CloseCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const CartItem = ({ item, quantity, onIncrement, onDecrement, onRemove }) => {

    return (
        <div className="cart-item">
            <img src={item.image || 'placeholder-image-url'} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name} </h3>
                <p className="cart-item-price">{item.price} $</p>
                <div className="cart-item-type">
                    <label>
                        <span className="required">*</span>Type:
                    </label>
                    <select className="cart-item-select">
                        <option value="Cow's Milk">Cow's Milk</option>
                        <option value="Goat's Milk">Goat's Milk</option>
                    </select>
                </div>
                <div className="cart-item-quantity">
                    <label>
                        <span className="required">*</span>Quantity:
                    </label>
                    <div className='quantity-button-container'>
                        <button className="quantity-button" onClick={onDecrement}><PlusOutlined /></button>
                        <span className="quantity-value">{quantity}</span>
                        <button className="quantity-button" onClick={onIncrement}><MinusOutlined /></button>
                    </div >

                </div>
                <div className="cart-item-total">Total: {item.price * quantity} $</div>
            </div>
            <button className="remove-button" onClick={onRemove}><CloseCircleOutlined /></button>
        </div>
    );
};

export default CartItem;
