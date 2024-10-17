import React from 'react'
import ShoppingCart from './ShoppingCart';
import Breadcrumb from "./Breadcrumb";


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
            {carts.map(cart => (
                <ShoppingCart key={cart.id} cart={cart} />
            ))}
        </div>
    );
};

export default ShoppingCartList

