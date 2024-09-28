import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { Modal } from "antd";
import "./AssignTransporter.css"; // تأكد من الاستيراد الصحيح

function AssignTransporter({ onClose, onRequestSent }) {
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [company, setCompany] = useState("");
  const [currentForm, setCurrentForm] = useState(1);

  const handleRadioChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Handle validation when clicking "Next" in form 1
  const handleNext = () => {
    if (
      !temperature ||
      !weight ||
      !distance ||
      !departureCity ||
      dateRange.length === 0
    ) {
      Modal.error({
        title: "Error",
        content: "Please complete all fields before proceeding.",
      });
      return; // Stop here if fields are incomplete
    }
    setCurrentForm(2); // Move to form 2 if fields are complete
  };

  // Handle going back to form 1
  const handleBack = () => {
    setCurrentForm(1);
  };

  // Handle sending the request in form 2
  const handleSendRequest = async (event) => {
    event.preventDefault();

    // Ensure we are in the second form and the company field is selected
    if (currentForm === 2) {
      if (!company) {
        Modal.error({
          title: "Error",
          content: "Please select the transport company.",
        });
        return; // Stop here if no company is selected
      }

      try {
        // Send the request to the backend API
        const response = await fetch(
          "http://localhost:8500/api/v1/transportRequest",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              temperature,
              weight,
              distance,
              departureCity,
              dateRange, // Array of dates
              company,
            }),
          }
        );

        // Handle success and error cases
        if (response.ok) {
          onRequestSent(); // Call this function if the request is successful
        } else {
          Modal.error({
            title: "Error",
            content: "Failed to send request.",
          });
        }
      } catch (error) {
        Modal.error({
          title: "Error",
          content: "An error occurred while sending the request.",
        });
      }
    }
  };

  return (
    <div className="AssignTransporter">
      <div className="transporterDialog">
        <div className="transporterDialogContent">
          <form onSubmit={handleSendRequest}>
            {currentForm === 1 && (
              <>
                <h2>Select the transport service type</h2>
                <div className="category">
                  <strong>Temperature Control</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="Regular Delivery"
                      checked={temperature === "Regular Delivery"}
                      onChange={handleRadioChange(setTemperature)}
                    />{" "}
                    Regular Delivery
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="Refrigerated Delivery"
                      checked={temperature === "Refrigerated Delivery"}
                      onChange={handleRadioChange(setTemperature)}
                    />{" "}
                    Refrigerated Delivery
                  </label>
                </div>
                <div className="category">
                  <strong>Weight Category</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="3 to 7 tons"
                      checked={weight === "3 to 7 tons"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    3 to 7 tons
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="7 to 15 tons"
                      checked={weight === "7 to 15 tons"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    7 to 15 tons
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="Over 15 tons"
                      checked={weight === "Over 15 tons"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    Over 15 tons
                  </label>
                </div>
                <div className="category">
                  <strong>Distance Category</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="Short Distance (100-400 km)"
                      checked={distance === "Short Distance (100-400 km)"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Short Distance (100-400 km)
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="Medium Distance (400-800 km)"
                      checked={distance === "Medium Distance (400-800 km)"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Medium Distance (400-800 km)
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="Long Distance (1000 km and Above)"
                      checked={distance === "Long Distance (1000 km and Above)"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Long Distance (1000 km and Above)
                  </label>
                </div>
                <div className="category">
                  <strong>Departure City</strong>
                  <hr />
                  <select
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                  >
                    <option value="">Select city</option>
                    <option value="Jeddah">Jeddah</option>
                    <option value="Makkah">Makkah</option>
                    <option value="Taif">Taif</option>
                    <option value="Riyadh">Riyadh</option>
                    <option value="Al-Khobar">Al-Khobar</option>
                    <option value="Abha">Abha</option>
                  </select>
                  <br />
                </div>
                <div className="category">
                  <strong>Delivery Date Range</strong>
                  <hr />
                  <DatePicker.RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                    className="custom-range-picker"
                  />
                </div>
                <div className="button-container">
                  <button className="nextButtonStyle" onClick={handleNext}>
                    Next
                  </button>
                </div>
                <div className="closeButtonStyle" onClick={onClose}>
                  <CloseOutlined />
                </div>
              </>
            )}
            {currentForm === 2 && (
              <>
                <div className="companyDialog">
                  <div className="companyDialogContent">
                    <h2>Select the transport company</h2>
                    <label>
                      SMSA Express
                      <span className="price">500 SR</span>
                      <input
                        type="radio"
                        value="500 SR"
                        checked={company === "500 SR"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      Aramex
                      <span className="price">350 SR </span>
                      <input
                        type="radio"
                        value="350 SR"
                        checked={company === "350 SR"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      Zajil
                      <span className="price">400 SR </span>
                      <input
                        type="radio"
                        value="400 SR"
                        checked={company === "400 SR"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      DHL Express
                      <span className="price">570 SR </span>
                      <input
                        type="radio"
                        value="570 SR"
                        checked={company === "570 SR"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <div className="button-container">
                      <button className="backButtonStyle" onClick={handleBack}>
                        Back
                      </button>
                      <button
                        className="sendButtonStyle"
                        onClick={handleSendRequest}
                      >
                        Send Request
                      </button>
                    </div>
                    <div className="closeButtonStyle" onClick={onClose}>
                      <CloseOutlined />
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssignTransporter;
