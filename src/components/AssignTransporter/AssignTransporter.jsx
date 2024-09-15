import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
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
  const handleNext = () => {
    if (!temperature || !weight || !distance || !departureCity || dateRange.length === 0) {
      alert("Please complete all fields before proceeding.");
      return;
    }
    setCurrentForm(2);
  };
  const handleBack = () => {
    setCurrentForm(1);
  };
  const handleSendRequest = (event) => {
    event.preventDefault();
    if (!company) {
      alert("Please select the transport company.");
      return;
    }

    // منطق الإرسال هنا

    onRequestSent(); // Call the function to close the dialog
  };

  return (
    <div className="AssignTransporter">
      <div className="transporterDialog">
        <div className="transporterDialogContent">
          <form onSubmit={handleSendRequest}>
            {currentForm === 1 && (
              <>
                <h2>Select the transport service type</h2>
                <p>
                  <strong>Temperature Control</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="regular"
                      checked={temperature === "regular"}
                      onChange={handleRadioChange(setTemperature)}
                    />{" "}
                    Regular Delivery
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="refrigerated"
                      checked={temperature === "refrigerated"}
                      onChange={handleRadioChange(setTemperature)}
                    />{" "}
                    Refrigerated Delivery
                  </label>
                </p>
                <p>
                  <strong>Weight Category</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="light"
                      checked={weight === "light"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    3 to 7 tons
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="med"
                      checked={weight === "med"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    7 to 15 tons
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="heavy"
                      checked={weight === "heavy"}
                      onChange={handleRadioChange(setWeight)}
                    />{" "}
                    Over 15 tons
                  </label>
                </p>
                <p>
                  <strong>Distance Category</strong>
                  <hr />
                  <label>
                    <input
                      type="radio"
                      value="short"
                      checked={distance === "short"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Short Distance (100-400 km)
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="medium"
                      checked={distance === "medium"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Medium Distance (400-800 km)
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      value="long"
                      checked={distance === "long"}
                      onChange={handleRadioChange(setDistance)}
                    />{" "}
                    Long Distance (1000 km and Above)
                  </label>
                </p>
                <p>
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
                    <option value="Al Khobar">Al-Khobar</option>
                    <option value="Abha">Abha</option>
                  </select>
                  <br />
                </p>
                <p>
                  <strong>Delivery Date Range</strong>
                  <hr />
                  <DatePicker.RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                    className="custom-range-picker"
                  />
                </p>
                <div className="button-container">
                  <button className="nextButtonStyle" onClick={handleNext}>
                    Next
                  </button>
                </div>
                <div
                  className="closeButtonStyle"
                  onClick={onClose}
                >
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
                        value="express"
                        checked={company === "express"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      Aramex
                      <span className="price">350 SR </span>
                      <input
                        type="radio"
                        value="aramex"
                        checked={company === "aramex"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      Zajil
                      <span className="price">400 SR </span>
                      <input
                        type="radio"
                        value="zajil"
                        checked={company === "zajil"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <label>
                      DHL Express
                      <span className="price">570 SR </span>
                      <input
                        type="radio"
                        value="dhl"
                        checked={company === "dhl"}
                        onChange={handleRadioChange(setCompany)}
                      />
                    </label>
                    <hr />
                    <div className="button-container">
                      <button
                        className="backButtonStyle"
                        onClick={handleBack}
                      >
                        Back
                      </button>
                      <button className="sendButtonStyle" onClick={handleSendRequest}>
                        Send Request
                      </button>
                    </div>
                    <div
                      className="closeButtonStyle"
                      onClick={onClose}
                    >
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