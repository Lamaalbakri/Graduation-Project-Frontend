import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import { Link } from 'react-router-dom';

function ShoppingCartDetail() {
    const { id } = useParams();

    return (
        <div className='shoppingCart'>
            <Breadcrumb
                crumbs={[
                    { name: "Shopping Carts", path: "/shoppingCarts" },
                    { name: `Shopping Cart #${id}`, path: `/shoppingCart/${id}` }
                ]}
            />
            <h2>Details for Shopping Cart #{id}</h2>
            <div className='button-container'>
                <Link to={`/cart/${id}/complete`}>
                    <button>Complete The Order</button>
                </Link>
            </div>
            {/* باقي محتوى صفحة السلة المفصلة */}
        </div>
    );
}

export default ShoppingCartDetail;
