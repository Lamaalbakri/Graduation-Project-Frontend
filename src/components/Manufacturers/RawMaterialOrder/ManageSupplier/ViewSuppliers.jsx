import React, { useEffect, useState } from 'react';
import './styling.css';
import { fetchUserData,fetchUserDataWithSupplier, updateUserData } from "../../../../api/userAPI";

const ViewSuppliers = () => {
  const [user, setUser] = useState()
  useEffect(() => {
    fetchUserData().then(x => {
      setUser(x)
    })
  }, [])

  useEffect(() => {
    fetchUserDataWithSupplier().then(x => {
      console.log("user: ", x)
      setSuppliers(x.suppliersList)
    })
  }, [])


  const [suppliers, setSuppliers] = useState();

  const handleToggleSupplier = (id) => {

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
  };


  return (
    <div className="Suppliercontainer">
      <div className="header-row">
        <h2 className="title">List of Added Suppliers</h2>
      </div>
      {suppliers?.length > 0 ? (
        suppliers?.map((supplier) => (
          <div key={supplier._id} className="search-result">
            <div className="supplier-info">
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
    </div>
  );
};

export default ViewSuppliers;
