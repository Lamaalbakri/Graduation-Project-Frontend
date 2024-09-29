import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
    return (
        <Modal
            title={title}
            open={true}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Confirm"
            cancelText="Cancel"
        >
            <p>{message}</p>
        </Modal>
    );
};

export default ConfirmationDialog;
