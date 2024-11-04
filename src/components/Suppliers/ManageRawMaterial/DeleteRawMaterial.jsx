import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RawMaterial.css";
import Loader from '../../../Utils/Loader';
import { notification } from "antd";
import { deleteMaterial, getMaterial } from "../../../api/manageRawMaterialApi";

const DeleteRawMaterial = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await getMaterial();
        setRawMaterials(response.data.data);
        setFilteredMaterials(response.data.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
        notification.error({
          message: "Error fetching materials",
          description: "Please try again later.",
          placement: "top",
        });
      }
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = rawMaterials.filter(
        (material) =>
          material.name.toLowerCase().includes(value.toLowerCase()) ||
          (material.shortId !== undefined &&
            material.shortId.toString().includes(value))
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(rawMaterials);
    }
  };

  const handleDelete = (material) => {
    setCurrentMaterial(material);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteMaterial(currentMaterial);
      if (response.data.success) {
        notification.success({
          message: "Successfully deleted ",
          description: "Material has been Dleted",
          placement: "top",
        });
        setFilteredMaterials((prevMaterials) =>
          prevMaterials.filter(
            (material) => material.shortId !== currentMaterial
          )
        );
      } else {   
        notification.error({
          message: "Error deleting material",
          description: "Failed to delete material. Please try again later.",
          placement: "top",
        });
      }
    } catch (error) {

      console.error("Error deleting material:", error);
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="RequestsTable">
        <div className="header-row">
          <div className="title">Delete Raw Materials</div>
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
        <div className={`search-instruction ${query ? "hidden" : "visible"}`}>
          <p>Search for the item you want to Delete</p>
        </div>
        {query && (
          <div className="materials-list">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <div key={material._id} className="material-card">
                  <div className="image-section">
                    <img
                      src={material.image}
                      alt={material.name}
                      className="material-image"
                    />
                  </div>
                  <div className="info-section">
                    <h3>
                      <span className="material-id">#{material.Id}</span>{" "}
                      {material.name}
                    </h3>
                    <p>Quantity: {material.quantity}</p>
                    <p>Price: ${material.price.toFixed(2)}</p>
                    <p>{material.description}</p>
                    <div className="button-container">
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(material.shortId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No materials found for your search.</p>
            )}
          </div>
        )}

        {isModalOpen && (
          <DeleteModal
            material={currentMaterial}
            onConfirm={confirmDelete}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

// DeleteModal Component
const DeleteModal = ({ material, onConfirm, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete "{material}"?</p>
        <div className="button-container">
          <button className="edit-button" onClick={onClose}>
            Cancel
          </button>
          <button className="edit-button" onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRawMaterial;
