import { useState, useEffect } from "react";
import "./DialogStyle.css";
import { Steps } from "antd";
import { CloseOutlined } from "@ant-design/icons";

function TrackingDialog({ onClose, currentStatus }) {

  const [status, setData] = useState(currentStatus);

  useEffect(() => {
    setData(currentStatus);
  }, [currentStatus]);

  const getCurrentStep = () => {
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "inProgress":
        return 2;
      case "delivered":
        return 3;
      case "rejected":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-content">
          <div className="close-button" onClick={onClose}>
            <CloseOutlined />
          </div>
          <div className="dialog-title">Track Request Status</div>
          {getCurrentStep() !== 4 ? (
            <Steps
              direction="vertical"
              current={getCurrentStep()} // Set the current step based on the status
              items={[
                {
                  title: "Pending",
                  description: "Waiting for supplier acceptance",
                },
                {
                  title: "Accepted",
                  description: "Waiting for transporter acceptance",
                },
                {
                  title: "In Progress",
                  description: "Transferring",
                },
                {
                  title: "Delivered",
                  description: "The request delivered",
                },
              ]}
            />
          ) : (
            <div>
              {" "}
              <p>
                No tracking information is available, the request has been
                rejected.
              </p>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackingDialog;
