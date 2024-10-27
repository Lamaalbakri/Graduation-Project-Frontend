import React, { useState, useEffect } from "react";
import logo from "../images/User.png";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import Address from "../../components/Dialog/Address";
import { fetchUserData, updateUserData } from "../../api/userAPI";
import "./EditAccount.css";

const EditAccount = () => {
  const [originalAccount, setOriginalAccount] = useState(null);
  const [account, setAccount] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    userType: "",
  });
  const [dialogState, setDialogState] = useState({
    address: false,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setAccount({
          id: userData._id,
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          userType: userData.userType || "",
        });
        setOriginalAccount({
          id: userData._id,
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          userType: userData.userType || "",
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    loadUserData();
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

  const handleSave = async () => {
    const userData = {
      id: account.id,
      full_name: account.full_name,
      email: account.email,
      phone_number: account.phone_number,
      address: account.address,
    };

    const userType = account.userType;
    if (!userType) {
      console.error("User type is not defined");
      return;
    }

    try {
      const response = await updateUserData(userData, userType);
      if (response && response.data) {
        console.log("Account updated successfully:", response.data);

        notification.success({
          message: "Update Successful!",
          description: "Your account information has been updated",
          placement: "top",
        });
      } else {
        console.log("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  const handleCancel = () => {
    console.log("Account editing cancelled");
    setAccount(originalAccount);
    notification.info({
      message: "Edit Cancelled",
      description: "The original account data has been restored.",
      placement: "top",
      icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
    });
  };

  return (
    <div className="edit-account">
      <h1>Edit Account</h1>
      <div className="account-container">
        <div className="account-picture">
          <img src={logo} alt="Avatar" className="account-avatar" />
        </div>

        <div className="account-details">
          <label>
            Name:
            <input
              type="text"
              name="full_name"
              value={account.full_name}
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
              name="phone_number"
              value={account.phone_number}
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