import React from 'react';
import { CloseOutlined } from "@ant-design/icons";
import "./DialogStyle.css";

function MessageDialog({ onClose }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-content">
          <div className="close-button" onClick={onClose}>
            <CloseOutlined />
          </div>
          <div className='dialog-title'>
            Request&apos;s Updates
          </div>
          <p>This is a simple dialog box.</p>
        </div>
      </div>
    </div>
  );
}

export default MessageDialog;
