import React, { useState } from "react";
import "./ViewMaterials.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Modal, Select } from "antd";
import { addItemToBasket } from '../../../../api/shoppingBasket';
const ProductCard = ({ d }) => {
  console.log(d);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // دالة لتحديث الخيارات
  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [optionName]: value
    }));
    console.log(selectedOptions)
  };

  // توحيد الميثود للزرين
  const handleAddToBasket = async (fromModal = false) => {

    const finalOptions = Object.keys(selectedOptions).map(optionName => ({
      optionType: optionName,
      values: [selectedOptions[optionName]]
    }));

    // ضبط القيم الافتراضية لكل خيار إذا لم يتم اختيارها
    d.materialOption.forEach(option => {
      if (!selectedOptions[option.optionName]) {
        finalOptions.push({
          optionType: option.optionName,
          values: [option.menuList[0]] // تعيين أول خيار كافتراضي
        });
      }
    });

    // تعيين الكمية الافتراضية بـ 1 إذا لم يتم إدخال كمية
    const finalQuantity = quantity || 1;

    // استدعاء API الإضافة إلى السلة
    const response = await addItemToBasket({
      item_id: d._id,
      quantity: finalQuantity,
      options: finalOptions,
      sellerId: d.supplierId._id,
      sellerName: d.supplierId.full_name
    });

    console.log(response);

    // إغلاق النافذة المنبثقة إذا تم الضغط على زر من داخلها
    if (fromModal) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="productCard-raw">
      <figure class="figure">
        <img src={d.image} alt="Card Preview" class="" />
      </figure>
      <div className="details-raw">
        <p className="grey-text">{d.slug}</p>
        <p onClick={() => setIsModalOpen(true)} className="title-raw">
          {d.name}
        </p>
        <Modal
          centered open={isModalOpen}
          onCancel={handleCancel}
          footer={null}>
          <div className="product-modal">
            <div className="modal-img">
              <img src={d.image} alt="Card Preview" class="" />
            </div>
            <div className="modal-desc">
              <p className="title-raw">{d.name}</p>
              <p className="modal-price">${d.price}</p>
              <p className="description">
                {d.description}
                {d.storageInfo}
              </p>
              {/* عرض الخيارات فقط في النافذة المنبثقة */}
              {d.materialOption?.map((option) => (
                <div key={option._id} className="product-option">
                  <p className="option-label">{option.optionName}:</p>
                  <Select
                    placeholder={`Select ${option.optionName}`}
                    style={{ width: 200 }}
                    onChange={(value) => handleOptionChange(option.optionName, value)}
                  >
                    {option.menuList.map((menuItem, index) => (
                      <Option key={index} value={menuItem}>
                        {menuItem}
                      </Option>
                    ))}
                  </Select>
                </div>
              ))}
              <div className="modal-bottom">
                <input type="number" name="" id=""
                  defaultValue={1}
                  min={1}
                  onChange={(e) => setQuantity(Number(e.target.value))} />
                <button onClick={() => handleAddToBasket(true)}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Add to Basket
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <p className="grey-text">
          By <span>{d?.supplierId?.full_name}</span>
          {/* By <span>{d.shortId}</span> */}
        </p>
        <div className="price">
          <p> SAR{d.price}</p>
          <button onClick={() => handleAddToBasket(false)}>
            <FontAwesomeIcon icon={faShoppingCart} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
