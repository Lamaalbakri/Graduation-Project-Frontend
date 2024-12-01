import React, { useState } from "react";
import { Modal, Button, Rate, Input, Form } from "antd";
import { createFeedback } from "../../../../api/feedbackApi";

const FeedbackPopup = ({
  orderId,
  distributorId,
  retailerId,
  done,
  setDone,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRatingChange = (value) => setRating(value);
  const handleReviewChange = (e) => setReview(e.target.value);

  const handleSubmit = async () => {
    if (rating) {
      const feedbackData = {
        order_id: orderId,
        from_id: retailerId,
        to_id: distributorId,
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
      <Button type="primary" onClick={openModal}>
        Give Feedback
      </Button>

      <Modal
        title="Feedback"
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
                fontSize: "24px",
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
                style={{ color: "white" }}
                onClick={handleSubmit}
                disabled={!rating || !review} // Disable until stars are selected
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
