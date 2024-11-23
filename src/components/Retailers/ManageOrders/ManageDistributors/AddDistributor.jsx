import React, { useEffect, useState } from "react";
import logo from "../../../images/User.png";
import "./ManageDistributorStyle.css";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getSearchDistributorCategory } from "../../../../api/CategoryAPI";
import { fetchUserData, updateUserData } from "../../../../api/userAPI";

const AddDistributor = () => {
  const [distributorCategory, setDistributorCategory] = useState("");
  const [distributorName, setDistributorName] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [distributors, setDistributors] = useState();
  const [user, setUser] = useState([]);
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedName, setAppliedName] = useState("");
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

  const handleCategoryChange = (e) => {
    setDistributorCategory(e.target.value);
  };

  const handleNameChange = (e) => {
    setDistributorName(e.target.value);
  };

  const handleClear = () => {
    setDistributorCategory("");
    setDistributorName("");
    setIsSearchActive(false);
    setAppliedCategory("");
    setAppliedName("");
  };

  const handleApply = async () => {
    setAppliedCategory(distributorCategory);
    setAppliedName(distributorName);
    setIsSearchActive(true);

    getSearchDistributorCategory(
      distributorCategory || null,
      distributorName || null
    ).then((x) => {
      setDistributors(x);
    });
  };

  const handleToggle = (id) => {
    const isManufacturerAdded = user?.distributorsList.includes(id);

    if (isManufacturerAdded) {
      confirmToggle(id, true);
    } else {
      setDistributorToToggle(id);
      setShowDialog(true);
    }
  };

  const confirmToggle = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isManufacturerAdded = updatedUser.distributorsList.includes(id);

    if (isManufacturerAdded) {
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
        <h2 className="ManageDistributor-title">
          Search for Distributor to Add
        </h2>
      </div>

      <div className="ManageDistributor-card-container">
        <div className="ManageDistributor-searchcontainer">
          <div className="ManageDistributor-search-inputs">
            <select
              name="supplier-category"
              value={distributorCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Distributor Category</option>
              <option value="Agriculture and Food Products">
                Agriculture and Food Products
              </option>
              <option value="Pharmaceuticals and Medical Supplies">
                Pharmaceuticals and Medical Supplies
              </option>
              <option value="Chemicals and Metals">Chemicals and Metals</option>
              <option value="Fast-Moving Consumer Goods (FMCG)">
                Fast-Moving Consumer Goods (FMCG)
              </option>
              <option value="Electronics and Electrical Equipment">
                Electronics and Electrical Equipment
              </option>
              <option value="Textiles and Apparel">Textiles and Apparel</option>
              <option value="Renewable Energy and Advanced Technology">
                Renewable Energy and Advanced Technology
              </option>
              <option value="Construction and Building Materials">
                Construction and Building Materials
              </option>
              <option value="Automotive and Transportation Equipment">
                Automotive and Transportation Equipment
              </option>
              <option value="Paper and Packaging Products">
                Paper and Packaging Products
              </option>
            </select>
            <input
              type="text"
              placeholder="Search for Distributor By Name / ID"
              value={distributorName}
              onChange={handleNameChange}
            />
          </div>
          <div className="ManageDistributor-search-buttons">
            <button
              className="ManageDistributor-clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="ManageDistributor-apply-button"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {isSearchActive && (
        <>
          <div className="ManageDistributor-results-header">
            <h3>Search Results</h3>
          </div>
          {distributors?.length > 0 ? (
            distributors.map((distributor) => (
              <div
                key={distributor._id}
                className="ManageDistributor-search-result"
              >
                <div className="ManageDistributor-supplier-info">
                  <img src={logo} alt="Manufacturer" />
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
                      onChange={() => handleToggle(distributor._id)}
                    />
                    <span className="ManageDistributor-slider round"></span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="background-message">No distributors found</div>
          )}
        </>
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
              <CheckCircleOutlined
                style={{
                  color: "green",
                  marginRight: 8,
                  fontSize: "25px",
                }}
              />
              <h3 style={{ margin: 0 }}>Confirm Action</h3>
            </div>
            <p>Are you sure you want to add this distributor?</p>
            <div className="ManageDistributor-dialog-actions">
              <button
                className="ManageDistributor-dialog-button-No"
                onClick={() => setShowDialog(false)}
              >
                No
              </button>
              <button
                className="ManageDistributor-dialog-button-Yes"
                onClick={() => confirmToggle(distributorToToggle)}
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

export default AddDistributor;
