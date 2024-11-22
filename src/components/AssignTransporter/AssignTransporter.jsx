import { useState, useEffect } from "react";
import { EditOutlined, CloseOutlined, } from "@ant-design/icons";
import Address from "../Dialog/Address";
import { DatePicker, Modal, Radio } from "antd";
import "./AssignTransporter.css";
import { calculatePrice } from "./TransportationServicesPrice";
import { fetchCompanies, sendTransportRequest, } from "../../api/transportRequestsAPI";
import { useAddress } from "../../contexts/AddressContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { config } from "../../../config";
function AssignTransporter({
  onClose,
  onRequestSent,
  requestId,
  arrivalAddress,
  receiverId,
  receiverType,
}) {

  const [temperature, setTemperature] = useState("");
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [dialogState, setDialogState] = useState({ address: false, });
  const [dateRange, setDateRange] = useState([]);
  const [company, setCompany] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [currentForm, setCurrentForm] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { RangePicker } = DatePicker;
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const clientId = config.clientId;
  const { address } = useAddress();
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

  const handleDialogClose = () => {
    toggleDialog("address", false);
  };

  const onDateChange = (dates) => {
    setDateRange(dates ? dates.map((date) => date.startOf("day")) : []);
  };

  const calculatedPrice = calculatePrice({ temperature, weight, distance });

  // View the price dialog
  const showPriceConfirmation = () => {
    setIsPriceModalVisible(true);
  };

  // Close the dialog without moving to the next form
  const handleCancelPrice = () => {
    setIsPriceModalVisible(false); // Hide the dialog and return to editing
  };

  const handlePayment = () => {
    const responce = companyList.find((comp) => comp._id === company);
    if (!responce) {
      Modal.error({
        title: "Error",
        content: "Please select the transport company.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
      return; // Stop here if no company is selected
    }
    setSelectedCompany(responce);
    showPriceConfirmation();
  }

  const handleNext = () => {
    let errors = [];
    if (!temperature) errors.push("Temperature Control");
    if (!weight) errors.push("Weight Category");
    if (!distance) errors.push("Distance Category");
    if (!address) errors.push("Departure Address");
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
    setCurrentForm(2);
  };

  // Fetch company list
  useEffect(() => {
    const fetchCompaniesList = async () => {
      try {
        const data = await fetchCompanies();
        setCompanyList(data);
      } catch (error) {
        Modal.error({
          title: "Error",
          content: "Failed to fetch companies list.",
          okButtonProps: {
            className: "confirm-buttonn",
          },
        });
      }
    };

    // Only fetch companies list when in form 2
    if (currentForm === 2) fetchCompaniesList();
  }, [currentForm]);

  // Handle sending the request in form 2
  const handleSendRequest = async (event) => {

    try {
      const requestData = {
        temperature,
        weight,
        distance,
        departureAddress: {
          street: address.street,
          city: address.city,
          neighborhood: address.neighborhood,
          postal_code: address.postal_code,
          country: address.country,
        },
        estimated_delivery_date: dateRange.map((date) =>
          date.format("YYYY-MM-DD")
        ),
        totalPrice: calculatedPrice,
        transporterId: selectedCompany._id,
        transporterName: selectedCompany.full_name,
        request_id: requestId,
        arrivalAddress: arrivalAddress,
        receiver_id: receiverId,
        receiver_type: receiverType,
      };

      console.log("Request Data:", requestData);
      await sendTransportRequest(requestData);
      console.log("Request sent successfully.");
      setIsPriceModalVisible(false);
      onRequestSent();
    } catch (error) {
      console.error("Error details:", error); // Print the error details
      Modal.error({
        title: "Error",
        content: "Failed to send request.",
        okButtonProps: {
          className: "confirm-buttonn",
        },
      });
    }

  };
  const handleFormSubmit = (event) => {
    event.preventDefault();

  };

  const formatPrice = (price) => {
    if (price && price > 0) {
      return price.toFixed(2);
    }
    return "0.00";
  };

  return (
    <div className="AssignTransporter">
      <div className="transporterDialog">
        <div className="transporterDialogContent">
          <form onSubmit={handleFormSubmit}>
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
                  <strong>Departure Address</strong>
                  <hr />
                  <div className="supplier-editAdress-detail">
                    {address ? (
                      // if address exist , display it
                      <div className="supplier-editAddress-text">{`${address.country}, ${address.city}, ${address.neighborhood}, ${address.street}.`}</div>
                    ) : (
                      // if not exist  , display a message
                      <div className="supplier-editNoAddress-text">
                        <p>No address found, Click 'Edit' to add.</p>
                      </div>
                    )}
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
                    <div className="companyListContainer">
                      {companyList.length > 0 ? (
                        <Radio.Group
                          onChange={(e) => setCompany(e.target.value)}
                          value={company}
                        >
                          {companyList.map((company) => (
                            <Radio
                              key={company._id}
                              value={company._id}
                              style={{ display: "block", marginBottom: "0px" }}
                            >
                              {company.full_name}
                            </Radio>
                          ))}
                        </Radio.Group>
                      ) : (
                        <p style={{ marginBottom: "20px" }}>
                          No transportation companies are available!
                        </p>
                      )}
                    </div>
                    <div className="button-container">
                      <button
                        className="sendButtonStyle"
                        onClick={handlePayment}
                      >
                        CHECKOUT
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
        title="Payment Methods"
        open={isPriceModalVisible}
        onCancel={handleCancelPrice}
        footer={null}
        style={{ width: '800px', height: '600px', top: '200px' }}
        styles={{
          body: { paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' },
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <p style={{ marginBottom: "30px" }}>
          Shipping price based on your selections is:{" "}
          <strong>{calculatedPrice} SAR</strong>
        </p>

        <PayPalScriptProvider options={{ "client-id": clientId }}>
          <PayPalButtons
            style={{
              layout: "vertical",
            }}
            fundingSource="paypal"
            disableFunding="credit,card"
            createOrder={(data, actions) => {
              const formattedPrice = formatPrice(calculatedPrice);
              if (formattedPrice === null || parseFloat(formattedPrice) <= 0) {
                console.error("Invalid price value");
                return;
              }
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: formattedPrice,
                      currency_code: "USD"
                    }
                  }
                ]
              });
            }}
            onApprove={async (data, actions) => {
              return actions.order.capture().then(async (details) => {
                await handleSendRequest(data, details);
              });
            }}
            onError={(err) => {
              console.error("PayPal Checkout Error:", err);
            }}
          />
        </PayPalScriptProvider>
      </Modal>
    </div>
  );
}

export default AssignTransporter;
