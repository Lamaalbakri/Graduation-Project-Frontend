import React from 'react';
import './ShoppingCart.css';
import { CloseCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const CartItem = ({ item, quantity, onIncrement, onDecrement }) => {

    return (
        <div className="cart-item">
            <img src={item.image || 'placeholder-image-url'} alt={item.item_name} className="cart-item-image" />
            <div className="cart-item-details">
                <h3 className="cart-item-name">{item.item_name} </h3>
                <p className="cart-item-price">{item.unit_price} $</p>
                <div className="cart-item-type">
                    {/* {item.options.map((option) => (
                        <div key={option._id} className="option-group">
                            <label>
                                <span className="required">*</span>{option.optionType}:
                            </label>
                            <span>{option.values}</span>
                        </div>
                    ))} */}
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
            {/* <button className="remove-button" onClick={onRemove}><CloseCircleOutlined /></button> */}
        </div>
    );
};

export default CartItem;
