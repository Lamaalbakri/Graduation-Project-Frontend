import React from 'react'
import ShoppingCart from './ShoppingCart';
import Breadcrumb from "./Breadcrumb";
import './ShoppingCart.css';

function ShoppingCartList() {
    const carts = [
        {
            id: 1,
            supplier: 'Grain Harvest Suppliers',
            items: ['Flour', 'Oats'],
            total: 400
        },
        {
            id: 2,
            supplier: 'Diary Supplier Co.',
            items: ["Milk Cow's", "Milk Goat's"],
            total: 850
        }
    ];

    return (
        <div className='shoppingCart'>
            <div className='title'>
                Shopping Carts
            </div>
            {/* <Breadcrumb crumbs={[{ name: "Shopping Carts", path: "/shoppingCarts" }]} /> */}
            {carts !== null && carts.length > 0 ? (
                carts.map(cart => (

                    <ShoppingCart key={cart.id} cart={cart} />
                ))
            ) : (
                <div className='background-message'>
                    Your shopping cart is currently empty.
                    Please start adding raw materials to proceed with your order.
                </div>
            )}
        </div>
    );
};

export default ShoppingCartList

