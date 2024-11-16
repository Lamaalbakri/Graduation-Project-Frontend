import React, { useState, useEffect } from "react";
import { notification } from "antd";
import moment from "moment";
import logo from "../images/SCMS.png";
//import { fetchContractData } from "../../api/contractAPI";
import "./SmartContractDetails.css";

const SmartContractDetails = () => {
  const [contractData, setContractData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockContractData = {
      purchaseOrderId: "#PO12345",
      transportOrderId: "#TO98765",
      OrderStatus: "delivered",
      sellerName: "Seller Name",
      sellerShortId: "#S123",
      buyerName: "Buyer Name",
      buyerShortId: "#B123",
      transporterName: "Transporter Name",
      transporterId: "#T123",
      totalBuyerPayment: "1000",
      totalTransportPayment: "200",
      sellerAddress: "123 Seller St.",
      buyerAddress: "456 Buyer Ave.",
      items: [
        {
          itemName: "Item 1",
          quantity: 10,
          options: "Option A",
        },
        {
          itemName: "Item 2",
          quantity: 5,
          options: "Option B",
        },
      ],
      estimatedDeliveryDates: ["2024-11-20", "2024-11-25"],
      actualDeliveryDate: "2024-11-22",
      status: "Completed",
      contractCreatedAt: "2024-11-10T15:30:00Z",
      transactionHash: "0xabc123def456gh789ijklmn0",
      blockNumber: "987654",
      transportationType: "Regular Delivery",
      shippingWeight: "7 to 15 tons",
    };
    setContractData(mockContractData);
    setIsLoading(false);
  }, []);

  /*useEffect(() => {
    const loadContractData = async () => {
      try {
        //const data = await fetchContractData();
        setContractData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
        notification.error({
          message: "Error",
          description: "Failed to load contract details.",
        });
        setIsLoading(false);
      }
    };

    loadContractData();
  }, []);*/

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
      <div className="contract-meta">
        <p>
          <span>
            Contract created at:{" "}
            {moment(contractData.contractCreatedAt).format(
              "DD MMM YYYY, HH:mm"
            )}
          </span>
          <span>Transaction hash: {contractData.transactionHash}</span>
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
                <strong>ID:</strong> {contractData.sellerShortId}
              </p>
              <p>
                <strong>Address:</strong> {contractData.sellerAddress}
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
                <strong>ID:</strong> {contractData.buyerShortId}
              </p>
              <p>
                <strong>Address:</strong> {contractData.buyerAddress}
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
              <strong>ID:</strong> {contractData.transporterId}
            </p>
          </div>
        </div>
        <div className="contract-section">
          <h3>Order Details</h3>
          <p>
            <strong>Purchase order ID:</strong> {contractData.purchaseOrderId}
          </p>
          <p>
            <strong>Transport order ID:</strong> {contractData.transportOrderId}
          </p>
          <p>
            <strong>Order status: </strong>
            <span
              className={`status-${contractData.OrderStatus.toLowerCase().replace(
                " ",
                "-"
              )}`}
            >
              {contractData.OrderStatus.charAt(0).toUpperCase() +
                contractData.OrderStatus.slice(1)}
            </span>
          </p>
          <p>
            <strong>Estimated delivery dates:</strong>{" "}
            {contractData.estimatedDeliveryDates.length === 2
              ? `${moment(contractData.estimatedDeliveryDates[0]).format(
                  "DD MMM YYYY"
                )} to ${moment(contractData.estimatedDeliveryDates[1]).format(
                  "DD MMM YYYY"
                )}`
              : "Data not available"}
          </p>
          <p>
            <strong>Actual delivery date:</strong>{" "}
            {contractData.actualDeliveryDate
              ? moment(contractData.actualDeliveryDate).format("DD MMM YYYY")
              : contractData.status === "In Progress"
              ? "Order is still in progress"
              : "Data not available"}
          </p>
          <p>
            <strong>Transportation type:</strong>{" "}
            {contractData.transportationType}
          </p>
          <p>
            <strong>Shipping weight:</strong> {contractData.shippingWeight}
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
    </div>
  );
};

export default SmartContractDetails;
