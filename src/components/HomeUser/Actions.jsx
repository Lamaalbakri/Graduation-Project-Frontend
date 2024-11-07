import { Link } from "react-router-dom";

const Actions = ({ userType, userId }) => {
  return (
    <div>
      {userType === "supplier" && (
        <>
          <div className="actions">
            <Link to="/addRawMaterial/:userId">
              <button>
                <i className="fas fa-plus"></i> Add Raw Materials
              </button>
            </Link>
            <Link to="/viewRawMaterial/:userId">
              <button>
                <i className="fas fa-eye"></i> View Raw Materials
              </button>
            </Link>
            <Link to="/updateRawMaterial/:userId">
              <button>
                <i className="fa-sharp fa-solid fa-pen-to-square"></i> Update
                Raw Materials
              </button>
            </Link>
            <Link to="/viewRawMaterial/:userId">
              <button>
                <i className="fas fa-search"></i>  Search for Raw Materials
              </button>
            </Link>
            <Link to="/currentRequests/:userId">
              <button>
                <i className="fas fa-tachometer-alt"></i> Current Requests
              </button>
            </Link>
            <Link to="/previousRequests/:userId">
              <button>
                <i className="fas fa-history"></i>Previous Requests
              </button>
            </Link>
            <Link to="/searchRequests/:userId">
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
            <Link to="/currentTransportRequests/:userId">
              <button>
                <i className="fas fa-tachometer-alt"></i>
                Current Transport Requests
              </button>
            </Link>
            <Link to="/previousTransportRequests/:userId">
              <button>
                <i className="fas fa-history"></i> Previous Transport Requests
              </button>
            </Link>
            <Link to="/searchTransportRequests/:userId">
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
            <Link to="/addGoods/:userId">
              <button>
                <i className="fas fa-plus"></i> Add Goods
              </button>
            </Link>
            <Link to="/viewGoods/:userId">
              <button>
                <i className="fas fa-eye"></i> View Goods
              </button>
            </Link>
            <Link to="/updateGoods/:userId">
              <button>
                <i className="fa-sharp fa-solid fa-pen-to-square"></i> Update
                Goods
              </button>
            </Link>
            <Link to="/addSuppliers/:userId">
              <button>
                <i className="fas fa-tachometer-alt"></i> Add Suppliers
              </button>
            </Link>
            <Link to="/viewSuppliers/:userId">
              <button>
                <i className="fas fa-history"></i> View Suppliers
              </button>
            </Link>
            <Link to="/shoppingBaskets">
              <button>
                <i className="fas fa-history"></i> Shopping Basket
              </button>
            </Link>
            <Link to="/viewOrders/:userId">
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
