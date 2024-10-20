import React, { useState } from 'react';
import './styling.css';
import suppliersData from './dummyData'; // Ensure correct import path

const ViewSuppliers = () => {
  // Initialize the suppliers state with the imported data
  const [suppliers, setSuppliers] = useState(suppliersData);

  // Function to toggle the isActive status of a supplier
  const handleToggleSupplier = (id) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, isActive: !supplier.isActive } : supplier
      )
    );
  };

  return (
    <div className="Suppliercontainer">
      <div className="header-row">
        <h2 className="title">List of Added Suppliers</h2>
      </div>
      {suppliers.length > 0 ? (
        suppliers.map((supplier) => (
          <div key={supplier.id} className="search-result">
            <div className="supplier-info">
              <img 
                src="https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok=" 
                alt="Supplier"
              />
              <div>
                <h3>{supplier.name}</h3>
                <p>{supplier.description}</p>
                <p><strong>Category:</strong> {supplier.category}</p> {/* Display supplier category */}
              </div>
            </div>
            <div className="toggle-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={supplier.isActive}
                  onChange={() => handleToggleSupplier(supplier.id)} // Make checkbox interactive
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ))
      ) : (
        <div>No suppliers found</div>
      )}
    </div>
  );
};

export default ViewSuppliers;
