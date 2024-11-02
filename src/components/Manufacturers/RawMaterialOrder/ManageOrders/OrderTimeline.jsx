const OrderTimeline = ({ orderStatus }) => {
  // Map the order status to the corresponding stage description
  const statusToStage = {
    'pending': 'Order Placed',
    'accepted': 'Order received',
    'rejected': 'Order Rejected',
    'inProgress': 'Order Processed',
    'delivered': 'Ready to Pick up'
  };

  const orderStages = [
    'Order Placed',
    'Order received',
    'Order Rejected',
    'Order Processed',
    'Ready to Pick up'
  ];

  const stageIcons = {
    'Order Placed': 'viewOrder1.png',
    'Order received': 'viewOrder2.png',
    'Order Rejected': 'viewOrder5.png',
    'Order Processed': 'viewOrder3.png',
    'Ready to Pick up': 'viewOrder4.png'
  };

  const currentStage = statusToStage[orderStatus];

  return (
    <div className="order-timeline">
      {orderStages.map((stage, index) => {
        // Skip "Order Rejected" if the order is not rejected
        if (orderStatus !== 'rejected' && stage === 'Order Rejected') {
          return null;
        }

        // Skip "Order Processed" and "Ready to Pick up" if the order is rejected
        if (orderStatus === 'rejected' && (stage === 'Order Processed' || stage === 'Ready to Pick up')) {
          return null;
        }

        return (
          <div
            key={index}
            className={`timeline-item ${currentStage === stage ? 'highlight' : ''}`}
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
                  opacity: orderStages.indexOf(currentStage) >= index ? "1" : "0.3"
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
