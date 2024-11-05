import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from "../../../images/User.png";
import './ShoppingCart.css';

const ShoppingCart = ({ basket, index }) => {
    const navigate = useNavigate();
    const itemNames = basket.ShoppingBasketItems.map(item => item.item_name);

    const handleViewDetails = () => {
        navigate(`/shoppingCarts/${basket.buyerId}/${index + 1}`, {
            state: {
                sellerId: basket.sellerId,
                sellerName: basket.sellerName,
                basketIndex: index,
                buyerId: basket.buyerId,
            },
        });
    };
    return (
        <div className='cart-container'>
            <div className='cart-title'><p>Shopping Cart {index + 1}</p></div>
            <div className='cart-content'>
                <div className='img-container'>
                    <img className='supplier-img' src={logo} />
                    <p>Supplier Name: {basket.sellerName}</p>
                </div>
                <div className='cart-contnt-info'>
                    <p><strong>Items in the Shopping Basket:</strong> {itemNames.join(', ')}</p>
                    <p><strong>Basket Total:</strong> {basket.total_price} $</p> {/* تحديث المتغير للسعر الإجمالي */}
                </div>
            </div>
            <div className='button-container'>
                <div className='button-container'>
                    <button onClick={handleViewDetails}>View Details</button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;