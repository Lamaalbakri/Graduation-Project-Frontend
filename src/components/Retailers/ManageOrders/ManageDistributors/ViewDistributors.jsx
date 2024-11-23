import React, { useEffect, useState } from "react";
import logo from "../../../images/User.png";
import "./ManageDistributorStyle.css";
import { CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  fetchUserData,
  fetchUserDataWithDistributor,
  updateUserData,
} from "../../../../api/userAPI";

const ViewDistributors = () => {
  const [user, setUser] = useState();
  const [distributors, setDistributors] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [distributorToToggle, setDistributorToToggle] = useState(null);

  const closeDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    fetchUserData().then((x) => {
      setUser(x);
    });
  }, []);

  useEffect(() => {
    fetchUserDataWithDistributor().then((x) => {
      console.log("user: ", x);
      setDistributors(x.distributorsList);
    });
  }, []);

  const handleToggleDistributor = (id) => {
    const isDistributorAdded = user?.distributorsList.includes(id);

    if (isDistributorAdded) {
      // Show dialog to confirm removal
      setDistributorToToggle(id);
      setShowDialog(true);
    } else {
      // Directly add
      confirmToggleDistributors(id, true);
    }
  };

  const confirmToggleDistributors = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isDistributorAdded = updatedUser.distributorsList.includes(id);

    if (isDistributorAdded) {
      updatedUser.distributorsList = updatedUser.distributorsList.filter(
        (distributorId) => distributorId !== id
      );
    } else {
      updatedUser.distributorsList.push(id);
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
      setDistributorToToggle(null);
    }
  };

  return (
    <div className="ManageDistributor-Suppliercontainer">
      <div className="ManageDistributor-header-row">
        <h2 className="ManageDistributor-title">List of Added Distributors</h2>
      </div>
      {distributors?.length > 0 ? (
        distributors.map((distributor) => (
          <div
            key={distributor._id}
            className="ManageDistributor-search-result"
          >
            <div className="ManageDistributor-supplier-info">
              <img src={logo} alt="Distributor" />
              <div>
                <h3>{distributor?.full_name}</h3>
                <p>
                  <strong>Category:</strong> {distributor?.category}
                </p>
              </div>
            </div>
            <div className="ManageDistributor-toggle-switch">
              <label className="ManageDistributor-switch">
                <input
                  type="checkbox"
                  checked={user?.distributorsList.includes(distributor._id)}
                  onChange={() => handleToggleDistributor(distributor._id)}
                />
                <span className="ManageDistributor-slider round"></span>
              </label>
            </div>
          </div>
        ))
      ) : (
        <div className="background-message">No distributors found</div>
      )}

      {showDialog && (
        <div className="ManageDistributor-dialog-overlay">
          <div className="ManageDistributor-dialog">
            <span
              className="ManageDistributor-dialog-close"
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
              className="ManageDistributor-dialog-header"
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
            <p>Do you want to remove the distributor?</p>
            <div className="ManageDistributor-dialog-actions">
              <button
                className="ManageDistributor-dialog-button-No"
                onClick={() => setShowDialog(false)}
              >
                No
              </button>
              <button
                className="ManageDistributor-dialog-button-Yes"
                onClick={() => confirmToggleDistributors(distributorToToggle)}
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

export default ViewDistributors;
