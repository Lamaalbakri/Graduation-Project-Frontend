import React, { useState } from 'react';
import './styling.css';
import suppliersData from './dummyData'; // Adjust the import path as necessary

const AddSupplier = () => {
  const [supplierCategory, setSupplierCategory] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [suppliers, setSuppliers] = useState(suppliersData); // Initialize state with imported data

  const handleSupplierCategoryChange = (e) => {
    setSupplierCategory(e.target.value);
  };

  const handleSupplierNameChange = (e) => {
    setSupplierName(e.target.value);
    setIsSearchActive(e.target.value.trim() !== '' || supplierCategory.trim() !== ''); // Activate search when there is input or category selection
  };

  const handleClear = () => {
    setSupplierCategory('');
    setSupplierName('');
    setIsSearchActive(false); // Reset search activation on clear
  };

  // Filter suppliers based on search input and category selection
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesCategory = supplierCategory ? supplier.category === supplierCategory : true;
    const matchesSearch = supplierName ? (
      supplier.name.toLowerCase().includes(supplierName.toLowerCase()) ||
      supplier.id.toString().includes(supplierName)
    ) : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="Suppliercontainer">
      <div className="header-row">
        <h2 className="title">Search for Supplier to Add</h2>
      </div>

      {/* Search Section */}
      <div className="card-container">
        <div className="search-container">
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
            <button className="apply-button">Apply</button>
          </div>
        </div>
      </div>

      {/* List View Section */}
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
                    <p><strong>Category:</strong> {supplier.category}</p> {/* Display supplier category */}
                  </div>
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
