import React, { useEffect, useState } from "react";
import "./styling.css";
import { getSearchSupplierCategory } from "../../../../api/CategoryAPI";
import { fetchUserData, updateUserData } from "../../../../api/userAPI";

const AddSupplier = () => {
  const [supplierCategory, setSupplierCategory] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suppliers, setSuppliers] = useState();
  const [user, setUser] = useState();
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedName, setAppliedName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [supplierToToggle, setSupplierToToggle] = useState(null);

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
  };

  const handleApply = async () => {
    setAppliedCategory(supplierCategory);
    setAppliedName(supplierName);
    setIsSearchActive(true);
    getSearchSupplierCategory(
      supplierCategory || null,
      supplierName || null
    ).then((x) => {
      setSuppliers(x);
    });
  };

  const handleToggleSupplier = (id) => {
    const isSupplierAdded = user?.suppliersList.includes(id);

    if (isSupplierAdded) {
      // If supplier is already added, remove it without confirmation
      confirmToggleSupplier(id, true);
    } else {
      // If supplier is not added, show confirmation dialog to add
      setSupplierToToggle(id);
      setShowDialog(true);
    }
  };

  const confirmToggleSupplier = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isSupplierAdded = updatedUser.suppliersList.includes(id);

    if (isSupplierAdded) {
      // Remove supplier
      updatedUser.suppliersList = updatedUser.suppliersList.filter(
        (supplierId) => supplierId !== id
      );
    } else {
      // Add supplier
      updatedUser.suppliersList.push(id);
    }

    updatedUser.id = updatedUser._id;

    updateUserData(updatedUser, localStorage.getItem("userType"))
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
    <div className="Suppliercontainer">
      <div className="header-row">
        <h2 className="title">Search for Supplier to Add</h2>
      </div>

      <div className="card-container">
        <div className="searchcontainer">
          <div className="search-inputs">
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
              placeholder="Search For Supplier By Name / ID"
              value={supplierName}
              onChange={handleSupplierNameChange}
            />
          </div>
          <div className="search-buttons">
            <button className="clear-button" onClick={handleClear}>
              Clear
            </button>
            <button className="apply-button" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {isSearchActive && (
        <>
          <div className="results-header">
            <h3>Search Results</h3>
          </div>
          {suppliers?.length > 0 ? (
            suppliers.map((supplier) => (
              <div key={supplier._id} className="search-result">
                <div className="supplier-info">
                  <img
                    src="https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok="
                    alt="Supplier"
                  />
                  <div>
                    <h3>{supplier?.full_name}</h3>
                    <p>{supplier?.rawMaterialList?.toString()}</p>
                    <p>
                      <strong>Category:</strong> {supplier?.category}
                    </p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={user?.suppliersList.includes(supplier._id)}
                      onChange={() => handleToggleSupplier(supplier._id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div>No suppliers found</div>
          )}
        </>
      )}

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <p>Are you sure you want to add this supplier?</p>
            <button onClick={() => confirmToggleSupplier(supplierToToggle)}>
              Yes
            </button>
            <button onClick={() => setShowDialog(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupplier;
