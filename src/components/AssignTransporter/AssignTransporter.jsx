import { useState } from "react";
import {
  EditOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Address from "../Dialog/Address";
import { DatePicker, Modal } from "antd";
import "./AssignTransporter.css";
import { calculatePrice } from "./TransportationServicesPrice";

function AssignTransporter({ onClose, onRequestSent }) {
  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [dialogState, setDialogState] = useState({
    address: false,
  });
  const [dateRange, setDateRange] = useState([]);
  const [company, setCompany] = useState("");
  const [currentForm, setCurrentForm] = useState(1);
  const { RangePicker } = DatePicker;
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);

  const handleRadioChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value) => {
    setDialogState((prev) => ({ ...prev, [dialogName]: value }));
  };

  const handleEditAddress = () => {
    toggleDialog("address", true);
  };

  const handleDialogClose = (newAddress) => {
    toggleDialog("address", false);
    if (newAddress) {
      setDepartureCity(newAddress); // Save new address
    }
  };

  const onDateChange = (dates) => {
    setDateRange(dates ? dates.map((date) => date.startOf("day")) : []);
  };

  const calculatedPrice = calculatePrice({ temperature, weight, distance });

  // View the dialog to confirm the price
  const showPriceConfirmation = () => {
    setIsPriceModalVisible(true);
  };

  // Close the dialog without moving to the next form
  const handleCancelPrice = () => {
    setIsPriceModalVisible(false); // Hide the dialog and return to editing
  };

  // Confirm the price and move to the next dialog
  const handleConfirmPrice = () => {
    setIsPriceModalVisible(false);
    setCurrentForm(2);
  };

  const handleNext = () => {
    let errors = [];
    if (!temperature) errors.push("Temperature Control");
    if (!weight) errors.push("Weight Category");
    if (!distance) errors.push("Distance Category");
    /*if (!departureCity) errors.push("Departure City");*/
    if (dateRange.length === 0) errors.push("Delivery Date Range");

    if (errors.length > 0) {
      Modal.error({
        title: "Error",
        content: `Please complete the following fields: ${errors.join(", ")}`,
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
      return;
    }
    showPriceConfirmation();
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
          okButtonProps: {
            className: "confirm-buttonn",
          },
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
              dateRange: dateRange.map((date) => date.format("YYYY-MM-DD")),
              company,
              price: calculatedPrice,
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
            okButtonProps: {
              className: "confirm-buttonn",
            },
          });
        }
      } catch (error) {
        Modal.error({
          title: "Error",
          content: "An error occurred while sending the request.",
          okButtonProps: {
            className: "confirm-buttonn",
          },
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
                  <div className="supplier-editAdress-detail">
                    <div className="supplier-editAddress-text">
                      {departureCity || "Enter the address"}
                    </div>
                    <div className="supplier-editAddress-button">
                      <button onClick={handleEditAddress}>
                        Edit <EditOutlined />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="category">
                  <strong>Delivery Date Range</strong>
                  <hr />
                  <RangePicker
                    value={dateRange}
                    onChange={onDateChange}
                    className="custom-range-picker"
                  />
                </div>
                <div className="button-container">
                  <button className="nextButtonStyle" onClick={handleNext}>
                    Next
                  </button>
                </div>
                {dialogState.address && (
                  <Address
                    onClose={() => handleDialogClose(false)}
                    onRequestSent={() => handleDialogClose(true)}
                  />
                )}
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
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <InfoCircleOutlined
              style={{ marginRight: "8px", color: "#f4d53f", fontSize: "23px" }}
            />{" "}
            Estimated Price
          </div>
        }
        visible={isPriceModalVisible}
        onCancel={handleCancelPrice}
        footer={[
          <div>
            <button
              key="cancel"
              onClick={handleCancelPrice}
              className="cancel-buttonn"
              style={{ marginRight: "5px" }}
            >
              Cancel
            </button>
            <button
              key="confirm"
              onClick={handleConfirmPrice}
              className="confirm-buttonn"
            >
              Confirm
            </button>
          </div>,
        ]}
      >
        <p style={{ marginBottom: "30px" }}>
          The estimated price based on your selections is:{" "}
          <strong>{calculatedPrice} SAR</strong>
        </p>
      </Modal>
    </div>
  );
}

export default AssignTransporter;
