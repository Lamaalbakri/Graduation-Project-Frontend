import React, { useEffect, useState } from "react";
import "./Feedback.css";
import FeedbackPopup from "./FeedbackPopup";
import { getFeedbackByUserId } from "../../../api/feedbackApi";

const Feedbacks = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const fetchedAddress = await getFeedbackByUserId();
        setFeedback(fetchedAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);
  return (
    <div className="ManageRawMaterial">
      <div className="ManageRawMaterial-header-row">
        <div className="ManageRawMaterial-title">Feedbacks</div>
        <div className="ManageRawMaterial-search-container">
          <div className="ManageRawMaterial-search-label">
            Search by Name / ID
          </div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            //value={query}
            //onChange={handleSearch}
            className="ManageRawMaterial-input-with-icon"
          />
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="feedbackContainer">
          {feedback.map((feed, i) => (
            <div className="each-feedback">
              <span
                style={{
                  fontSize: "20px",
                  color: "#878787",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {i + 1}
              </span>
              <div className="fText">
                <span>{feed?.from_id?.full_name}</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#878787",
                    fontWeight: "600",
                  }}
                >
                  ID: {feed?.order_id}
                </span>
              </div>
              <FeedbackPopup feed={feed} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
