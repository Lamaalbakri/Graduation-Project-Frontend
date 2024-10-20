import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import "./ShoppingCart.css";

function ShoppingCartDetail() {
  const { id } = useParams();

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
  const carts = [
    {
      id: 1,
      supplier: "Grain Harvest Suppliers",
      items: [
        { name: "Flour(1 Liter)", quantity: 2, price: 150 },
        { name: "Oats(1 Liter)", quantity: 3, price: 110 },
      ],
      total: 400,
    },
    {
      id: 2,
      supplier: "Diary Supplier Co.",
      items: [
        { name: "Milk Cow's", quantity: 4, price: 150 },
        { name: "Milk Goat's", quantity: 2, price: 200 },
      ],
      total: 850,
    },
  ];

  // البحث عن السلة المناسبة بناءً على الـ id
  const cart = carts.find((c) => c.id === parseInt(id));

  return (
    <div className="shoppingCart">
      <Breadcrumb
        crumbs={[
          { name: "Shopping Carts", path: "/shoppingCarts" },
          { name: `Shopping Cart ${id}`, path: `/shoppingCart/${id}` },
        ]}
      />
      <div className="detail-container">
        <div className="detail-container-title">
          <div>Shopping Cart {id}</div>
          <div className="supplier-name">{cart.supplier}</div>
        </div>
        <div className="cart">
          {cart.items.map((item, index) => (
            <CartItem
              key={index}
              item={item}
              quantity={item.quantity}
              onIncrement={() => handleIncrement(item)}
              onDecrement={() => handleDecrement(item)}
            />
          ))}
        </div>
        <div className="order-summary">
          <div className="order-summary-title">Order Summary</div>
          <div className="order-total">
            <div className="total-title">Order Total:</div>
            <div className="total-price">930$</div>
          </div>
          <div className="order-summary-button">
            <Link to={`/shoppingCart/${id}/complete`}>
              <button className="Checkout-button">CHECkOUT</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartDetail;
