import React, { useState, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CartItem from "./CartItem";
import { fetchShoppingBasketDetails } from '../../../../api/shoppingBasket';

import "./ShoppingCart.css";

function ShoppingCartDetail() {
  const navigate = useNavigate();
  const location = useLocation(); // الحصول على الموقع
  const { sellerId, sellerName, basketIndex, buyerId } = location.state || {}; // استخدم المتغيرات من state

  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBasket = async () => {
      try {
        const data = await fetchShoppingBasketDetails({ sellerId, sellerName }); // استدعاء الدالة من الملف الخارجي
        setBasket(data); // تحديث حالة السلال بالبيانات التي تم جلبها
      } catch (err) {
        setError("Error fetching shopping Baskets");
      } finally {
        setLoading(false); // التوقف عن حالة التحميل
      }
    };
    getBasket();
  }, [sellerId, sellerName]);

  if (loading) {
    return <div className='background-message'>Loading...</div>;
  }

  if (error) {
    return <div className='background-message'>{error}</div>;
  }


  const handleIncrement = (item) => {
    // تزيد كمية العنصر بواحد
    item.quantity += 1;
  };

  const handleDecrement = (item) => {
    // تقلل كمية العنصر بواحد إذا كانت الكمية أكبر من 1
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
  };

  // const handleRemove = (item) => {
  //   // setBasket((prevBasket) => ({
  //   //   ...prevBasket,
  //   //   items: prevBasket.items.filter((basketItem) => basketItem.item_id !== item.item_id),
  //   // }));
  // }

  return (
    <div className="shoppingCart">
      <Breadcrumb
        crumbs={[
          { name: "Shopping Carts", path: `/shoppingCarts/${basket.buyerId}` },
          { name: `Shopping Cart ${basketIndex}`, path: `/shoppingCarts/${buyerId}/${basketIndex}` },
        ]}
      />
      <div className="detail-container">
        <div className="detail-container-title">
          <div>Shopping Cart {basketIndex}</div>
          <div className="supplier-name">Supplier Name: {basket.sellerName}</div>
        </div>
        <div className="cart">
          {basket?.ShoppingBasketItems?.length > 0 ? (
            basket.ShoppingBasketItems.map((item, index) => (
              <CartItem
                key={item.item_id}
                item={item}
                quantity={item.quantity}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
              // onRemove={() => handleRemove(item)}
              />
            ))
          ) : (
            <div className='background-message'>No items found in the cart.</div>
          )}
        </div>
        <div className="order-summary">
          <div className="order-summary-title">Order Summary</div>
          <div className="order-total">
            <div className="total-title">Order Total:</div>
            <div className="total-price">{basket.total_price}</div>
          </div>
          <div className="order-summary-button">
            <Link to={`/shoppingCarts/${buyerId}/${basketIndex}/complete`}>
              <button className="Checkout-button">CHECkOUT</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartDetail;
