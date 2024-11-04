import React, { useState, useEffect } from 'react';
import './RawMaterial.css';
import Loader from '../../../Utils/Loader';
import { notification } from "antd";
import { getMaterial, updateMaterial, uploadImage } from '../../../api/manageRawMaterialApi';

const UpdateRawMaterial = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [query, setQuery] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [materialToUpdate, setMaterialToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await getMaterial();
        setRawMaterials(response.data.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
        notification.error({
          message: "Error fetching materials",
          description: "Please try again later.",
          placement: "top",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);
  

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = rawMaterials.filter((material) =>
        material.name.toLowerCase().includes(value.toLowerCase()) ||
        (material.shortId !== undefined && material.shortId.toString().includes(value))
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials([]); // Clear results if query is empty
    }
  };

  const handleSave = async (updatedMaterial) => {
    setLoading(true);
    try {
      const response = await updateMaterial(updatedMaterial);
      if (response.data.success) {
        notification.success({
          message: "Update Successful!",
          description: "Material has been updated",
          placement: "top",
        });
      } else {
        console.log("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to update account:", error);
    }

    setLoading(false);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmSave = (updatedMaterial) => {
    handleSave(updatedMaterial);
    setMaterialToUpdate(null);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="RequestsTable">
        <div className="header-row">
          <div className="title">Update Raw Materials</div>
          <div className="search-container">
            <label className="search-label">Search by Name / ID</label>
            <input
              type="search"
              placeholder="Search by Name / ID"
              value={query}
              onChange={handleSearchChange}
              className="input-with-icon"
            />
          </div>
        </div>
      </div>

      <div className="container">
      <div className={`search-instruction ${query ? 'hidden' : 'visible'}`}>
          <p>Search for the item you want to Update</p>
        </div>

        {query && filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <UpdateForm
            //need to give key _id.mongodb has _id as default.
              key={material._id}
              material={material}
              onSave={(material) => {
                if (material) {
                  setMaterialToUpdate(material);
                  setIsConfirmModalOpen(true);
                }
              }}
              onClose={() => setFilteredMaterials([])}
            />
          ))
        ) : (
          query && <p>No materials found for your search.</p>
        )}

        {isConfirmModalOpen && materialToUpdate && (
          <UpdateConfirmationModal
            material={materialToUpdate}
            onConfirm={() => handleConfirmSave(materialToUpdate)}
            onClose={() => setIsConfirmModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};




const UpdateForm = ({ material, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [price, setPrice] = useState(0);
  const [materialOption, setMaterialOption] = useState([]);
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState('');
  const [currentMenuValues, setCurrentMenuValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  useEffect(() => {
    if (material) {
      setName(material.name);
      setDescription(material.description);
      setQuantity(material.quantity);
      setPrice(material.price);
      setPreviewImage(material.image);
      setMaterialOption(material.materialOption || []);
      setUnits(material.units || []);
      setCurrentMenuValues(material.materialOption ? material.materialOption.map(() => '') : []);
    }
  }, [material]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type) || file.size > MAX_FILE_SIZE) {
        notification.error({
          message: file.size > MAX_FILE_SIZE ? 'File Size Exceeded' : 'Invalid File Type',
          description: 'Only JPEG, JPG, and PNG under 1 MB are allowed.',
          placement: 'top',
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuValue = (index) => {
    const updatedOptions = [...materialOption];
    if (currentMenuValues[index] && !updatedOptions[index].menuList.includes(currentMenuValues[index])) {
      updatedOptions[index].menuList.push(currentMenuValues[index]);
      const updatedMenuValues = [...currentMenuValues];
      updatedMenuValues[index] = '';
      setCurrentMenuValues(updatedMenuValues);
      setMaterialOption(updatedOptions);
    }
  };

  const handleDeleteMenuValue = (optionIndex, valueIndex) => {
    const updatedOptions = [...materialOption];
    updatedOptions[optionIndex].menuList.splice(valueIndex, 1);
    setMaterialOption(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...materialOption];
    updatedOptions[index].optionName = value;
    setMaterialOption(updatedOptions);
  };

  const handleAddUnit = () => {
    if (currentUnit && !units.includes(currentUnit)) {
      setUnits((prevUnits) => [...prevUnits, currentUnit]);
      setCurrentUnit('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = previewImage;
      if (image) {
        const response = await uploadImage(image);
        if (response.data.success) imageUrl = response.data.data.secure_url;
      }
      const updatedMaterial = {
        ...material,
        name,
        description,
        quantity,
        price,
        image: imageUrl,
        materialOption,
        units,
      };
      onSave(updatedMaterial);
    } catch (error) {
      notification.error({
        message: 'Error updating material',
        description: 'Please try again later.',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = (index) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    setUnits(updatedUnits);
  };
  

  return (
    <>
      {loading && <Loader />}
      <div className="add-page">
        <div className="form-container">
          <h2>#{material.id} Update Material</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="0" />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required min="0" step="0.01" />
            </div>

            {materialOption.map((option, index) => (
              <div key={index} className="form-group">
                <label>Material Option {index + 1}:</label>
                <input
                  type="text"
                  value={option.optionName}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="e.g., Color"
                  required
                />
                <input
                  type="text"
                  value={currentMenuValues[index]}
                  onChange={(e) => {
                    const updatedValues = [...currentMenuValues];
                    updatedValues[index] = e.target.value;
                    setCurrentMenuValues(updatedValues);
                  }}
                  placeholder={`Add value for ${option.optionName}`}
                />
                <button className='material-edit-button' type="button" onClick={() => handleAddMenuValue(index)}>Add Value</button>
                <ul>
                  {option.menuList.map((value, valIndex) => (
                    <li key={valIndex}>
                      {value}
                      <button
                        type="button"
                        onClick={() => handleDeleteMenuValue(index, valIndex)}
                        style={{ marginLeft: '8px', color: 'red', cursor: 'pointer' }}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

<div className="form-group">
  <label>Units</label>
  <input 
    type="text" 
    value={currentUnit} 
    onChange={(e) => setCurrentUnit(e.target.value)} 
    placeholder="Add Unit" 
  />
  <button 
    className='material-edit-button' 
    type="button" 
    onClick={handleAddUnit}
  >
    Add Unit
  </button>
  <ul>
    {units.map((unit, index) => (
      <li key={index}>
        {unit}
        <button
          type="button"
          onClick={() => handleDeleteUnit(index)}
          style={{ marginLeft: '8px', color: 'red', cursor: 'pointer' }}
        >
          &times;
        </button>
      </li>
    ))}
  </ul>
</div>
            <div className="form-group">
              <label>Image</label>
              <div className="image-upload-container">
                {previewImage && <img src={previewImage} alt="Preview" className="material-image" />}
                <button className="submit-button" type="button" onClick={() => document.getElementById('file-input').click()}>Choose File</button>
                <input type="file" id="file-input" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};





const UpdateConfirmationModal = ({ material, onConfirm, onClose }) => {
  if (!material) return null;
  console.log(material);
  

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <h2>Confirm Update</h2>
        <p>Are you sure you want to save changes for "{material.name}"?</p>
        <br />
        <div className="button-container">
          <button className="edit-button" onClick={onClose}>Cancel</button>
          <button className="edit-button" onClick={() => onConfirm(material)}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRawMaterial;