const OrderTimeline = ({ orderStatus }) => {
  // Map the order status to the corresponding stage description
  const statusToStage = {
    pending: "Order Placed",
    accepted: "Order Accepted",
    rejected: "Order Rejected",
    inProgress: "Order inProgress",
    delivered: "Order Delivered",
  };

  const orderStages = [
    "Order Placed",
    "Order Accepted",
    "Order Rejected",
    "Order inProgress",
    "Order Delivered",
  ];

  const stageIcons = {
    "Order Placed": "viewOrder1.png",
    "Order Accepted": "viewOrder2.png",
    "Order Rejected": "viewOrder5.png",
    "Order inProgress": "viewOrder3.png",
    "Order Delivered": "viewOrder4.png",
  };

  const currentStage = statusToStage[orderStatus];

  return (
    <div className="order-timeline">
      {orderStages.map((stage, index) => {
        // Skip "Order Rejected" if the order is not rejected
        if (orderStatus !== "rejected" && stage === "Order Rejected") {
          return null;
        }

        // Skip "Order in Progress" and "Order Delivered" if the order is rejected
        if (
          orderStatus === "rejected" &&
          (stage === "Order inProgress" || stage === "Order Delivered")
        ) {
          return null;
        }

        return (
          <div
            key={index}
            className={`timeline-item ${
              currentStage === stage ? "highlight" : ""
            }`}
          >
            <div className="icon-container">
              <img
                style={{ width: "30px", height: "30px" }}
                src={`/Icons/${stageIcons[stage]}`}
                alt={stage}
              />
            </div>
            <div className="content">
              <div
                className="order_place_check"
                style={{
                  opacity:
                    orderStages.indexOf(currentStage) >= index ? "1" : "0.3",
                }}
              >
                <span></span>
              </div>
              <span className="title_order_place">{stage}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
