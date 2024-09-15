import React from 'react'
import "./style.css";

function MoreOptionsDialog({ onClose }) {
    return (
      <div className="dialog-overlay">
        <div className="dialog-box">
          <div className="dialog-header">
            <h2>Message</h2>
          </div>
          <div className="dialog-content">
            <p>This is a simple dialog box.</p>
          </div>
          <div className="dialog-actions">
            <button className="close-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
}

export default MoreOptionsDialog
