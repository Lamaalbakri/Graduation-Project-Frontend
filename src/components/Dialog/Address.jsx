import React, { useState, useEffect } from "react";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { notification, Modal } from "antd";
import "./DialogStyle.css";
import { createAddress, updateAddress } from "../../api/addressApi";
import { useAddress } from "../../contexts/AddressContext";

function Address({ onClose }) {
  const { address, setAddress } = useAddress(); // الحصول على العنوان من السياق
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // جلب العنوان الموجود عند تحميل المكون
  useEffect(() => {
    if (address) {
      setCity(address.city);
      setStreet(address.street);
      setNeighborhood(address.neighborhood);
      setPostalCode(address.postal_code);
      setCountry(address.country);
    }
  }, [address]); // تنفيذ التأثير عندما يتغير العنوان

  // دالة الحفظ
  const handleSaveAddress = async (event) => {
    event.preventDefault();
    const newAddress = {
      street,
      city,
      neighborhood,
      postal_code,
      country,
    };

    try {
      let savedAddress;
      if (address && address._id) {
        // إذا كان هناك عنوان موجود، قم بالتحديث
        savedAddress = await updateAddress(address._id, newAddress);
      } else {
        // إذا لم يكن هناك عنوان موجود، قم بإنشاء عنوان جديد
        const response = await createAddress(newAddress);

        if (!response.success) {
          Modal.error({
            title: "Error:",
            content: 'You already have an address, refresh the page if not appear.',
            okButtonProps: {
              className: "confirm-buttonn",
            },
          });
          return;
        }

        // إذا نجحت العملية، خذ البيانات المحفوظة
        savedAddress = response.data;
      }
      setAddress(savedAddress);
      onClose(savedAddress);
    } catch (error) {
      Modal.error({
        title: "Error:",
        content: 'Error saving address, try again.',
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box-address">
        <div className="dialog-content">
          <div className="close-button" onClick={() => onClose(false)}>
            <CloseOutlined />
          </div>
          <div className="dialog-title-address">Add or Update Address</div>
          <form className="form-container" onSubmit={handleSaveAddress}>
            <div className="form-group">
              <label htmlFor="country">
                <span className="required">*</span>Country
              </label>
              <input
                type="text"
                value={country} //إذا كانت فارغة، سيظهر placeholder
                onChange={(e) => setCountry(e.target.value)}
                id="country"
                name="country"
                placeholder="Enter country"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">
                <span className="required">*</span>City
              </label>
              <input
                type="text"
                value={city} //إذا كانت فارغة، سيظهر placeholder
                onChange={(e) => setCity(e.target.value)}
                id="city"
                name="city"
                placeholder="Enter city"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">
                <span className="required">*</span>Street
              </label>
              <input
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                value={street} // استخدام القيمة من الحالة
                id="street"
                name="street"
                placeholder="Enter street"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="neighborhood">
                <span className="required">*</span>Neighborhood
              </label>
              <input
                type="text"
                value={neighborhood} // استخدام القيمة من الحالة
                onChange={(e) => setNeighborhood(e.target.value)}
                id="neighborhood"
                name="neighborhood"
                placeholder="Enter neighborhood"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postal_code">Postal Code (Optional)</label>
              <input
                type="text"
                value={postal_code} // استخدام القيمة من الحالة
                onChange={(e) => setPostalCode(e.target.value)}
                id="postal_code"
                name="postal_code"
                placeholder="Enter postal code"
              />
            </div>
            <div
              className="button-container"
              style={{ justifyContent: "flex-end" }}
            >
              <button className="cancel-button" onClick={() => onClose(false)}>
                Cancel
              </button>
              <button
                className="save-button"
                type="button"
                onClick={handleSaveAddress}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Address;
