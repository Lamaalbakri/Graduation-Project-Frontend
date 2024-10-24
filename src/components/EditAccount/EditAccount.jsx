import React, { useState, useEffect } from "react";
import logo from "../images/User.png";
import { EditOutlined } from "@ant-design/icons";
import Address from "../../components/Dialog/Address";
import "./EditAccount.css";

const EditAccount = () => {
  const [account, setAccount] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [dialogState, setDialogState] = useState({
    address: false,
  });

  // جلب بيانات المستخدم من localStorage عند تحميل الصفحة
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("email"); // Assuming you stored this during registration
    const storedPhoneNumber = localStorage.getItem("phoneNumber"); // Assuming this as well

    if (storedUserName && storedEmail && storedPhoneNumber) {
      setAccount({
        name: storedUserName,
        email: storedEmail,
        phoneNumber: storedPhoneNumber,
        address: "", // يمكنك جلب العنوان من البيانات المخزنة إذا كان متاحاً
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
  };

  const handleDialogClose = () => {
    toggleDialog("address", false);
    // if () {
    console.log("add DB ubdate address");
    // }
  };
  const handleEditAddress = () => {
    toggleDialog("address", true);
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
          <label> Address: </label>
          <div className="edit-adress-detail">
            <div className="edit-address-text">Jedaah, faisaliah ,67584</div>
            <div className="edit-address-button">
              <button onClick={handleEditAddress}>
                Edit <EditOutlined />
              </button>
            </div>
          </div>
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
      {dialogState.address && (
        <Address
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
        />
      )}
    </div>
  );
};

export default EditAccount;
