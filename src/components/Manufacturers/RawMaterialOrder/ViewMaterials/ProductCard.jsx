import React, { useState } from "react";
import "./ViewMaterials.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";

const ProductCard = ({ d }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="productCard">
      <figure class="figure">
        <img src={d.image} alt="Card Preview" class="" />
      </figure>
      <div className="details">
        <p className="grey-text">{d.slug}</p>
        <p onClick={() => setIsModalOpen(true)} className="title">
          {d.name}
        </p>
        <Modal centered open={isModalOpen} onCancel={handleCancel}>
          <div className="product-modal">
            <div className="modal-img">
              <img src={d.image} alt="Card Preview" class="" />
            </div>
            <div className="modal-desc">
              <p className="title">{d.name}</p>
              <div className="icon">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <p className="modal-price">${d.price}</p>
              <p className="description">
                {d.description}
                {d.storageInfo}
              </p>

              <div className="modal-bottom">
                <input type="number" name="" id="" defaultValue={1} />
                <button>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <div className="icon">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <p className="grey-text">(3.5)</p>
        </div>
        <p className="grey-text">
          By <span>{d.shortId}</span>
        </p>
        <div className="price">
          <p>${d.price}</p>
          <button>
            <FontAwesomeIcon icon={faShoppingCart} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
