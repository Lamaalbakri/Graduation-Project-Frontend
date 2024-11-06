import React, { useState, useEffect } from "react";
import logo from "../images/User.png";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import Address from "../../components/Dialog/Address";
import { fetchUserData, updateUserData } from "../../api/userAPI";
import { useUserContext } from "../../contexts/UserContext";
import { useAddress } from "../../contexts/AddressContext";
import "./EditAccount.css";

const EditAccount = () => {
  const { address } = useAddress();
  const { userData, setUserData } = useUserContext();
  const [originalAccount, setOriginalAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        const accountData = {
          id: userData._id,
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          address: userData.address || "",
          userType: userData.userType || "",
        };
        setAccount(accountData);
        setOriginalAccount(accountData);
        setIsLoading(false); // finish loading
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsLoading(false); // end the loading in case of an error
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

        setUserData(response.data);
        setOriginalAccount(response.data);

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
    console.log("Account editing cancelled.");
    setAccount(originalAccount);
    notification.info({
      message: "Edit Cancelled",
      description: "The original account data has been restored.",
      placement: "top",
      icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
    });
  };

  return (
    <div className="edit-account-content">
      <h1 id="edit-account-title">Edit Account</h1>
      <div className="edit-account-container">
        <div className="edit-account-picture">
          <img src={logo} alt="Avatar" className="edit-account-avatar" />
        </div>
        <div className="edit-account-details">
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
          {/* Address Section: Render only if userType is not 'transporter' */}
          {!isLoading && account.userType !== "transporter" && (
            <div>
              <label> Address: </label>
              <div className="edit-adress-detail">
                {address ? (
                  // if address exist , display it
                  <div className="edit-address-text">{`${address.country}, ${address.city}, ${address.neighborhood}, ${address.street}.`}</div>
                ) : (
                  // if not exist  , display a message
                  <div className="edit-no-address-text">
                    <p>No address found, Click 'Edit' to add.</p>
                  </div>
                )}
                <div className="edit-address-button">
                  <button onClick={handleEditAddress}>
                    Edit <EditOutlined />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="edit-account-buttons">
        <button className="edit-account-cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="edit-account-save-button" onClick={handleSave}>
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
