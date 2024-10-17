import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

function CompleteOrder() {
    const { id } = useParams();

    return (
        <div className='shoppingCart'>
            <Breadcrumb
                crumbs={[
                    { name: "Shopping Carts", path: "/shoppingCarts" },
                    { name: `Shopping Cart #${id}`, path: `/shoppingCart/${id}` },
                    { name: "Complete The Order", path: `/shoppingCart/${id}/complete` }
                ]}
            />
            <h2>Complete The Order for Cart #{id}</h2>
            {/* باقي محتوى صفحة إكمال الطلب */}
        </div>
    );
}

export default CompleteOrder;
