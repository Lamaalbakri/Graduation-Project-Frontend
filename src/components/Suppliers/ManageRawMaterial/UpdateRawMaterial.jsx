import React, { useState, useEffect } from 'react';
import dummyRawMaterials from './dummyData2'; // Adjust the path as necessary
import './RawMaterial.css'; // Import your CSS file

const UpdateRawMaterialsView = () => {
    const [rawMaterials] = useState(dummyRawMaterials);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [query, setQuery] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [materialToUpdate, setMaterialToUpdate] = useState(null);

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setQuery(searchQuery);

        if (searchQuery) {
            const searchTerms = searchQuery.split(',').map((term) => term.trim());
            const filtered = rawMaterials.filter((material) =>
                searchTerms.some((term) =>
                    material.id.toString() === term || material.name.toLowerCase().includes(term)
                )
            );
            setFilteredMaterials(filtered);
        } else {
            setFilteredMaterials([]);
        }
    };

    const handleSave = (updatedMaterial) => {
        console.log('Updated material:', updatedMaterial);
        setFilteredMaterials([]);
        setQuery('');
        setIsConfirmModalOpen(false);
    };

    const handleConfirmSave = (updatedMaterial) => {
        handleSave(updatedMaterial);
        setMaterialToUpdate(null);
    };

    return (
        <>
            <div className="RequestsTable">
                <div className="header-row">
                    <div className="title">Update Raw Materials</div>
                    <div className="search-container">
                        <label className="search-label">Search by Name / ID</label>
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
                <div className={`search-instruction ${query ? '' : 'visible'}`}>
                    <p>Search for the item you want to Update</p>
                </div>

                {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material) => (
                        <UpdateForm
                            key={material.id}
                            material={material}
                            onSave={(material) => {
                                setMaterialToUpdate(material);
                                setIsConfirmModalOpen(true);
                            }}
                            onClose={() => setFilteredMaterials([])}
                        />
                    ))
                ) : (
                    query && <p>No materials found for "{query}". Please try again.</p>
                )}

                {isConfirmModalOpen && (
                    <UpdateConfirmationModal
                        material={materialToUpdate}
                        onConfirm={handleConfirmSave}
                        onClose={() => setIsConfirmModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

const UpdateForm = ({ material, onSave, onClose }) => {
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

    useEffect(() => {
        setName(material.name);
        setDescription(material.description);
        setQuantity(material.quantity);
        setImage(material.image);
        setPrice(material.price);
    }, [material]);

    return (
        <div className="add-page">
            <div className="form-container">
                <h2>#{material.id} Update Material</h2>
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
                            <button
                                type="button"
                                className="custom-file-upload"
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                Choose File
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                id="file-input"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// UpdateConfirmationModal Component
const UpdateConfirmationModal = ({ material, onConfirm, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <h2>Confirm Update</h2>
                <p>Are you sure you want to save changes for "{material.name}" (ID: #{material.id})?</p>
                <br />
                <div className="button-container">
                    <button className="edit-button" onClick={onClose}>Cancel</button>
                    <button className="edit-button" onClick={onConfirm}>save changes</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateRawMaterialsView;