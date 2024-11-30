import React, { useState } from "react";
import { Modal, Button, Rate, Input, Form } from "antd";
import { createFeedback } from "../../../../api/feedbackApi";
import { SmileOutlined } from "@ant-design/icons";

const FeedbackPopup = ({
  orderId,
  supplierId,
  manufacturerId,
  done,
  setDone,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRatingChange = (value) => setRating(value);
  const handleReviewChange = (e) => setReview(e.target.value);

  const handleSubmit = async () => {
    if (rating) {
      const feedbackData = {
        order_id: orderId,
        from_id: manufacturerId,
        to_id: supplierId,
        rating: rating,
        comment: review,
      };
      const res = await createFeedback(feedbackData);
      console.log(res);
      closeModal();
      setDone(true);
    }
  };

  return (
    <div>
      <Button
        className="give-feedback-button"
        type="primary"
        onClick={openModal}
      >
        Give Feedback
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
        centered
      >
        {done ? (
          <center>
            <br />
            <br />
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Your feedback was submitted
            </p>
            <br />
            <br />
            <br />
          </center>
        ) : (
          <center>
            <p style={{ textAlign: "center" }}>Give us a Feedback!</p>
            <p style={{ textAlign: "center" }}>
              Your input is important to us, We take your feedback very
              seriously!
            </p>

            <br />
            <br />
            <Form layout="vertical">
              <Form.Item>
                <Rate
                  style={{ fontSize: "30px" }}
                  onChange={handleRatingChange}
                />
              </Form.Item>

              <Form.Item label="Leave a review">
                <Input.TextArea
                  rows={4}
                  placeholder="Write your review here..."
                  onChange={handleReviewChange}
                  value={review}
                />
              </Form.Item>

              <Button
                type="primary"
                className="submit-feedback-button"
                onClick={handleSubmit}
                disabled={!rating} // Disable until stars are selected
              >
                Submit Feedback
              </Button>
            </Form>
          </center>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackPopup;
