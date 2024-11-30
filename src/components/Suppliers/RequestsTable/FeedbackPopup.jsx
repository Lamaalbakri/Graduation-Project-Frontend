import React, { useState } from "react";
import { Modal, Button, Rate, Form } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const FeedbackPopup = ({ feed }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button className="fIcon" onClick={openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-message-square-quote"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 12a2 2 0 0 0 2-2V8H8" />
          <path d="M14 12a2 2 0 0 0 2-2V8h-2" />
        </svg>
      </Button>

      <Modal
        title={
          <span
            style={{ fontSize: "20px", fontWeight: "bold", color: "#1c2229" }}
          >
            <SmileOutlined
              style={{ fontSize: "25px", marginRight: "8px", color: "#f4d53f" }}
            />
            Feedback
          </span>
        }
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <center>
          <p
            className="fText"
            style={{ textAlign: "center", fontSize: "24px" }}
          >
            {feed?.from_id?.full_name}
          </p>
          <span
            style={{ fontSize: "14px", color: "#878787", fontWeight: "600" }}
          >
            ID: #{feed?.order_id}
          </span>
          <p className="rating">{feed?.rating}/5</p>
          <Form layout="vertical">
            <Form.Item>
              <Rate
                style={{ fontSize: "30px" }}
                disabled
                defaultValue={feed?.rating}
              />
            </Form.Item>

            <div className="review">
              <span>{feed?.comment}</span>
            </div>
          </Form>
        </center>
      </Modal>
    </div>
  );
};

export default FeedbackPopup;
