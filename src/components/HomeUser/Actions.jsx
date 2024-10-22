import { Link } from "react-router-dom";

const Actions = ({ userType }) => {
  return (
    <div>
      {userType === "supplier" && (
        <>
          <div className="actions">
            <Link to="/addRawMaterial">
              <button>
                <i className="fas fa-plus"></i> Add Raw Materials
              </button>
            </Link>
            <Link to="/viewRawMaterial">
              <button>
                <i className="fas fa-eye"></i> View Raw Materials
              </button>
            </Link>
            <Link to="/updateRawMaterial">
              <button>
                <i className="fa-sharp fa-solid fa-pen-to-square"></i> Update
                Raw Materials
              </button>
            </Link>
            <Link to="/viewRawMaterial">
              <button>
                <i className="fas fa-search"></i>  Search for Raw Materials
              </button>
            </Link>
            <Link to="/currentRequests">
              <button>
                <i className="fas fa-tachometer-alt"></i> Current Requests
              </button>
            </Link>
            <Link to="/previousRequests">
              <button>
                <i className="fas fa-history"></i>Previous Requests
              </button>
            </Link>
            <Link to="/searchRequests">
              <button>
                <i className="fas fa-search"></i> Search for Request
              </button>
            </Link>
          </div>
        </>
      )}

      {userType === "transporter" && (
        <>
          <div
            className="actions"
            style={{
              justifyContent: "center",
              gap: "15px",
              whiteSpace: "nowrap",
            }}
          >
            <Link to="/currentTransportRequests">
              <button>
                <i className="fas fa-tachometer-alt"></i>
                Current Transport Requests
              </button>
            </Link>
            <Link to="/previousTransportRequests">
              <button>
                <i className="fas fa-history"></i> Previous Transport Requests
              </button>
            </Link>
            <Link to="/searchTransportRequests">
              <button>
                <i className="fas fa-search"></i> Search for Request
              </button>
            </Link>
          </div>
        </>
      )}

      {userType === "manufacturer" && (
        <>
          <div className="actions">
            <Link to="/addGoods">
              <button>
                <i className="fas fa-plus"></i> Add Goods
              </button>
            </Link>
            <Link to="/viewGoods">
              <button>
                <i className="fas fa-eye"></i> View Goods
              </button>
            </Link>
            <Link to="/updateGoods">
              <button>
                <i className="fa-sharp fa-solid fa-pen-to-square"></i> Update
                Goods
              </button>
            </Link>
            <Link to="/addSuppliers">
              <button>
                <i className="fas fa-tachometer-alt"></i> Add Suppliers
              </button>
            </Link>
            <Link to="/viewSuppliers">
              <button>
                <i className="fas fa-history"></i> Create Order
              </button>
            </Link>
            <Link to="/viewOrders">
              <button>
                <i className="fas fa-search"></i> View Orders
              </button>
            </Link>
          </div>
        </>
      )}

      {userType === "distributor" && <></>}

      {userType === "retailer" && <></>}
    </div>
  );
};

export default Actions;
