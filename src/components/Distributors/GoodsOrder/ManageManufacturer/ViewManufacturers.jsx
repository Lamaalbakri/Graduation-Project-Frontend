import React, { useEffect, useState } from "react";
import logo from "../../../images/User.png";
import "./ManageManufacturerStyle.css";
import { CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  fetchUserData,
  fetchUserDataWithManufacturer,
  updateUserData,
} from "../../../../api/userAPI";

const ViewManufacturers = () => {
  const [user, setUser] = useState();
  const [manufacturers, setManufacturers] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [manufacturerToToggle, setManufacturerToToggle] = useState(null);

  const closeDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    fetchUserData().then((x) => {
      setUser(x);
    });
  }, []);

  useEffect(() => {
    fetchUserDataWithManufacturer().then((x) => {
      console.log("user: ", x);
      setManufacturers(x.manufacturersList);
    });
  }, []);

  const handleToggleManufacturer = (id) => {
    const isManufacturerAdded = user?.manufacturersList.includes(id);

    if (isManufacturerAdded) {
      // Show dialog to confirm removal
      setManufacturerToToggle(id);
      setShowDialog(true);
    } else {
      // Directly add
      confirmToggleManufacturer(id, true);
    }
  };

  const confirmToggleManufacturer = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isManufacturerAdded = updatedUser.manufacturersList.includes(id);

    if (isManufacturerAdded) {
      updatedUser.manufacturersList = updatedUser.manufacturersList.filter(
        (manufacturerId) => manufacturerId !== id
      );
    } else {
      updatedUser.manufacturersList.push(id);
    }

    updatedUser.id = updatedUser._id;

    updateUserData(updatedUser, sessionStorage.getItem("userType"))
      .then((response) => {
        console.log("updated: ", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error updating user data: ", error);
      });

    if (!skipDialog) {
      setShowDialog(false);
      setManufacturerToToggle(null);
    }
  };

  return (
    <div className="ManageManufacturer-Suppliercontainer">
      <div className="ManageManufacturer-header-row">
        <h2 className="ManageManufacturer-title">
          List of Added Manufacturers
        </h2>
      </div>
      {manufacturers?.length > 0 ? (
        manufacturers.map((manufacturer) => (
          <div
            key={manufacturer._id}
            className="ManageManufacturer-search-result"
          >
            <div className="ManageManufacturer-supplier-info">
              <img src={logo} alt="Manufacturer" />
              <div>
                <h3>{manufacturer?.full_name}</h3>
                <p>
                  <strong>Category:</strong> {manufacturer?.category}
                </p>
              </div>
            </div>
            <div className="ManageManufacturer-toggle-switch">
              <label className="ManageManufacturer-switch">
                <input
                  type="checkbox"
                  checked={user?.manufacturersList.includes(manufacturer._id)}
                  onChange={() => handleToggleManufacturer(manufacturer._id)}
                />
                <span className="ManageManufacturer-slider round"></span>
              </label>
            </div>
          </div>
        ))
      ) : (
        <div className="background-message">No manufacturers found</div>
      )}

      {showDialog && (
        <div className="ManageManufacturer-dialog-overlay">
          <div className="ManageManufacturer-dialog">
            <span
              className="ManageManufacturer-dialog-close"
              onClick={closeDialog}
            >
              <CloseOutlined
                style={{
                  fontSize: "16px",
                  color: "#1c2229",
                  cursor: "pointer",
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                }}
              />
            </span>
            <div
              className="ManageManufacturer-dialog-header"
              style={{ display: "flex", alignItems: "center" }}
            >
              <CloseCircleOutlined
                style={{
                  color: "red",
                  marginRight: 8,
                  fontSize: "25px",
                }}
              />
              <h3 style={{ margin: 0 }}>Confirm Removal</h3>
            </div>
            <p>Do you want to remove the manufacturer?</p>
            <div className="ManageManufacturer-dialog-actions">
              <button
                className="ManageManufacturer-dialog-button-No"
                onClick={() => setShowDialog(false)}
              >
                No
              </button>
              <button
                className="ManageManufacturer-dialog-button-Yes"
                onClick={() => confirmToggleManufacturer(manufacturerToToggle)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewManufacturers;
