import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import "./style.css";

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
    return (
        <Modal
            title={title}
            open={true}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Confirm"
            cancelText="Cancel"

            okButtonProps={{
                className: "confirm-button"
            }}
            cancelButtonProps={{
                className: "cancel-button"
            }}
        >
            <p>{message}</p>
        </Modal>
    );
};

export default ConfirmationDialog;
