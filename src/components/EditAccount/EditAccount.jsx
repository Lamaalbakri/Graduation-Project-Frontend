import React, { useState } from "react";
import logo from "../images/User.png";
import "./EditAccount.css";

const EditAccount = () => {
  const [account, setAccount] = useState({
    name: "User name",
    email: "stakeholders@gmail.com",
    phoneNumber: "+966534389732",
    address: "285 N Broad St, Jeddah, JD 07208, SA",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  const handleSave = () => {
    console.log("Profile saved:", account);
    // Add your save logic (e.g., API call) here
  };

  const handleCancel = () => {
    console.log("Account editing cancelled");
    // Add cancel logic (e.g., reset to original profile values) here
  };

  return (
    <div className="edit-account">
      <h1>Edit Account</h1>
      <div className="account-container">
        <div className="account-picture">
          <img src={logo} alt="Avatar" className="account-avatar" />
          {/* امكن نحذفه */}
          <button className="upload-button">Change Photo</button>
        </div>

        <div className="account-details">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={account.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={account.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={account.phoneNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={account.address}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
      <div className="account-buttons">
        <button className="account-cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="account-save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditAccount;
