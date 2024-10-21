import React, { useState } from 'react';
import './styling.css';
import suppliersData from './dummyData'; 

const AddSupplier = () => {
  const [supplierCategory, setSupplierCategory] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suppliers, setSuppliers] = useState(suppliersData);

  // updated only when "Apply" is clicke
  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedName, setAppliedName] = useState('');

  const handleSupplierCategoryChange = (e) => {
    setSupplierCategory(e.target.value);
  };

  const handleSupplierNameChange = (e) => {
    setSupplierName(e.target.value);
  };

  const handleClear = () => {
    setSupplierCategory('');
    setSupplierName('');
    setIsSearchActive(false); 
    setAppliedCategory('');  
    setAppliedName('');
  };

  const handleApply = () => {
    setAppliedCategory(supplierCategory); 
    setAppliedName(supplierName);       
    setIsSearchActive(true);     
  };

  const handleToggleSupplier = (id) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, isActive: !supplier.isActive } : supplier
      )
    );
  };

  // Filter suppliers based on the applied search input and category selection
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesCategory = appliedCategory ? supplier.category === appliedCategory : true;

    const matchesSearch = appliedName
      ? (supplier.name.toLowerCase().includes(appliedName.toLowerCase()) || 
         supplier.id.toString().includes(appliedName)) 
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="Suppliercontainer">
      <div className="header-row">
        <h2 className="title">Search for Supplier to Add</h2>
      </div>


      <div className="card-container">
        <div className="searchcontainer">
          <div className="search-inputs">
            <select name="supplier-category" value={supplierCategory} onChange={handleSupplierCategoryChange}>
              <option value="">Select Supplier Category</option>
              <option value="Category 1">Category 1</option>
              <option value="Category 2">Category 2</option>
              <option value="Category 3">Category 3</option>
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
            <button className="apply-button" onClick={handleApply}> {/* Activate search on Apply */}
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
          {/* Dynamically Render Filtered Suppliers */}
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="search-result">
                <div className="supplier-info">
                  <img 
                    src="https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok=" 
                    alt="Supplier"
                  />
                  <div>
                    <h3>{supplier.name}</h3>
                    <p>{supplier.description}</p>
                    <p><strong>Category:</strong> {supplier.category}</p> 
                  </div>
                </div>
                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={supplier.isActive}
                      onChange={() => handleToggleSupplier(supplier.id)} 
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
    </div>
  );
};

export default AddSupplier;
