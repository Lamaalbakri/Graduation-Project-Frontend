import React, { useEffect, useState } from "react";
import logo from "../../../images/User.png";
import "./ManageSupplierStyle.css";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getSearchSupplierCategory } from "../../../../api/CategoryAPI";
import { fetchUserData, updateUserData } from "../../../../api/userAPI";

const AddSupplier = () => {
  const [supplierCategory, setSupplierCategory] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [user, setUser] = useState();
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [supplierToToggle, setSupplierToToggle] = useState(null);

  const closeDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    fetchUserData().then((x) => {
      setUser(x);
    });
  }, []);

  const handleSupplierCategoryChange = (e) => {
    setSupplierCategory(e.target.value);
  };

  const handleSupplierNameChange = (e) => {
    setSupplierName(e.target.value);
  };

  const handleClear = () => {
    setSupplierCategory("");
    setSupplierName("");
    setIsSearchActive(false);
    setAppliedCategory("");
    setAppliedName("");
    setSuppliers([]); // Clear the suppliers list
  };

  const handleApply = async () => {
    // Check if the user has selected a category but hasn't provided a supplier name or ID
    if (supplierCategory && !supplierName) {
      setSuppliers([]); // Set suppliers to an empty array to show "No suppliers found"
      setIsSearchActive(true);
      return;
    }

    // Check if neither category nor name is provided
    if (!supplierCategory && !supplierName) {
      setSuppliers([]); // Show "No suppliers found" if no category or name is provided
      setIsSearchActive(true);
      return;
    }

    setAppliedCategory(supplierCategory);
    setAppliedName(supplierName);
    setIsSearchActive(true);

    // Fetch suppliers based on the entered criteria
    getSearchSupplierCategory(supplierCategory || null, supplierName || null)
      .then((x) => {
        // Show "No suppliers found" if no results match or if random name doesn't yield a specific match
        if (
          !x ||
          x.length === 0 ||
          (supplierName &&
            x.every((supplier) => supplier.full_name !== supplierName))
        ) {
          setSuppliers([]); // Show "No suppliers found" when there is no match
        } else {
          setSuppliers(x);
        }
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  const handleToggleSupplier = (id) => {
    const isSupplierAdded = user?.suppliersList.includes(id);

    if (isSupplierAdded) {
      confirmToggleSupplier(id, true);
    } else {
      setSupplierToToggle(id);
      setShowDialog(true);
    }
  };

  const confirmToggleSupplier = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isSupplierAdded = updatedUser.suppliersList.includes(id);

    if (isSupplierAdded) {
      updatedUser.suppliersList = updatedUser.suppliersList.filter(
        (supplierId) => supplierId !== id
      );
    } else {
      updatedUser.suppliersList.push(id);
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
      setSupplierToToggle(null);
    }
  };

  return (
    <div className="ManageSupplier-Suppliercontainer">
      <div className="ManageSupplier-header-row">
        <h2 className="ManageSupplier-title">Search for Supplier to Add</h2>
      </div>

      <div className="ManageSupplier-card-container">
        <div className="ManageSupplier-searchcontainer">
          <div className="ManageSupplier-search-inputs">
            <select
              name="supplier-category"
              value={supplierCategory}
              onChange={handleSupplierCategoryChange}
            >
              <option value="">Select Supplier Category</option>
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
              placeholder="Search for Supplier By Name / ID"
              value={supplierName}
              onChange={handleSupplierNameChange}
            />
          </div>
          <div className="ManageSupplier-search-buttons">
            <button
              className="ManageSupplier-clear-button"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="ManageSupplier-apply-button"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {isSearchActive && (
        <>
          <div className="ManageSupplier-results-header">
            <h3>Search Results</h3>
          </div>
          {suppliers?.length > 0 ? (
            suppliers.map((supplier) => (
              <div key={supplier._id} className="ManageSupplier-search-result">
                <div className="ManageSupplier-supplier-info">
                  <img src={logo} alt="Supplier" />
                  <div>
                    <h3>{supplier?.full_name}</h3>
                    <p>{supplier?.rawMaterialList?.toString()}</p>
                    <p>
                      <strong>Category:</strong> {supplier?.category}
                    </p>
                  </div>
                </div>
                <div className="ManageSupplier-toggle-switch">
                  <label className="ManageSupplier-switch">
                    <input
                      type="checkbox"
                      checked={user?.suppliersList.includes(supplier._id)}
                      onChange={() => handleToggleSupplier(supplier._id)}
                    />
                    <span className="ManageSupplier-slider round"></span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="background-message">No suppliers found</div>
          )}
        </>
      )}

      {showDialog && (
        <div className="ManageSupplier-dialog-overlay">
          <div className="ManageSupplier-dialog">
            <span className="ManageSupplier-dialog-close" onClick={closeDialog}>
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
              className="ManageSupplier-dialog-header"
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
            <p>Are you sure you want to add this supplier?</p>
            <div className="ManageSupplier-dialog-actions">
              <button
                className="ManageSupplier-dialog-button-No"
                onClick={() => setShowDialog(false)}
              >
                No
              </button>
              <button
                className="ManageSupplier-dialog-button-Yes"
                onClick={() => confirmToggleSupplier(supplierToToggle)}
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

export default AddSupplier;
