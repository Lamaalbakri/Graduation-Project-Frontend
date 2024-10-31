import React from "react";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./DialogStyle.css";

function Address({ onClose }) {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSaveAddress = (event) => {
    event.preventDefault();
    const newAddress = {
      city,
      street,
      district,
      postalCode,
    };
    onClose(newAddress); // إعادة العنوان الجديد إلى المكون الرئيسي
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box-address">
        <div className="dialog-content">
          <div className="close-button" onClick={() => onClose(false)}>
            <CloseOutlined />
          </div>
          <div className="dialog-title-address">Add New Address</div>
          <form className="form-container">
            <div class="form-group">
              <label for="city">
                <span className="required">*</span>City
              </label>
              <input
                type="text"
                onChange={(e) => setCity(e.target.value)}
                id="city"
                name="city"
                placeholder="Enter city"
                required
              />
            </div>
            <div class="form-group">
              <label for="street">
                <span className="required">*</span>Street
              </label>
              <input
                type="text"
                onChange={(e) => setStreet(e.target.value)}
                id="street"
                name="street"
                placeholder="Enter street"
                required
              />
            </div>
            <div class="form-group">
              <label for="district">
                <span className="required">*</span>District
              </label>
              <input
                type="text"
                onChange={(e) => setDistrict(e.target.value)}
                id="district"
                name="district"
                placeholder="Enter district"
                required
              />
            </div>
            <div class="form-group">
              <label for="postalCode">Postal Code (Optional)</label>
              <input
                type="text"
                onChange={(e) => setPostalCode(e.target.value)}
                id="postalCode"
                name="postalCode"
                placeholder="Enter postal code"
              />
            </div>
            <div
              className="button-container"
              style={{
                justifyContent: "flex-end",
              }}
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
