import React, { useEffect, useState } from "react";
import logo from "../../../images/User.png";
import "./ManageManufacturerStyle.css";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getSearchManufacturerCategory } from "../../../../api/CategoryAPI";
import { fetchUserData, updateUserData } from "../../../../api/userAPI";

const AddManufacturer = () => {
  const [manufacturerCategory, setManufacturerCategory] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [manufacturers, setManufacturers] = useState();
  const [user, setUser] = useState([]);
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedName, setAppliedName] = useState("");
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

  const handleManufacturerCategoryChange = (e) => {
    setManufacturerCategory(e.target.value);
  };

  const handleManufacturerNameChange = (e) => {
    setManufacturerName(e.target.value);
  };

  const handleClear = () => {
    setManufacturerCategory("");
    setManufacturerName("");
    setIsSearchActive(false);
    setAppliedCategory("");
    setAppliedName("");
  };

  const handleApply = async () => {
    setAppliedCategory(manufacturerCategory);
    setAppliedName(manufacturerName);
    setIsSearchActive(true);

    getSearchManufacturerCategory(
      manufacturerCategory || null,
      manufacturerName || null
    ).then((x) => {
      setManufacturers(x);
    });
  };

  const handleToggleManufacturer = (id) => {
    const isManufacturerAdded = user?.manufacturersList.includes(id);

    if (isManufacturerAdded) {
      confirmToggleManufacturer(id, true);
    } else {
      setManufacturerToToggle(id);
      setShowDialog(true);
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
          Search for Manufacturer to Add
        </h2>
      </div>

      <div className="ManageManufacturer-card-container">
        <div className="ManageManufacturer-searchcontainer">
          <div className="ManageManufacturer-search-inputs">
            <select
              name="supplier-category"
              value={manufacturerCategory}
              onChange={handleManufacturerCategoryChange}
            >
              <option value="">Select Manufacturer Category</option>
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
              placeholder="Search for Manufacturer By Name / ID"
              value={manufacturerName}
              onChange={handleManufacturerNameChange}
            />
          </div>
          <div className="ManageManufacturer-search-buttons">
            <button
              className="ManageManufacturer-clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="ManageManufacturer-apply-button"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {isSearchActive && (
        <>
          <div className="ManageManufacturer-results-header">
            <h3>Search Results</h3>
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
                      checked={user?.manufacturersList.includes(
                        manufacturer._id
                      )}
                      onChange={() =>
                        handleToggleManufacturer(manufacturer._id)
                      }
                    />
                    <span className="ManageManufacturer-slider round"></span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="background-message">No manufacturers found</div>
          )}
        </>
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
              <CheckCircleOutlined
                style={{
                  color: "green",
                  marginRight: 8,
                  fontSize: "25px",
                }}
              />
              <h3 style={{ margin: 0 }}>Confirm Action</h3>
            </div>
            <p>Are you sure you want to add this manufacturer?</p>
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

export default AddManufacturer;
