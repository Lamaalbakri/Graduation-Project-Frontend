import React, { useState } from 'react';
import { Modal, Button, Rate, Input, Form } from 'antd';

const FeedbackPopup = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleRatingChange = (value) => setRating(value);
    const handleReviewChange = (e) => setReview(e.target.value);

    const handleSubmit = () => {
        if (rating) {
            console.log("Submitted Feedback:", { rating, review });
            closeModal();
        }
    };

    return (
        <div>
            <Button type="primary" onClick={openModal}>Give Feedback</Button>

            <Modal
                title="Feedback"
                visible={isModalOpen}
                onCancel={closeModal}
                footer={null}  // Removing default footer buttons
            >
                <center>
                    <p style={{ textAlign: 'center' }}>Give us a Feedback!</p>
                    <p style={{ textAlign: 'center' }}>Your input is important to us, We take your feedback very seriously!</p>

<br/>
<br/>
                    <Form layout="vertical">
                        <Form.Item>
                            <Rate  style={{fontSize:"30px"}} onChange={handleRatingChange} />
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
                            style={{color:"white"}}
                            onClick={handleSubmit}
                            disabled={!rating}  // Disable until stars are selected
                        >
                            Submit Feedback
                        </Button>
                    </Form>
                </center >
            </Modal>
        </div>
    );
};

export default FeedbackPopup;
