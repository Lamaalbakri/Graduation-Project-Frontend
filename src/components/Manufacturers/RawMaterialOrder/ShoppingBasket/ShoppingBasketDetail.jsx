import React, { useState, useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
import BasketItem from "./BasketItem";
import { notification } from "antd";
import {
  updateBasketItemQuantity,
  fetchShoppingBasketDetails,
  deleteItemFromBasket,
  deleteBasket,
} from "../../../../api/shoppingBasket";
import ConfirmationDialog from "../../../Dialog/ConfirmationDialog";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./ShoppingBasket.css";

function ShoppingBasketDetail() {
  const { basketId, basketIndex } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [updatedBasket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfBasketItems, setNumberOfBasketItems] = useState(null);

  const [dialogState, setDialogState] = useState({
    confirmationDialog: false,
    itemToDelete: null,
  });

  const fetchBasketDetails = async () => {
    try {
      const data = await fetchShoppingBasketDetails({ basketId });
      //console.log("Fetched Basket Data:", data);
      if (data) {
        setBasket(data.basket);
        setNumberOfBasketItems(data.numberOfBasketItems);
      } else {
        setError("Error fetching shopping baskets");
      }
    } catch (err) {
      setError("Error fetching shopping Baskets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasketDetails();
  }, [basketId]);

  if (loading) {
    return <div className="background-message">Loading...</div>;
  }

  if (error) {
    return <div className="background-message">{error}</div>;
  }

  if (!updatedBasket) {
    return <div className="background-message">No basket found.</div>;
  }

  const handleIncrement = async (item) => {
    try {
      const newQuantity = item.quantity + 1;
      const itemId = item._id;
      // console.log(itemId, newQuantity, basketId);
      await updateBasketItemQuantity({ itemId, basketId, newQuantity });
      await fetchBasketDetails();
    } catch (error) {
      setError("Error updating item quantity");
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      try {
        const newQuantity = item.quantity - 1;
        const itemId = item._id;
        await updateBasketItemQuantity({ itemId, basketId, newQuantity });
        await fetchBasketDetails();
      } catch (error) {
        setError("Error updating item quantity");
      }
    }
  };

  const handleRemove = (item) => {
    setDialogState((prevState) => ({
      ...prevState,
      confirmationDialog: true,
      itemToDelete: item,
    }));
  };

  const confirmDeleteItem = async () => {
    if (dialogState.itemToDelete) {
      const { itemToDelete } = dialogState;
      try {
        const result = await deleteItemFromBasket({
          itemId: itemToDelete._id,
          basketId,
        });

        if (result.basket) {
          setBasket(result.basket);
          setNumberOfBasketItems(result.numberOfBasketItems);
          // If the basket is empty after deletion, delete it completely and prompt the user
          if (result.numberOfBasketItems === 0) {
            const deleteBasketResult = await deleteBasket({ basketId });
            notification.info({
              message: "Delete Basket",
              description:
                "The basket has been deleted as it does not contain any items.",
              placement: "top",
              icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
            });
            navigate("/shoppingBaskets");
          }
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError("Error deleting item from basket");
      } finally {
        toggleDialog("confirmationDialog", false); //close dialog
      }
    }
  };

  const toggleDialog = (dialogName, value) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
  };
  const handleCheckout = () => {
    // تحقق من العناصر في السلة
    const unavailableItem = updatedBasket.ShoppingBasketItems.find(
      (item) => item.stockStatus === "Out of Stock" || (item.quantity > item.stockQuantity)
    );

    if (unavailableItem) {
      // Show a warning message if an item is out of stock or the quantity is greater than available
      notification.warning({
        message: ``,
        description: unavailableItem.stockStatus === "Out of Stock"
          ? (
            <div>
              <p>{`${unavailableItem.item_name} is out of stock. Please delete it.`}</p>
            </div>
          )
          : (
            <div>
              <p>{`${unavailableItem.item_name} exceeds stock.`}</p>
              <p>{`Available quantity is ${unavailableItem.stockQuantity}. Please reduce quantity.`}</p>

            </div>
          ),
        placement: "top",
        icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
      });
      return; // Stop execution and prevent redirection to CHECKOUT page
    }

    // If all quantities are correct, proceed to the CHECKOUT page.
    navigate(`/shoppingBaskets/${basketId}/${basketIndex}/complete`, {
      state: {
        total_price: updatedBasket.total_price,
      },
    });
  };

  return (
    <div className="shoppingBasket">
      <Breadcrumb
        crumbs={[
          { name: "Shopping Baskets", path: `/shoppingBaskets` },
          {
            name: `Shopping Basket ${basketIndex}`,
            path: `/shoppingBaskets/${updatedBasket._id}/${basketIndex}`,
          },
        ]}
      />
      <div className="detail-container">
        <div className="detail-container-title">
          <div>Shopping Basket {basketIndex}</div>
          <div className="supplier-name">
            Supplier Name: {updatedBasket.sellerName}
          </div>
        </div>
        <div className="Basket">
          {updatedBasket?.ShoppingBasketItems?.length > 0 ? (
            updatedBasket.ShoppingBasketItems.map((item, index) => (
              <BasketItem
                key={item._id}
                item={item}
                quantity={item.quantity}
                stockStatus={item.stockStatus}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
                onRemove={() => handleRemove(item)}
              />
            ))
          ) : (
            <div className="background-message">
              No items found in the Basket.
            </div>
          )}
        </div>
        <div className="order-summary">
          <div className="order-summary-title">Payment Summary</div>
          <div className="order-total">
            <div className="total-price">
              Subtotal:{" "}
              <span className="total-title">({numberOfBasketItems} Items)</span>
            </div>
            <div className="total-price">
              {updatedBasket.subtotal_items} SAR
            </div>
          </div>
          <div className="order-total">
            <div className="total-price">
              Shipping Cost:{" "}
              <span className="total-title">(10% of subtotal)</span>
            </div>
            <div className="total-price">{updatedBasket.shipping_cost} SAR</div>
          </div>
          <hr className="divider" />
          <div className="order-total">
            <div className="total-price">Order Total:</div>
            <div className="total-price">{updatedBasket.total_price} SAR</div>
          </div>
          <div className="order-summary-button">
            <button onClick={handleCheckout} className="Checkout-button">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={
            <>
              <CloseCircleOutlined
                style={{
                  color: "red",
                  marginRight: 8,
                  fontSize: "35px",
                  position: "relative",
                  top: "6px",
                }}
              />
              {`Confirm Delete Item`}
            </>
          }
          message={`Are you sure you want to delete this item from the shopping basket?`}
          onConfirm={confirmDeleteItem}
          onCancel={() => toggleDialog("confirmationDialog", false)}
          stepType={"default"}
        />
      )}
    </div>
  );
}

export default ShoppingBasketDetail;
