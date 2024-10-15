import { useState } from 'react';
import dummyRawMaterials from './dummyData2'; // Adjust the path as necessary
import './RawMaterial.css'; // Import your CSS file

const DeleteRawMaterialsView = () => {
    const [rawMaterials, setRawMaterials] = useState(dummyRawMaterials);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);

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
            setFilteredMaterials([]);
        }
    };

    const handleDelete = (material) => {
        setCurrentMaterial(material);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        const updatedMaterials = rawMaterials.filter(material => material.id !== currentMaterial.id);
        setRawMaterials(updatedMaterials);
        setFilteredMaterials(updatedMaterials);
        setIsModalOpen(false);
        setCurrentMaterial(null);
    };

    return (
        <>
            <div className="RequestsTable">
                <div className="header-row">
                    <div className="title">Delete Raw Materials</div>
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
                <div className={`search-instruction ${query ? '' : 'visible'}`}>
                    <p>Search for the item you want to delete</p>
                </div>
                <div className="materials-list">
                    {filteredMaterials.length > 0 ? (
                        filteredMaterials.map((material) => (
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
                                    <div className="button-container"> {/* Aligns button to the right */}
                                        <button className="delete-button" onClick={() => handleDelete(material)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        query && <p>No materials found for "{query}"</p>
                    )}
                </div>

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
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete "{material.name}" (ID: #{material.id})?</p>
                <div className="button-container">
                    <button className="edit-button" onClick={onClose}>Cancel</button>
                    <button className="edit-button" onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRawMaterialsView;