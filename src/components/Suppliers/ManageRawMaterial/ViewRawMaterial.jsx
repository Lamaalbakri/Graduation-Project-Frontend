import React, { useState } from 'react';
import dummyRawMaterials from './dummyData2'; // Adjust the path as necessary
import './RawMaterial.css'; // Import your CSS file

const RawMaterialsView = () => {
    const [rawMaterials, setRawMaterials] = useState(dummyRawMaterials);
    const [filteredMaterials, setFilteredMaterials] = useState(dummyRawMaterials);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setQuery(searchQuery);

        if (searchQuery) {
            const searchTerms = searchQuery.split(',').map(term => term.trim());
            const filtered = rawMaterials.filter(material =>
                searchTerms.some(term =>
                    material.id.toString() === term || material.name.toLowerCase().includes(term)
                )
            );
            setFilteredMaterials(filtered);
        } else {
            setFilteredMaterials(rawMaterials);
        }
    };

    const handleDelete = (material) => {
        setCurrentMaterial(material);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        const updatedMaterials = rawMaterials.filter(material => material.id !== currentMaterial.id);
        setRawMaterials(updatedMaterials);
        setFilteredMaterials(updatedMaterials);
        setIsDeleteModalOpen(false);
        setCurrentMaterial(null);
    };

    const handleUpdate = (material) => {
        setCurrentMaterial(material);
        setIsUpdateModalOpen(true);
    };

    const handleSave = (updatedMaterial) => {
        const updatedMaterials = rawMaterials.map(material =>
            material.id === updatedMaterial.id ? updatedMaterial : material
        );
        setRawMaterials(updatedMaterials);
        setFilteredMaterials(updatedMaterials);
        setIsUpdateModalOpen(false);
        setCurrentMaterial(null);
    };

    return (
        <>
            <div className="RequestsTable">
                <div className="header-row">
                    <div className="title">View Raw Materials</div>
                    <div className="search-container">
                        <label className='search-label'>Search by Name / ID</label>
                        <input
                            type="search"
                            placeholder="Search by Name / ID"
                            value={query}
                            onChange={handleSearch}
                            className="input-with-icon"
                        />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="materials-list">
                    {filteredMaterials.map((material) => (
                        <div key={material.id} className="material-card">
                            <div className="image-section">
                                <img src={material.image} alt={material.name} className="material-image" />
                            </div>
                            <div className="info-section">
                                <h3>
                                    <span className="material-id">#{material.id}</span> {material.name}
                                </h3>
                                <p>Quantity: {material.quantity}</p>
                                <p>Price: ${material.price.toFixed(2)}</p>
                                <p>{material.description}</p>
                                <div className="button-container">
                                    <button className="delete-button" onClick={() => handleDelete(material)}>Delete</button>
                                    <button className="edit-button" onClick={() => handleUpdate(material)}>Update</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isUpdateModalOpen && (
                    <UpdateModal
                        material={currentMaterial}
                        onSave={handleSave}
                        onClose={() => setIsUpdateModalOpen(false)}
                    />
                )}

                {isDeleteModalOpen && (
                    <DeleteModal
                        material={currentMaterial}
                        onConfirm={confirmDelete}
                        onClose={() => setIsDeleteModalOpen(false)}
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
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete "{material.name}" (ID: #{material.id})?</p>
                <br />
                <div className="button-container">
                    <button className="edit-button" onClick={onClose}>Cancel</button>
                    <button className="edit-button" onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

// UpdateModal Component
const UpdateModal = ({ material, onSave, onClose }) => {
    const [name, setName] = useState(material.name);
    const [description, setDescription] = useState(material.description);
    const [quantity, setQuantity] = useState(material.quantity);
    const [image, setImage] = useState(material.image);
    const [price, setPrice] = useState(material.price);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...material, name, description, quantity, image, price });
    };

    return (
        <div className="modal add-page">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <h2>Update Material</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="form-group">
                        <label><strong>Add Image</strong></label>
                        <div className="image-upload-container">
                            {image && <img src={image} alt="Preview" className="material-image" />}
                            <input
                                type="file"
                                accept="image/*"
                                id="file-input"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <div className="button-container">
                                <button
                                    type="button"
                                    className="custom-file-upload"
                                    onClick={() => document.getElementById('file-input').click()}
                                >
                                    Choose File
                                </button>
                                <button type="submit" className="submit-button">Save</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RawMaterialsView;