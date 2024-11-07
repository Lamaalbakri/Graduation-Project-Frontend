import React, { useEffect, useState } from 'react';
import './ManageSupplierStyle.css';
import { fetchUserData, fetchUserDataWithSupplier, updateUserData } from "../../../../api/userAPI";

const ViewSuppliers = () => {
  const [user, setUser] = useState();
  const [suppliers, setSuppliers] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [supplierToToggle, setSupplierToToggle] = useState(null);

  useEffect(() => {
    fetchUserData().then(x => {
      setUser(x);
    });
  }, []);

  useEffect(() => {
    fetchUserDataWithSupplier().then(x => {
      console.log("user: ", x);
      setSuppliers(x.suppliersList);
    });
  }, []);

  const handleToggleSupplier = (id) => {
    const isSupplierAdded = user?.suppliersList.includes(id);

    if (isSupplierAdded) {
      // Show dialog to confirm removal
      setSupplierToToggle(id);
      setShowDialog(true);
    } else {
      // Directly add supplier
      confirmToggleSupplier(id, true);
    }
  };

  const confirmToggleSupplier = (id, skipDialog = false) => {
    let updatedUser = { ...user };
    const isSupplierAdded = updatedUser.suppliersList.includes(id);

    if (isSupplierAdded) {
      updatedUser.suppliersList = updatedUser.suppliersList.filter(supplierId => supplierId !== id);
    } else {
      updatedUser.suppliersList.push(id);
    }

    updatedUser.id = updatedUser._id;

    updateUserData(updatedUser, localStorage.getItem('userType'))
      .then(response => {
        console.log("updated: ", response.data);
        setUser(response.data);
      })
      .catch(error => {
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
        <h2 className="ManageSupplier-title">List of Added Suppliers</h2>
      </div>
      {suppliers?.length > 0 ? (
        suppliers.map((supplier) => (
          <div key={supplier._id} className="ManageSupplier-search-result">
            <div className="ManageSupplier-supplier-info">
              <img
                src="https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok="
                alt="Supplier"
              />
              <div>
                <h3>{supplier?.full_name}</h3>
                <p>{supplier?.rawMaterialList?.toString()}</p>
                <p><strong>Category:</strong> {supplier?.category}</p>
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
        <div className='background-message'>No suppliers found</div>
      )}

{showDialog && (
  <div className="ManageSupplier-dialog-overlay">
    <div className="ManageSupplier-dialog">
      <h3>Confirm Removal</h3>
      <p>Do you want to remove the supplier?</p>
      <div className="ManageSupplier-dialog-actions">
        <button 
          className="ManageSupplier-dialog-button"
          onClick={() => confirmToggleSupplier(supplierToToggle)}
        >
          Yes
        </button>
        <button 
          className="ManageSupplier-dialog-button"
          onClick={() => setShowDialog(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ViewSuppliers;
