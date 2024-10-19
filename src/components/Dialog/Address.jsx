import React from 'react'
import './DialogStyle.css';
import { CloseOutlined } from "@ant-design/icons";

function Address({ onClose }) {
    return (
        <div className="dialog-overlay">
            <div className="dialog-box-address">
                <div className="dialog-content">
                    <div className="close-button" onClick={onClose}>
                        <CloseOutlined />
                    </div>
                    <div className='dialog-title'>
                        Add New Address
                    </div>
                    <form className='form-container'>
                        <div class="form-group">
                            <label for="city"><span className='required'>*</span>City</label>
                            <input type="text" id="city" name="city" placeholder="Enter city" required />
                        </div>
                        <div class="form-group">
                            <label for="street"><span className='required'>*</span>Street</label>
                            <input type="text" id="street" name="street" placeholder="Enter street" required />
                        </div>
                        <div class="form-group">
                            <label for="district"><span className='required'>*</span>District</label>
                            <input type="text" id="district" name="district" placeholder="Enter district" required />
                        </div>
                        <div class="form-group">
                            <label for="postalCode">Postal Code (Optional)</label>
                            <input type="text" id="postalCode" name="postalCode" placeholder="Enter postal code" />
                        </div>
                        <div className='button-container'>
                            <button className='cancel-button' onClick={onClose}>Cancel</button>
                            <button className='save-button'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Address