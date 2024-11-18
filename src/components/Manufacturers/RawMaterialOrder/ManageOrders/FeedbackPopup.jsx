import React, { useState } from "react"; // Import React and useState hook from React library
import { Modal, Button, Rate, Input, Form } from "antd"; // Import UI components from Ant Design library
import { createFeedback } from "../../../../api/feedbackApi"; // Import createFeedback API function

// Define FeedbackPopup component, receiving orderId, supplierId, and manufacturerId as props
const FeedbackPopup = ({ orderId, supplierId, manufacturerId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [rating, setRating] = useState(null); // State to store user's rating
  const [review, setReview] = useState(""); // State to store user's review

  // Function to open the modal
  const openModal = () => setIsModalOpen(true);
  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle changes in rating input
  const handleRatingChange = (value) => setRating(value);
  // Function to handle changes in review input
  const handleReviewChange = (e) => setReview(e.target.value);

  // Function to submit feedback data
  const handleSubmit = async () => {
    if (rating) { // Check if rating is provided
      const feedbackData = {
        order_id: orderId, // Set order ID
        from_id: manufacturerId, // Set manufacturer ID as the sender
        to_id: supplierId, // Set supplier ID as the recipient
        rating: rating, // Add rating
        comment: review, // Add review comment
      };
      const res = await createFeedback(feedbackData); // Send feedback data to API
      console.log(res); // Log API response
      closeModal(); // Close modal after submission
    }
  };

  // Render the component
  return (
    <div>
      <Button type="primary" onClick={openModal}> {/* Button to open feedback modal */}
        Give Feedback
      </Button>

      <Modal
        title="Feedback" // Modal title
        visible={isModalOpen} // Control modal visibility
        onCancel={closeModal} // Close modal on cancel
        footer={null} // Remove default footer buttons
      >
        <center>
          <p style={{ textAlign: "center" }}>Give us a Feedback!</p> {/* Feedback prompt */}
          <p style={{ textAlign: "center" }}>
            Your input is important to us, We take your feedback very seriously!
          </p>

          <br />
          <br />
          <Form layout="vertical"> {/* Form layout */}
            <Form.Item> {/* Form item for star rating */}
              <Rate
                style={{ fontSize: "30px" }} // Set star size
                onChange={handleRatingChange} // Update rating on change
              />
            </Form.Item>

            <Form.Item label="Leave a review"> {/* Form item for review input */}
              <Input.TextArea
                rows={4} // Set input area size
                placeholder="Write your review here..." // Placeholder text
                onChange={handleReviewChange} // Update review on change
                value={review} // Set review value
              />
            </Form.Item>

            <Button
              type="primary"
              style={{ color: "white" }} // Style button
              onClick={handleSubmit} // Submit feedback on click
              disabled={!rating} // Disable until rating is selected
            >
              Submit Feedback
            </Button>
          </Form>
        </center>
      </Modal>
    </div>
  );
};

export default FeedbackPopup; // Export FeedbackPopup component
