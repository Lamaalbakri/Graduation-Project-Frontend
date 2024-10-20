import React, { useState } from "react";
import { Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import "./DialogStyle.css";

const ConfirmationDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  stepType,
}) => {
  return (
    <Modal
      title={
        <>
          {stepType === "viewOrder" && ( // Show checkmark only for viewOrder
            <CheckCircleOutlined
              style={{
                color: "green",
                marginRight: 8,
                fontSize: "35px",
                position: "relative",
                top: "6px",
              }}
            />
          )}
          {title}
        </>
      }
      open={true}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={stepType === "viewOrder" ? "Ok" : "Confirm"}
      cancelText="Cancel"
      okButtonProps={{
        className: "confirm-button",
      }}
      cancelButtonProps={{
        className: "cancel-button",
      }}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmationDialog;
