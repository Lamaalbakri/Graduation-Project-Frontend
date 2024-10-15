import { useState } from 'react';
import './RawMaterial.css'; // Ensure you have this for styling
import { useNavigate } from 'react-router-dom';

const AddRawMaterials = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState('');
    const [storageInfo, setStorageInfo] = useState('');
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState(0.0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, quantity, description, storageInfo, image, price });
        setShowSuccessDialog(true);
    };

    const handleCloseDialog = () => {
        setShowSuccessDialog(false);
    };

    const handleViewPage = () => {
        navigate('/ViewRawMaterial');
        console.log('Navigating to view page...');
    };

    return (
        <>
            <div className='RequestsTable'>
                <div className="header-row">
                    <div className="title">Add Raw Materials</div>
                </div>

                <div className="container add-page">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Raw Materials Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Raw Materials Quantity</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Raw Materials Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Storage Information</label>
                            <input
                                type="text"
                                value={storageInfo}
                                onChange={(e) => setStorageInfo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
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

                {showSuccessDialog && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="close" onClick={handleCloseDialog}>&times;</span>
                            </div>
                            <h2>Confirm Addition of Material</h2>
                            <p className='pp'>Raw material added successfully!</p>
                            <p className='pp'>Click the button below to view it:</p>
                            <div className="button-container">
                                <button className='view-button' onClick={handleViewPage}>View Page</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddRawMaterials;


