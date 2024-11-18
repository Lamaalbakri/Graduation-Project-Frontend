import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { notification } from "antd";
import moment from "moment";
import logo from "../images/SCMS.png";
import { getContract } from "../../api/smartContractAPI";
import "./SmartContractDetails.css";

const SmartContractDetails = () => {
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Smart Contract SCMS";
    return () => {
      document.title = "Supply Chain Management SCMS";
    };
  }, []);

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getContract(id);
        console.log(data);
        if (!data) {
          notification.warning({
            message: "No Data",
            description: "No contract data found for this order.",
          });
        }
        setContractData(data);
      } catch (err) {
        setError(err.message);
        notification.error({
          message: "Error",
          description: `Failed to load contract.`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContractDetails();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="contract-message">Loading contract details...</div>;
  }

  if (!contractData) {
    return (
      <div className="contract-message">No contract data is available.</div>
    );
  }

  return (
    <div className="contract-details-content">
      <div className="contract-createdDate-blockNumber">
        <p>
          Contract created at:{" "}
          {moment(contractData.contractCreatedAt).format("DD MMM YYYY, HH:mm")}
          <span>Block number: {contractData.blockNumber}</span>
        </p>
      </div>

      <div className="header-container">
        <img src={logo} alt="Logo" className="site-logo" />
        <h2 className="contract-title">Smart Contract</h2>
      </div>

      <div className="contract-details-container">
        <div className="contract-row">
          <div className="contract-box">
            <h3>Seller Information</h3>
            <div className="contract-row-item">
              <p>
                <strong>Company name:</strong> {contractData.sellerName}
              </p>
              <p>
                <strong>ID:</strong> #{contractData.sellerShortId}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {contractData.sellerAddress.charAt(0).toUpperCase() +
                  contractData.sellerAddress.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
          <div className="contract-box">
            <h3>Buyer Information</h3>
            <div className="contract-row-item">
              <p>
                <strong>Company name:</strong> {contractData.buyerName}
              </p>
              <p>
                <strong>ID:</strong> #{contractData.buyerShortId}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {contractData.buyerAddress.charAt(0).toUpperCase() +
                  contractData.buyerAddress.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="contract-box-transporter">
          <h3>Transporter Information</h3>
          <div className="contract-row-item">
            <p>
              <strong>Company name:</strong> {contractData.transporterName}
            </p>
            <p>
              <strong>ID:</strong> #{contractData.transporterId}
            </p>
          </div>
        </div>
        <div className="contract-section">
          <h3>Order Details</h3>
          <p>
            <strong>Purchase order ID:</strong> #{contractData.purchaseOrderId}
          </p>
          <p>
            <strong>Transport order ID:</strong> #
            {contractData.transportOrderId}
          </p>
          <p>
            <strong>Order status: </strong>
            <span
              className={`status-${contractData.purchaseOrderStatus
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {contractData.purchaseOrderStatus.charAt(0).toUpperCase() +
                contractData.purchaseOrderStatus.slice(1)}
            </span>
          </p>
          <p>
            <strong>Estimated delivery dates:</strong>{" "}
            {contractData.estimatedDeliveryTimes &&
            contractData.estimatedDeliveryTimes.length === 2 &&
            moment(
              contractData.estimatedDeliveryTimes[0],
              moment.ISO_8601
            ).isValid() &&
            moment(
              contractData.estimatedDeliveryTimes[1],
              moment.ISO_8601
            ).isValid()
              ? `${moment(contractData.estimatedDeliveryTimes[0]).format(
                  "DD MMM YYYY"
                )} to ${moment(contractData.estimatedDeliveryTimes[1]).format(
                  "DD MMM YYYY"
                )}`
              : "Data not available"}
          </p>
          <p>
            <strong>Actual delivery date:</strong>{" "}
            {contractData.purchaseOrderStatus === "inProgress"
              ? "Order is still in progress"
              : contractData.actualDeliveryTime
              ? moment(contractData.actualDeliveryTime).format("DD MMM YYYY")
              : "Data not available"}
          </p>
          <p>
            <strong>Transportation type:</strong> {contractData.transportType}
          </p>
          <p>
            <strong>Shipping weight:</strong> {contractData.weight}
          </p>
        </div>
        <div className="contract-items">
          <table className="order-items-table">
            <thead>
              <tr>
                <th className="item">Item</th>
                <th>Quantity</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {contractData.items.map((item, index) => (
                <tr key={index}>
                  <td className="item">{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.options}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="contract-section">
          <h3>Payments</h3>
          <p>
            <strong>Total buyer payment:</strong>{" "}
            {contractData.totalBuyerPayment} SAR
          </p>
          <p>
            <strong>Total transport payment:</strong>{" "}
            {contractData.totalTransportPayment} SAR
          </p>
        </div>
      </div>
      <button onClick={handlePrint} className="print-button">
        Print Contract
      </button>
      <div className="contract-hash">
        <p>
          <span>
            <span>Transaction hash: {contractData.transactionHash}</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SmartContractDetails;
