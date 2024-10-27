import React from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCart.css';

const ShoppingCart = ({ cart, userId }) => {
    return (
        <div className='cart-container'>
            <div className='cart-title'><p>Shopping Cart {cart.id}</p></div>
            <div className='cart-content'>
                <div className='img-container'>
                    <img className='supplier-img' src='src\components\images\User.png' />
                    <p>{cart.supplier}</p>
                </div>
                <div className='cart-contnt-info'>
                    <p><strong>Item In The Shopping Cart:</strong> {cart.items.join(', ')}</p>
                    <p><strong>Total:</strong> {cart.total} $</p>
                </div>
            </div>
            <div className='button-container'>
                <Link to={`/shoppingCarts/${userId}/${cart.id}`}>
                    <button>View Details</button>
                </Link>
            </div>
        </div>
    );
};

export default ShoppingCart;